"""
Local JSON file-based session storage.
Sessions are stored in backend/data/sessions.json
No database required.
"""

import json
import uuid
import os
from datetime import datetime, timezone
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
SESSIONS_FILE = DATA_DIR / "sessions.json"


def _ensure_file():
    DATA_DIR.mkdir(exist_ok=True)
    if not SESSIONS_FILE.exists():
        SESSIONS_FILE.write_text("[]", encoding="utf-8")


def _read() -> list:
    _ensure_file()
    try:
        return json.loads(SESSIONS_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []


def _write(sessions: list):
    _ensure_file()
    SESSIONS_FILE.write_text(
        json.dumps(sessions, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def create_session(user_id: str, record: dict) -> dict:
    sessions = _read()
    session = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "exercise": record.get("exercise"),
        "form_score": round(record.get("form_score", 0), 1),
        "reps": record.get("reps", 0),
        "issues": record.get("issues", []),
        "best_score": record.get("best_score"),
        "worst_score": record.get("worst_score"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    sessions.append(session)
    _write(sessions)
    return session


def get_sessions(user_id: str, limit: int = 100) -> list:
    sessions = _read()
    user_sessions = [s for s in sessions if s.get("user_id") == user_id]
    # Sort newest first
    user_sessions.sort(key=lambda s: s.get("created_at", ""), reverse=True)
    return user_sessions[:limit]


def delete_session(session_id: str, user_id: str) -> bool:
    sessions = _read()
    original_len = len(sessions)
    sessions = [
        s for s in sessions
        if not (s.get("id") == session_id and s.get("user_id") == user_id)
    ]
    if len(sessions) < original_len:
        _write(sessions)
        return True
    return False


def get_all_sessions() -> list:
    return _read()
