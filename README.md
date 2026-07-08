# Fit & Fuel AI Coach

Real-time exercise form analysis in the browser. MediaPipe pose estimation tracks
33 body landmarks, frontend utilities compute joint angles, count reps, score form,
and flag injury risks, and an AI coach (Gemini) turns each session into plain-language
feedback. Sessions are stored in Firebase, and the whole thing deploys to Vercel as a
single project (static frontend + a serverless coaching API).

Around the analysis engine sits a small athlete-education platform: a progress
dashboard (trend chart, training streak, data-driven recommendation), session
history with an AI coach chat, and reference sections for Nutrition, Injuries &
Recovery, and a demo Exercise Library.

## Stack

- **Frontend:** Vite + React + Tailwind CSS
- **Pose estimation:** MediaPipe Pose Landmarker, running in the browser
- **Auth:** Firebase Authentication (email/password + Google sign-in)
- **Database:** Firebase Firestore (`users/{uid}` profiles, `sessions` records)
- **Coaching API:** FastAPI calling the Gemini API, with a built-in local template
  fallback when no key is configured. Deployed as a Vercel Python serverless function.
- **Hosting:** Vercel (frontend build + `/api/*` serverless function on one domain)

## Core flow

1. Sign in with Firebase (email/password or Google).
2. Pick an exercise from the library (10 available — see below).
3. The app shows the **recommended camera angle** for that exercise (e.g. film a
   squat side-on) so the analysis can see what it needs to grade.
4. Use the live camera or upload a video.
5. MediaPipe extracts pose landmarks in the browser.
6. Frontend utilities compute joint angles, count reps, score each rep, and flag risks
   — suppressing any fault that can't be judged from the chosen angle (e.g. knee cave
   isn't flagged from a side-on squat).
7. The session (score, reps, issues, AI summary) is saved to Firestore.
8. The coaching API returns a personalized summary; the AI Coach chat answers
   follow-up questions using your session history as context.

## Supported exercises

| Exercise | Type | Key metrics | Risk flags |
| --- | --- | --- | --- |
| Squat | Strength | Knee depth, knee valgus, spine angle | Knee cave, forward lean |
| Push-up | Mobility | Elbow depth, hip alignment, elbow flare | Hips sagging, hips too high, elbow flaring |
| Deadlift | Strength | Spine neutrality, hip hinge, lockout | Lower-back rounding, leaning back at top |
| Forward Lunge | Injury Prevention | Front-knee depth, torso angle, valgus | Knee cave, forward lean |
| Forearm Plank | Strength | Body-line alignment, head position | Hips sagging, hips too high |
| Jump Landing Check | Injury Prevention | **Deep** knee absorption, symmetry, valgus | Stiff landing, knees caving, uneven landing |
| High Knees | Cardio | Knee-lift height (hip flexion), torso | Forward lean |
| Sumo Squat to Stand | Mobility | Depth, stance width, knee tracking | Knees caving in |
| Butt Kicks | Cardio | Heel-to-glute range, torso | Forward lean |
| Pogo Jumps | Cardio | **Stiff** legs (minimal knee bend), symmetry | Excess knee bend, uneven landing |

> Jump Landing and Pogo Jumps look similar but grade opposite mechanics — Jump Landing
> rewards a *deep* knee bend to absorb impact (ACL screening), while Pogo Jumps reward
> *stiff* legs and an ankle-driven bounce.

## Rep counting

Reps use **adaptive, range-of-motion-relative detection** rather than fixed angle
thresholds. A rep is counted when the tracked joint angle dips and then recovers by a
meaningful amount relative to the extremes the person actually hits. This self-calibrates
to any camera angle, distance, and body — so a "straight" leg reading 150° on camera
still counts reps correctly. Alternating exercises (high knees, butt kicks) track each leg
independently; pogo jumps count from the body's vertical bounce.

## Scoring

Each completed rep is graded at its **peak (deepest) frame**, and the session score is the
average of those per-rep grades (isometric holds like the plank are graded per frame).
Each exercise score is a weighted blend of component scores (0–100):

