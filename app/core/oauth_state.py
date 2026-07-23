"""
Secure, single-use OAuth state tokens for the GitHub connect flow.

Your original code passed the Sentinel username directly as `state`:

    state={current_username}

That's forgeable: anyone can call GET /github/callback?code=<theirs>&state=<any_username>
and link their own GitHub account to an arbitrary Sentinel user. `state` is
supposed to be a value the server generates and later verifies, so it can
confirm a callback really came from a redirect it issued — not something
the client gets to choose.

This hands out a random token via create_state() and accepts it exactly
once via consume_state(), with a short expiry. Nothing else in your app
changes shape because of this — it's a two-function utility, not a new
layer.

In-memory storage: fine for a single-process deployment. If you run
multiple uvicorn workers, swap the dict for Redis or a DB table behind the
same two function signatures.
"""

import secrets
import time

_STATE_TTL_SECONDS = 600  # 10 minutes to complete the GitHub authorize flow
_states: dict[str, tuple[str, float]] = {}  # state -> (username, expires_at)


def create_state(username: str) -> str:
    token = secrets.token_urlsafe(32)
    _states[token] = (username, time.time() + _STATE_TTL_SECONDS)
    _cleanup_expired()
    return token


def consume_state(state: str) -> str | None:
    entry = _states.pop(state, None)
    if entry is None:
        return None
    username, expires_at = entry
    if time.time() > expires_at:
        return None
    return username


def _cleanup_expired() -> None:
    now = time.time()
    expired = [key for key, (_, expires_at) in _states.items() if expires_at < now]
    for key in expired:
        _states.pop(key, None)
