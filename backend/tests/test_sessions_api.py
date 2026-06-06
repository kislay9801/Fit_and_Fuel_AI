import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import storage
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def _headers(user_id: str) -> dict[str, str]:
    return {"X-User-Id": user_id}


def test_session_create_fetch_and_owner_scoped_delete(tmp_path, monkeypatch):
    monkeypatch.setattr(storage, "DATA_DIR", tmp_path)
    monkeypatch.setattr(storage, "SESSIONS_FILE", tmp_path / "sessions.json")

    payload = {
        "user_id": "user_a",
        "exercise": "squat",
        "form_score": 88,
        "reps": 5,
        "issues": ["forward_lean"],
        "best_score": 95,
        "worst_score": 70,
    }

    create_res = client.post("/api/sessions/", json=payload, headers=_headers("user_a"))
    assert create_res.status_code == 200
    session_id = create_res.json()["session"]["id"]

    forbidden_fetch = client.get("/api/sessions/user_a", headers=_headers("user_b"))
    assert forbidden_fetch.status_code == 403

    fetch_res = client.get("/api/sessions/user_a", headers=_headers("user_a"))
    assert fetch_res.status_code == 200
    assert fetch_res.json()["count"] == 1

    wrong_owner_delete = client.delete(
        f"/api/sessions/{session_id}?user_id=user_b",
        headers=_headers("user_b"),
    )
    assert wrong_owner_delete.status_code == 404

    delete_res = client.delete(
        f"/api/sessions/{session_id}?user_id=user_a",
        headers=_headers("user_a"),
    )
    assert delete_res.status_code == 200


def test_rejects_invalid_session_payload(tmp_path, monkeypatch):
    monkeypatch.setattr(storage, "DATA_DIR", tmp_path)
    monkeypatch.setattr(storage, "SESSIONS_FILE", tmp_path / "sessions.json")

    payload = {
        "user_id": "user_a",
        "exercise": "bench",
        "form_score": 150,
        "reps": -1,
    }

    res = client.post("/api/sessions/", json=payload, headers=_headers("user_a"))
    assert res.status_code == 422


def test_missing_user_header_is_rejected(tmp_path, monkeypatch):
    monkeypatch.setattr(storage, "DATA_DIR", tmp_path)
    monkeypatch.setattr(storage, "SESSIONS_FILE", tmp_path / "sessions.json")

    payload = {
        "user_id": "user_a",
        "exercise": "pushup",
        "form_score": 80,
    }

    res = client.post("/api/sessions/", json=payload)
    assert res.status_code == 401