- Squat: `0.4·knee + 0.3·valgus + 0.3·spine`
- Push-up: `0.4·elbow + 0.4·hip + 0.2·elbow flare`
- Deadlift: `0.5·spine + 0.3·hip hinge + 0.2·lockout`
- Lunge: `0.4·front knee + 0.3·valgus + 0.3·spine`
- Plank: `0.7·alignment + 0.3·head`
- Jump Landing: `0.5·absorption + 0.25·symmetry + 0.25·spine`
- High Knees: `0.5·knee height + 0.5·torso`
- Sumo Squat: `0.4·depth + 0.3·stance + 0.3·knee tracking`
- Butt Kicks: `0.6·kick depth + 0.4·torso`
- Pogo Jumps: `0.5·stiffness + 0.25·symmetry + 0.25·torso`

Score bands: **90+** Excellent · **75–89** Good · **55–74** Needs Improvement · **below 55** High Risk.

## Companion features

- **Dashboard** — training streak counter, a form-score trend chart with 7-day /
  monthly / 6-month views (real calendar aggregation), and an AI recommendation
  derived from your most-flagged issues.
- **History** — every saved session with reps, plain-language issue explanations,
  and an AI Coach chat that answers questions using your history as context.
- **Nutrition** — six functional categories (energy, muscle, bone, blood, immune,
  nerve/muscle signaling) with nutrient descriptions and food sources, plus an
  injury → nutrient lookup.
- **Injuries & Recovery** — plain-language guides to common injuries (ACL, Achilles,
  adductor, labrum) with recovery outlook and recommended exercises.
- **Exercise Library** — categorized rehab/prevention/plyometric/strength exercises,
  each with its recommended filming angle and demo videos.
- **Admin** — an owner-only page listing app users and their stats.

## Project structure

```text
frontend/
  src/
    components/      UI, MediaPipe overlay, AI coach chat, sidebar, modal
    pages/           Landing, Auth, Dashboard, ExerciseSelect, Session, History, Admin
      services/      Nutrition, Injuries, ExercisesCatalog, Athletes
    firebase/        Firebase init, auth, Firestore helpers
    data/            Nutrition, injuries, and exercise-catalog content
    utils/           Angle math, scoring, risk detection, adaptive rep counting,
                     recording-angle guidance, issue explanations, admin gate
api/
  index.py           Vercel serverless entrypoint (mounts the coaching router)
backend/
  main.py            FastAPI app (full local backend incl. session storage)
  routes/coaching.py Coaching summary + AI chat endpoints (Gemini, with fallback)
  routes/sessions.py Local JSON session API (local dev only; the app uses Firestore)
  models/session.py  Pydantic models
  storage.py         Local JSON storage helpers
vercel.json          Build + routing (/api/* → serverless, SPA fallback)
requirements.txt     Python deps for the serverless function
firestore.rules      Firestore security rules
```

## Local development

**Frontend**

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm test             # unit tests (angles, scoring, rep counting, sampling)
```

**Backend** (for coaching API locally)

```bash
# from the project root — or just run start_backend.bat on Windows
cd backend
python -m venv venv && venv/Scripts/activate   # Windows
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

In development the frontend calls `http://localhost:8000`; in production it calls the
serverless API on the same origin (no `VITE_API_URL` needed).

## Environment variables

**Frontend** (`frontend/.env`) — Firebase web config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
# Optional: override the coaching API base (leave unset in production)
# VITE_API_URL=http://localhost:8000
```

**Backend / Vercel** — set in the Vercel project's Environment Variables:

```
GEMINI_API_KEY=...    # without it, coaching falls back to local templates
```

## Deployment (Vercel)

The repo deploys as one Vercel project:

1. **Root Directory:** the repository root (so `vercel.json` and `api/` are picked up).
2. **Environment Variables:** add `GEMINI_API_KEY` (and the `VITE_FIREBASE_*` keys).
3. Push to `main` — Vercel builds the frontend and deploys `api/index.py` as a Python
   serverless function. `/api/health` returns `{"status":"ok"}` when it's live.
