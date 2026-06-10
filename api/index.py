"""
Vercel serverless entrypoint for the coaching API.

Vercel runs this as a Python serverless function. All /api/* requests are
rewritten to this file (see vercel.json), and FastAPI's own routing matches
the full path (e.g. /api/coaching/summary).

Only the coaching router is mounted — it's stateless (just calls Gemini).
The sessions endpoints are intentionally excluded because they write to disk,
which serverless filesystems don't allow; the frontend persists sessions to
Firestore directly instead.

Set GEMINI_API_KEY in the Vercel project's Environment Variables. If it's
absent the coaching routes fall back to the built-in local templates.
"""

import os
import sys

# Make the existing backend package importable (routes/, models/ live there).
BACKEND_DIR = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import coaching  # noqa: E402  (import after sys.path tweak)

app = FastAPI(title="Fit & Fuel Coaching API (serverless)")

# Same-origin in production, but permissive CORS keeps local dev / previews working.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(coaching.router, prefix="/api/coaching", tags=["Coaching"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "gemini_key_present": bool(os.environ.get("GEMINI_API_KEY"))}
