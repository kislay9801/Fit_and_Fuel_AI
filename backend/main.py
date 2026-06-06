from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import coaching, sessions

app = FastAPI(
    title="Fit & Fuel AI Coach API",
    description="Backend for exercise form analysis — local JSON storage, mock coaching",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(coaching.router, prefix="/api/coaching", tags=["Coaching"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])


@app.get("/")
async def root():
    return {
        "name": "Fit & Fuel AI Coach API",
        "version": "1.0.0",
        "status": "running",
        "storage": "local JSON (backend/data/sessions.json)",
        "coaching": "mock (template-based)",
        "endpoints": {
            "POST /api/sessions/": "Save a session",
            "GET  /api/sessions/{user_id}": "Get user sessions",
            "DELETE /api/sessions/{session_id}": "Delete a session",
            "POST /api/coaching/summary": "Get coaching summary",
        },
    }


@app.get("/health")
async def health():
    from storage import get_all_sessions
    try:
        sessions = get_all_sessions()
        storage_ok = True
    except Exception:
        sessions = []
        storage_ok = False

    return {
        "status": "ok",
        "storage": "local_json",
        "storage_ok": storage_ok,
        "total_sessions_stored": len(sessions),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
