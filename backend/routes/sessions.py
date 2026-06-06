import logging

from fastapi import APIRouter, Header, HTTPException, Query
from models.session import SessionRecord
from storage import create_session, get_sessions, delete_session

router = APIRouter()
logger = logging.getLogger(__name__)


def verify_user_header(user_id: str, x_user_id: str | None) -> None:
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header.")
    if x_user_id != user_id:
        raise HTTPException(status_code=403, detail="User header does not match requested user.")


@router.post("/")
async def save_session(record: SessionRecord, x_user_id: str | None = Header(default=None, alias="X-User-Id")):
    """Save a completed session to local JSON storage."""
    verify_user_header(record.user_id, x_user_id)
    try:
        session = create_session(record.user_id, {
            "exercise": record.exercise,
            "form_score": record.form_score,
            "reps": record.reps,
            "issues": record.issues,
            "best_score": record.best_score,
            "worst_score": record.worst_score,
        })
        return {"success": True, "session": session}
    except Exception as e:
        logger.exception("Failed to save session")
        raise HTTPException(status_code=500, detail="Could not save session.") from e


@router.get("/{user_id}")
async def fetch_sessions(
    user_id: str,
    limit: int = Query(default=100, ge=1, le=500),
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
):
    """Get session history for a user from local JSON file."""
    verify_user_header(user_id, x_user_id)
    try:
        sessions = get_sessions(user_id, limit=limit)
        return {"sessions": sessions, "count": len(sessions)}
    except Exception as e:
        logger.exception("Failed to fetch sessions")
        raise HTTPException(status_code=500, detail="Could not fetch sessions.") from e


@router.delete("/{session_id}")
async def remove_session(
    session_id: str,
    user_id: str = Query(min_length=1, max_length=128),
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
):
    """Delete a specific session by ID."""
    verify_user_header(user_id, x_user_id)
    deleted = delete_session(session_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {"success": True, "deleted_id": session_id}
