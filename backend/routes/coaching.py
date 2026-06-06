"""
AI Coaching Summary — local template engine.
Generates detailed, exercise-specific feedback from session metrics.
No external API calls — fully offline.

Replace generate_coaching_summary() with Claude API call when ready.
"""

import os
import random
from fastapi import APIRouter
from models.session import CoachingRequest, CoachingResponse, AICoachChatRequest, AICoachChatResponse
from google import genai
from google.genai import types

router = APIRouter()



# ── Score band ─────────────────────────────────────────────────────────────────

def _band(score: float) -> str:
    if score >= 90: return "excellent"
    if score >= 75: return "good"
    if score >= 55: return "needs_improvement"
    return "high_risk"


# ── Per-exercise, per-band openers ─────────────────────────────────────────────

OPENERS = {
    "squat": {
        "excellent":          "Outstanding squat mechanics today — your depth and alignment were textbook.",
        "good":               "Solid squat session. Your depth was good on most reps and your alignment held up well under fatigue.",
        "needs_improvement":  "You're building the right habits with your squat, but there's clear room for consistency gains.",
        "high_risk":          "There are some significant form concerns in today's squat session that need addressing before increasing load.",
    },
    "pushup": {
        "excellent":          "Exceptional push-up form — your body alignment and elbow path were locked in throughout.",
        "good":               "Good push-up session. Your depth was consistent and your core stayed mostly engaged.",
        "needs_improvement":  "You showed effort in the push-up session, but alignment and depth need more consistency.",
        "high_risk":          "Core bracing was a major issue in today's push-up session — this must be fixed before adding volume.",
    },
    "deadlift": {
        "excellent":          "Elite deadlift mechanics — your spine stayed neutral and your hip hinge was efficient throughout.",
        "good":               "Good deadlift session. Your hip hinge pattern is developing well and your spine held up for most reps.",
        "needs_improvement":  "Your deadlift fundamentals are there, but spine neutrality needs work — especially as fatigue sets in.",
        "high_risk":          "Serious spinal rounding was detected in your deadlift. This is the primary cause of disc injuries — reduce weight immediately.",
    },
}

# ── Score context ──────────────────────────────────────────────────────────────

def _score_context(avg: float, best: float, reps: int) -> str:
    lines = [f"You averaged {avg:.0f}/100 this session"]
    if best and best > avg:
        lines.append(f"with your best rep hitting {best:.0f}/100")
    if reps > 0:
        lines.append(f"across {reps} reps detected")
    return " ".join(lines) + "."


# ── Per-issue drill prescriptions ──────────────────────────────────────────────

DRILLS = {
    "knee_valgus": (
        "Your biggest fix — KNEE CAVE: "
        "Before every squat session, do 3×15 clamshells and 3×15 side-lying hip abductions. "
        "During squats, place a resistance band just above the knees and actively push out against it on every rep. "
        "Cue yourself: 'spread the floor with your feet'."
    ),
    "forward_lean": (
        "Your biggest fix — FORWARD LEAN: "
        "Add goblet squats (light KB or DB held at chest) to your warm-up — 3×8 reps. "
        "This forces you to sit back and stay upright. "
        "Also check ankle mobility: if heels rise, elevate them on a 5mm plate while you work on calf/ankle flexibility."
    ),
    "hip_sag": (
        "Your biggest fix — HIP SAG: "
        "Your core isn't bracing properly. Before your push-up sets, do 3×20s dead bugs — "
        "lower back pressed into the floor, extend opposite arm/leg slowly. "
        "During push-ups, squeeze your glutes hard and brace like you're about to take a punch."
    ),
    "elbow_flare": (
        "Your biggest fix — ELBOW FLARE: "
        "Switch to close-grip push-ups for 2 weeks — hands shoulder-width, elbows track at 45° from torso. "
        "Cue: 'elbows towards your hip pockets' on the way down. "
        "This also builds more tricep strength which transfers directly to bench press."
    ),
    "lumbar_rounding": (
        "Your biggest fix — LUMBAR ROUNDING: "
        "This is the highest-priority deadlift fix. Drop to 60% of your current weight immediately. "
        "Practice 3×8 Romanian deadlifts focusing on maintaining a neutral spine — push hips back, "
        "keep chest tall, stop when you feel hamstring tension. "
        "Add 3×10 Jefferson curls at bodyweight to build controlled spinal flexion strength."
    ),
    "hyperextension": (
        "Your biggest fix — HYPEREXTENSION AT LOCKOUT: "
        "At the top of the deadlift, think 'stand tall' not 'squeeze back'. "
        "The cue is: glutes squeeze, hips forward, ribs down. "
        "If you're leaning back, you're probably compensating for weak glutes — "
        "add 3×12 hip thrusts to your accessory work."
    ),
}

# ── Generic improvement tips ───────────────────────────────────────────────────

GENERIC_TIPS = {
    "squat": [
        "Focus on breathing — big breath in before descent, brace, exhale at the top.",
        "Record yourself from the side to verify knee tracking and depth — self-video feedback accelerates improvement dramatically.",
        "Add 2-second pauses at the bottom of each squat to build positional strength and body awareness.",
    ],
    "pushup": [
        "If full push-ups are too hard to maintain form, do incline push-ups on a bench — perfect form beats volume.",
        "Try 3-count descents (3 seconds down, explode up) — this builds more strength than fast reps.",
        "Add scapular push-ups (shoulder blade protraction) to your warm-up to build the foundational shoulder stability.",
    ],
    "deadlift": [
        "Before each set, take a full breath into your belly (not your chest), brace 360°, then pull.",
        "Use the 'leg press the floor' cue — imagine you're pushing the ground away rather than pulling the bar up.",
        "Video your setup from the side — hips should be above knees, shoulders above the bar, eyes forward.",
    ],
}

