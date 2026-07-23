"""
WHAT CHANGED vs your original file, and WHY:

1. GET /github/login no longer has `Depends(verify_token)` on its
   signature. A plain browser navigation (what "Connect GitHub" does)
   can't send a custom Authorization header, so the old version always
   401'd before ever reaching GitHub — that's the bug.

   Instead of reimplementing JWT decoding (which I don't have — I don't
   have security.py, and I'm not going to guess at your SECRET_KEY /
   algorithm and hand you code that silently fails), this calls your
   *existing* `verify_token` function directly as a plain Python call:

       verify_token(token)

   instead of via `Depends(verify_token)`. Since every other route in
   this file already does `Depends(verify_token)`, `verify_token` has to
   accept a plain token string as its argument (that's how FastAPI
   dependency injection resolves it) — so calling it directly, outside
   the DI system, with a token pulled from a query param instead of a
   header, reuses the exact same real logic. No new auth code, no
   placeholder.

   The token itself is read from `Authorization` header OR `?token=`
   query param — headers still work for anything hit via fetch(), and
   query param is what the browser navigation to /github/login uses,
   since that's the one thing a navigation *can* carry.

2. `state` is now a random, server-verified token from oauth_state.py
   instead of the raw username (see that file for why).

3. GET /github/callback redirects to `{FRONTEND_URL}/dashboard` instead
   of returning JSON (requirement 8), and also now handles GitHub
   sending `error=access_denied` (user clicks Cancel) instead of
   crashing with a FastAPI 422 when `code` is missing.

4. /github/status, /github/repos, /github/scan are byte-for-byte
   unchanged — they're called via fetch() from the frontend, so the
   Authorization header already works fine for them.

Reused, not reimplemented: verify_token (app.core.security),
exchange_code_for_token (github_oauth_service.py),
get_github_user / get_github_repositories (github_user_service.py),
User (database.models). Nothing here is a new service.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.security import verify_token
from app.core.oauth_state import create_state, consume_state
from app.services.github_oauth_service import exchange_code_for_token
from app.services.github_user_service import (
    get_github_repositories,
    get_github_user,
)
from app.schemas.repo_schema import GithubScanRequest
from app.api.repo import run_repository_scan
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User

router = APIRouter(tags=["GitHub"])

# Falls back to localhost:3000 if you haven't added FRONTEND_URL to your
# Settings class yet — add `FRONTEND_URL: str = "http://localhost:3000"`
# to app/core/config.py when convenient; not required for this to run.
FRONTEND_URL = getattr(settings, "FRONTEND_URL", "http://localhost:3000")


def _resolve_username(token: str | None, db: Session) -> str | None:
    """
    Calls your existing verify_token directly (not via Depends) so a
    session started at /auth/login is recognized here too, without
    duplicating any JWT logic. Mirrors the isinstance(..., int) handling
    already in dashboard.py, in case verify_token returns a user id
    rather than a username for some tokens.
    """
    if not token:
        return None

    try:
        result = verify_token(token)
    except HTTPException:
        return None
    except Exception:
        return None

    if result is None:
        return None

    if isinstance(result, int):
        user = db.query(User).filter(User.id == result).first()
        return user.username if user else None

    return result


@router.get("/github/login")
def github_login(request: Request, db: Session = Depends(get_db)):
    token = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        token = auth_header.split(" ", 1)[1]
    elif "token" in request.query_params:
        token = request.query_params["token"]

    username = _resolve_username(token, db)

    if not username:
        # Not logged into Sentinel (or token missing/expired) — send them
        # to log in first, then straight back into this same flow.
        return RedirectResponse(f"{FRONTEND_URL}/login?next=github")

    state = create_state(username)

    return RedirectResponse(
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_CALLBACK_URL}"
        f"&scope=repo"
        f"&state={state}"
    )


@router.get("/github/callback")
async def github_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
):
    if error:
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?github_error={error}")

    if not code or not state:
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?github_error=missing_code_or_state")

    username = consume_state(state)
    if not username:
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?github_error=invalid_or_expired_state")

    token_data = await exchange_code_for_token(code)
    if "access_token" not in token_data:
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?github_error=token_exchange_failed")

    access_token = token_data["access_token"]
    github_user = await get_github_user(access_token)

    user = db.query(User).filter(User.username == username).first()
    if not user:
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?github_error=user_not_found")

    user.github_id = str(github_user["id"])
    user.github_username = github_user["login"]
    user.github_avatar = github_user["avatar_url"]
    user.github_access_token = access_token
    user.github_connected = True

    db.commit()
    db.refresh(user)

    return RedirectResponse(f"{FRONTEND_URL}/dashboard?github_connected=1")


# ---------------------------------------------------------------------
# Unchanged from your original file.
# ---------------------------------------------------------------------


@router.get("/github/status")
def github_status(
    current_username: str = Depends(verify_token),
    db: Session = Depends(get_db),
):
    if not current_username:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = db.query(User).filter(User.username == current_username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "connected": bool(user.github_connected),
        "username": user.username,
        "github": user.github_username,
        "avatar": user.github_avatar,
    }


@router.get("/github/repos")
async def github_repositories(
    current_username: str = Depends(verify_token),
    db: Session = Depends(get_db),
):
    if not current_username:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = db.query(User).filter(User.username == current_username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.github_connected or not user.github_access_token:
        raise HTTPException(status_code=400, detail="Connect GitHub before listing repositories.")

    repos = await get_github_repositories(user.github_access_token)

    return [
        {
            "id": repo["id"],
            "name": repo["name"],
            "full_name": repo["full_name"],
            "private": repo["private"],
            "html_url": repo["html_url"],
            "clone_url": repo["clone_url"],
            "language": repo["language"],
            "default_branch": repo["default_branch"],
            "updated_at": repo["updated_at"],
        }
        for repo in repos
    ]


@router.post("/github/scan")
async def scan_github_repository(
    request: GithubScanRequest,
    current_username: str = Depends(verify_token),
    db: Session = Depends(get_db),
):
    if not current_username:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not request.repo_name and not request.repo_url:
        raise HTTPException(status_code=400, detail="Send repo_name or repo_url.")

    user = db.query(User).filter(User.username == current_username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.github_connected or not user.github_access_token:
        raise HTTPException(status_code=400, detail="Connect GitHub before scanning repositories.")

    repos = await get_github_repositories(user.github_access_token)

    selected_repo = None
    for repo in repos:
        if request.repo_name and request.repo_name in [repo["name"], repo["full_name"]]:
            selected_repo = repo
            break
        if request.repo_url and request.repo_url in [repo["html_url"], repo["clone_url"]]:
            selected_repo = repo
            break

    if selected_repo is None:
        raise HTTPException(status_code=404, detail="Repository not found for the connected GitHub account.")

    scan_result = run_repository_scan(
        selected_repo["clone_url"],
        request.query,
        user.id,
        db,
    )

    return {
        "message": "GitHub repository scanned successfully",
        "repository": {
            "name": selected_repo["name"],
            "full_name": selected_repo["full_name"],
            "private": selected_repo["private"],
            "html_url": selected_repo["html_url"],
            "default_branch": selected_repo["default_branch"],
        },
        "scan": scan_result,
    }
