# Fit & Fuel AI Coach

Real-time exercise form analysis with a React frontend, FastAPI backend, MediaPipe pose estimation, mock authentication, mock coaching summaries, and local JSON session history.

This version intentionally does not use Supabase or Claude. Those integrations are deferred until the core pose analysis pipeline is working reliably.

## Current Stack

- Frontend: Vite + React + Tailwind CSS
- Pose estimation: MediaPipe Pose in the browser
- Backend: FastAPI
- Storage: local JSON file at `data/sessions.json`
- Authentication: mock localStorage auth
- Coaching: local template-based mock summaries

## Core Flow

1. Sign in with mock auth using any email and a password of at least 6 characters.
2. Pick an exercise: squat, push-up, or deadlift.
3. Use the camera or upload a video.
4. MediaPipe extracts pose landmarks in the browser.
5. Frontend utilities calculate joint angles, score form, detect risks, and count reps.
6. The completed session is saved through FastAPI into local JSON storage.
7. The backend returns a mock coaching summary based on session metrics.

## Project Structure

```text
frontend/
  src/
    components/       UI and MediaPipe overlay components
    pages/            Route pages
    utils/            API client, mock auth, angle/scoring/risk/rep logic
backend/
  main.py             FastAPI app
  routes/
    coaching.py       Mock coaching summary endpoint
    sessions.py       Local session history API
  models/
    session.py        Pydantic request/response models
  storage.py          JSON file storage helpers
data/
  sessions.json       Created automatically when sessions are saved
```

## Supported Exercises

| Exercise | Key Metrics                          | Risk Flags                      |
| -------- | ------------------------------------ | ------------------------------- |
| Squat    | Knee angle, knee valgus, spine angle | Knee valgus, forward lean       |
| Push-up  | Elbow angle, hip sag, elbow flare    | Hip sag, elbow flare            |
| Deadlift | Spine angle, knee angle, lockout     | Lumbar rounding, hyperextension |

## Scoring

- Squat: `0.4 * knee + 0.3 * valgus + 0.3 * spine`
- Push-up: `0.4 * elbow + 0.4 * hip + 0.2 * elbow flare`
- Deadlift: `0.5 * spine + 0.3 * hip hinge + 0.2 * lockout`

Score bands:

- 90+: Excellent
- 75-89: Good
- 55-74: Needs Work
- Below 55: High Risk
