from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.core.security import verify_token

from app.database.models import (
    User,
    Repository,
    Scan,
    Vulnerability
)


router = APIRouter()

@router.get("/dashboard")
def get_dashboard(
    user_id:int = Depends(
        verify_token
    ),
    db:Session = Depends(
        get_db
    )
):
    current_user_id = user_id

    if not isinstance(
        current_user_id,
        int
    ):

        user = db.query(User).filter(
            User.username == current_user_id
        ).first()

        if user is None:

            return {
                "error":
                "Invalid or expired user token"
            }

        current_user_id = user.id

    repositories = (
        db.query(Repository).filter(Repository.user_id == current_user_id).all()
    )

    repo_ids = [
        repo.id
        for repo in repositories
    ]

    scans = []

    if repo_ids:

        scans = (
            db.query(Scan).filter(Scan.repository_id.in_(repo_ids)).all()
        )

    scan_ids = [
        scan.id
        for scan in scans
    ]

    vulnerabilities = []

    if scan_ids:

        vulnerabilities = (
            db.query(Vulnerability).filter(Vulnerability.scan_id.in_(scan_ids)).all()
        )

    critical = 0
    high = 0
    medium = 0

    for vuln in vulnerabilities:

        severity = (vuln.severity or "").lower()

        if severity == "critical":
            critical += 1

        elif severity == "high":
            high += 1

        else:
            medium += 1

    # BUG FIX: a new Repository row is created on every scan (see
    # run_repository_scan() in repo.py — it always INSERTs, never looks up
    # an existing row for the same uri), so `len(repositories)` was
    # counting scan events, not distinct repos. A repo scanned 5 times
    # produced 5 Repository rows and inflated this to 5, not 1.
    #
    # total_scans below is unaffected by this bug — each Scan row really
    # does correspond to one scan event, so len(scans) was already correct.
    distinct_uris = {repo.uri for repo in repositories}
    total_repositories = len(distinct_uris)

    # Same underlying duplication leaks into this list too: without
    # dedup, a repo scanned repeatedly could appear multiple times here
    # and crowd out other repos from the last-5 window. Dedupes while
    # preserving the existing "most recent last" ordering assumption the
    # original code made (repositories[-5:]) — walk from the end,
    # keep first-seen (= most recent) occurrence of each uri.
    seen = set()
    recent_repositories = []
    for repo in reversed(repositories):
        if repo.uri in seen:
            continue
        seen.add(repo.uri)
        recent_repositories.append(repo.uri)
        if len(recent_repositories) == 5:
            break

    return {
        "total_repositories": total_repositories,
        "total_scans": len(scans),
        "total_vulnerabilities": len(vulnerabilities),
        "severity": {
            "critical": critical,
            "high": high,
            "medium": medium
        },
        "recent_repositories": recent_repositories
    }
