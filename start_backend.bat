@echo off
REM Starts the Fit & Fuel coaching backend (FastAPI + Uvicorn).
REM Keep this window open while using the app — closing it stops the backend.
cd /d "%~dp0backend"
echo Starting backend on http://localhost:8000 ...
echo (Leave this window open. Press Ctrl+C to stop.)
".\venv\Scripts\python.exe" -m uvicorn main:app --reload --port 8000
pause