# ── Progression advice ─────────────────────────────────────────────────────────

PROGRESSIONS = {
    "excellent": [
        "You're ready to add 2.5–5% more load next session. Keep form as the priority.",
        "At this level, the next frontier is consistency under fatigue — do a back-off set at 80% weight.",
    ],
    "good": [
        "Don't rush to add weight — master form at current load for 3 consecutive sessions first.",
        "Add 1–2 reps per session rather than increasing weight. Solid reps build the neural pattern.",
    ],
    "needs_improvement": [
        "Consider dropping 10–15% of the weight to focus on perfecting the movement pattern.",
        "Quality > quantity. 5 perfect reps are worth more than 10 sloppy reps for long-term progress.",
    ],
    "high_risk": [
        "Strongly recommend reducing weight by 20–30% and drilling the movement at sub-maximal load.",
        "Consider working with a coach or physical therapist to ingrain correct movement patterns before loading further.",
    ],
}

CLOSERS = [
    "Every session is data — you're getting better by showing up and being intentional.",
    "Consistent practice beats perfection. The athletes who improve fastest are the ones who film, review, and adjust.",
    "Rome wasn't built in a day. Nail the pattern, then add load.",
    "The form you practice now is the habit you'll have under max effort — make it count.",
]


def _fallback_coaching_summary(req: CoachingRequest) -> str:
    exercise = req.exercise.lower()
    avg = req.avg_form_score
    best = req.best_score or avg
    reps = req.reps_detected or 0
    issues = req.issues_detected or []
    band = _band(avg)

    # 1. Opener
    opener = OPENERS.get(exercise, {}).get(band, "Good effort today.")

    # 2. Score context
    score_ctx = _score_context(avg, best, reps)

    # 3. Issue-specific drill (most critical issue first)
    drill = ""
    for issue in issues:
        if issue in DRILLS:
            drill = DRILLS[issue]
            break

    if not drill:
        # Generic tip if no specific issues
        tips = GENERIC_TIPS.get(exercise, [])
        if tips:
            drill = random.choice(tips)

    # 4. Progression advice
    progression = random.choice(PROGRESSIONS.get(band, PROGRESSIONS["good"]))

    # 5. Closer
    closer = random.choice(CLOSERS)

    # Assemble
    parts = [opener, score_ctx]
    if drill:
        parts.append(drill)
    parts.append(progression)
    parts.append(closer)

    return "\n\n".join(parts)


def generate_coaching_summary(req: CoachingRequest) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return _fallback_coaching_summary(req)
        
    try:
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
        You are an elite, encouraging AI fitness coach. Provide a concise, actionable coaching summary for a user's {req.exercise} session.
        
        Session Data:
        - Exercise: {req.exercise}
        - Average Form Score: {req.avg_form_score:.0f}/100
        - Best Rep Score: {req.best_score or req.avg_form_score:.0f}/100
        - Reps Detected: {req.reps_detected or 0}
        - Specific Form Issues Detected: {", ".join(req.issues_detected) if req.issues_detected else "None"}
        
        Instructions:
        1. Keep it to 3 or 4 short, encouraging sentences.
        2. Specifically address the form issues detected (e.g. if knee_valgus, tell them to push their knees out).
        3. Do not use generic greetings, just jump straight into the coaching.
        4. Provide one specific mobility or warmup drill they can do next time to fix their biggest issue.
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _fallback_coaching_summary(req)


# ── Route ──────────────────────────────────────────────────────────────────────

@router.post("/summary", response_model=CoachingResponse)
async def get_coaching_summary(request: CoachingRequest):
    """
    Generate a coaching summary based on session metrics.
    Calls Gemini API if GEMINI_API_KEY is present, else falls back to local template.
    """
    summary = generate_coaching_summary(request)
    return CoachingResponse(
        summary=summary,
        exercise=request.exercise,
        avg_form_score=request.avg_form_score,
    )


@router.post("/chat", response_model=AICoachChatResponse)
async def chat_with_coach(request: AICoachChatRequest):
    """
    Interactive chat with the AI Coach using session history as context.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return AICoachChatResponse(reply="I am currently offline. Please provide an API key to access AI coaching.")

    try:
        client = genai.Client(api_key=api_key)
        
        # Build the system instructions
        system_prompt = (
            "You are an elite, highly knowledgeable fitness AI Coach. "
            "Your job is to answer the user's questions about their workout history, form, and progress. "
            "Keep your answers concise, encouraging, and highly specific to the data provided. "
            "Do not provide medical advice. "
            "Here is the context of the user's most recent workout sessions (most recent first):\n"
        )
        
        for idx, s in enumerate(request.session_context):
            system_prompt += f"Session {idx+1}: {s.get('exercise', 'unknown')} | Score: {s.get('score', s.get('form_score', 0))} | Reps: {s.get('reps', 0)} | Issues: {', '.join(s.get('issues', []))}\n"

        # Construct the conversation history for Gemini
        contents = [
            {"role": "user", "parts": [{"text": system_prompt + "\n\nUser Question: " + request.message}]}
        ]
        
        history_contents = []
        for msg in request.chat_history:
            history_contents.append(
                {"role": msg.role, "parts": [{"text": msg.text}]}
            )
        
        final_contents = history_contents + contents

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=final_contents,
        )
        return AICoachChatResponse(reply=response.text.strip())
    except Exception as e:
        print(f"Gemini API Chat Error: {e}")
        return AICoachChatResponse(reply="I'm sorry, I couldn't process your request right now due to a server error.")
