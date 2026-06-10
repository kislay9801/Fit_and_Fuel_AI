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
    "lunge": {
        "excellent":          "Excellent lunge control — your front-knee depth and torso position were dialed in throughout.",
        "good":               "Solid lunge session. Your depth was consistent and your balance held up well on most reps.",
        "needs_improvement":  "Your lunge pattern is coming along, but front-knee depth and stability need more consistency.",
        "high_risk":          "Your front knee is caving and balance is shaky — fix alignment before adding load, this is an ACL risk.",
    },
    "plank": {
        "excellent":          "Rock-solid plank — your body held a perfectly rigid line from head to heels.",
        "good":               "Good plank hold. Your alignment was strong for most of the hold with only minor hip drift.",
        "needs_improvement":  "You're holding the position, but your hips are drifting out of line — core endurance is the next focus.",
        "high_risk":          "Your hips are sagging significantly, which loads your lower back. Shorten the hold and prioritise a rigid line.",
    },
    "jumpLanding": {
        "excellent":          "Outstanding landing mechanics — soft, deep, symmetrical knee bend that absorbs impact beautifully.",
        "good":               "Good landing control. You're absorbing impact well, with only small asymmetries between legs.",
        "needs_improvement":  "Your landings need more knee bend to absorb force — stiff landings transfer stress to your joints.",
        "high_risk":          "Stiff or knee-cave landings detected — this is the single biggest ACL-tear risk factor. Address it before plyometrics.",
    },
    "highKnees": {
        "excellent":          "Great high-knees work — strong knee drive above hip level with a tall, stable torso.",
        "good":               "Good high-knees session. Your knee height was solid with mostly upright posture.",
        "needs_improvement":  "Drive those knees higher — you're not consistently reaching hip level, and your torso is drifting forward.",
        "high_risk":          "Knee height is low and you're leaning back to compensate — reset your posture and focus on quality drive.",
    },
    "sumoSquat": {
        "excellent":          "Excellent sumo squat — wide stance, deep position, and knees tracking right over the toes.",
        "good":               "Good sumo squat session. Your depth and stance were solid on most reps.",
        "needs_improvement":  "Your sumo squat needs a wider stance and more depth to open the hips fully.",
        "high_risk":          "Your knees are caving inward on the sumo squat — drive them out hard to protect the joint.",
    },
    "buttKicks": {
        "excellent":          "Crisp butt kicks — full heel-to-glute range with a tall, controlled torso.",
        "good":               "Good butt kicks. Your range of motion was solid with mostly upright posture.",
        "needs_improvement":  "Snap those heels higher toward your glutes — your range is a bit short right now.",
        "high_risk":          "Range of motion is limited and your torso is leaning — slow down and focus on a full, controlled kick.",
    },
    "pogoJump": {
        "excellent":          "Perfect pogo mechanics — stiff, springy ankles with minimal knee bend and even loading.",
        "good":               "Good pogo jumps. Your legs stayed mostly stiff with quick, reactive ground contact.",
        "needs_improvement":  "You're bending your knees too much — pogo jumps should bounce off stiff ankles, not deep squats.",
        "high_risk":          "Excessive knee bend and uneven landings detected — reset to small, stiff, ankle-driven hops.",
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
    "stiff_landing": (
        "Your biggest fix — STIFF LANDING: "
        "You're landing with straight legs, sending impact straight into your knees and hips. "
        "Practice 3×8 'stick the landing' drops from a low box — land softly, sink into a 70–90° knee bend, "
        "and hold for 2 seconds. Cue: 'land like a ninja, quiet feet'."
    ),
    "valgus_landing": (
        "Your biggest fix — KNEE CAVE ON LANDING: "
        "Your knees collapse inward when you land — the #1 mechanism of ACL tears. "
        "Do 3×12 banded lateral walks and 3×10 single-leg box step-downs focusing on keeping the kneecap "
        "pointed over your second toe. Cue on every landing: 'knees out, drive the floor apart'."
    ),
    "asymmetric_landing": (
        "Your biggest fix — UNEVEN LANDING: "
        "One leg is absorbing more force than the other. Add 3×8 single-leg Romanian deadlifts and "
        "single-leg squats per side to even out the strength imbalance. Film from the front to confirm "
        "both knees bend equally on landing."
    ),
    "knee_cave_sumo": (
        "Your biggest fix — KNEES CAVING (SUMO): "
        "Your knees drift inward as you stand from the sumo squat. Loop a band above your knees and "
        "push out against it for 3×12 reps. Cue: 'screw your feet into the floor and shove the knees out' "
        "throughout the whole rep, especially as you drive up."
    ),
    "excess_knee_bend": (
        "Your biggest fix — TOO MUCH KNEE BEND (POGO): "
        "Pogo jumps are ankle-driven — your knees should stay almost straight and springy. "
        "Practice 3×20 pogo hops in place focusing on snapping off the balls of your feet with stiff legs. "
        "Cue: 'stiff springs, not squats' — minimise ground contact time."
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
    "lunge": [
        "Step into a 2-second pause at the bottom of each lunge to build single-leg balance and control.",
        "Keep ~90% of your weight through the front heel — this protects the knee and loads the glutes.",
        "Film from the front to confirm your front knee tracks over your toes and doesn't drift inward.",
    ],
    "plank": [
        "Build endurance with intervals — 3×30s holds with perfect form beat one long sagging hold.",
        "Squeeze your glutes and quads hard the whole time; a plank is an active full-body brace, not a rest.",
        "Tuck your chin slightly and look at the floor just ahead of your hands to keep your neck neutral.",
    ],
    "jumpLanding": [
        "Always land toe-to-heel and sink into the bend — think of your legs as shock absorbers.",
        "Start with drop landings from a low box before progressing to jumps for height or distance.",
        "Film from the front: both knees should bend equally and stay stacked over your feet.",
    ],
    "highKnees": [
        "Pump your arms in sync with your knees — strong arm drive lifts the knees higher with less effort.",
        "Stay on the balls of your feet and keep contact times short and snappy.",
        "Brace your core and stand tall — leaning back to lift the knees just stresses your lower back.",
    ],
    "sumoSquat": [
        "Point your toes out 30–45° and track your knees in the same direction as your feet.",
        "Add a 2-second pause at the bottom to build hip and groin mobility through the full range.",
        "Drive your knees out and your hips down — think of opening the floor with your feet.",
    ],
    "buttKicks": [
        "Keep the movement quick and light — this is a dynamic warm-up, prioritise speed over force.",
        "Stay tall and let the heels flick up from the knee; avoid leaning forward to reach your glutes.",
        "Use it as a pre-run drill to fire up the hamstrings and raise your cadence.",
    ],
    "pogoJump": [
        "Imagine the floor is hot — minimise ground contact time and bounce straight back up.",
        "Keep your ankles stiff and reactive; the power comes from your calves, not your knees.",
        "Stay tall with a braced core and let the rebound do the work — small, fast, springy hops.",
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
    exercise = req.exercise  # camelCase IDs (e.g. 'jumpLanding') are the dict keys — do not lowercase
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


def _local_chat_response(request: AICoachChatRequest) -> str:
    """Fallback chat reply generated from session data — no API key required."""
    sessions = request.session_context
    msg = request.message.lower()

    if not sessions:
        return (
            "I don't have any session data to work with yet. "
            "Complete a workout first and I'll be able to give you personalised feedback!"
        )

    scores = [s.get('score', s.get('form_score', 0)) for s in sessions]
    avg = sum(scores) / len(scores) if scores else 0
    best = max(scores) if scores else 0
    exercises = [s.get('exercise', '') for s in sessions]
    most_common = max(set(exercises), key=exercises.count) if exercises else 'unknown'
    all_issues = [i for s in sessions for i in s.get('issues', [])]
    top_issue = max(set(all_issues), key=all_issues.count) if all_issues else None

    if any(k in msg for k in ('progress', 'improving', 'getting better', 'trend')):
        if avg >= 80:
            return f"Your form is in great shape! Averaging {avg:.0f}/100 across your last {len(sessions)} sessions with a peak of {best:.0f}. Keep pushing the intensity."
        elif avg >= 60:
            return f"You're making steady progress — {avg:.0f}/100 average with a best of {best:.0f}. Consistency is your biggest lever right now."
        else:
            return f"You're putting in the reps — {avg:.0f}/100 average so far. Focus on the form cues during each set and the score will climb."

    if any(k in msg for k in ('issue', 'problem', 'wrong', 'fix', 'improve')):
        if top_issue:
            drill = DRILLS.get(top_issue, f"Work on correcting your {top_issue.replace('_', ' ')} — it's the most frequent flag in your sessions.")
            return f"Your most common issue is {top_issue.replace('_', ' ')}. {drill}"
        return "No recurring issues detected across your sessions — nice work keeping form clean!"

    if any(k in msg for k in ('exercise', 'workout', 'train', 'focus')):
        return f"You've trained {most_common} most frequently. Your average score is {avg:.0f}/100. Mixing in complementary movements would round out your programme nicely."

    if any(k in msg for k in ('score', 'form', 'rating')):
        return f"Your average form score is {avg:.0f}/100 across {len(sessions)} sessions, with a personal best of {best:.0f}. {'Excellent consistency!' if avg >= 80 else 'Room to grow — focus on the basics each rep.'}"

    return (
        f"Based on your {len(sessions)} recent sessions, your average form score is {avg:.0f}/100. "
        f"{'Great work — your form is very solid!' if avg >= 75 else 'Keep focusing on quality reps over quantity.'} "
        "Ask me about your progress, common issues, or how to fix a specific problem and I can give you targeted advice."
    )


@router.post("/chat", response_model=AICoachChatResponse)
async def chat_with_coach(request: AICoachChatRequest):
    """
    Interactive chat with the AI Coach using session history as context.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return AICoachChatResponse(reply=_local_chat_response(request))

    try:
        client = genai.Client(api_key=api_key)

        # Build system instruction with session context
        system_instruction = (
            "You are an elite, highly knowledgeable fitness AI Coach. "
            "Answer the user's questions about their workout history, form, and progress. "
            "Be concise, encouraging, and specific to the data provided. "
            "Do not provide medical advice.\n\n"
            "User's recent sessions (most recent first):\n"
        )
        for idx, s in enumerate(request.session_context):
            system_instruction += (
                f"Session {idx+1}: {s.get('exercise', 'unknown')} | "
                f"Score: {s.get('score', s.get('form_score', 0))} | "
                f"Reps: {s.get('reps', 0)} | "
                f"Issues: {', '.join(s.get('issues', [])) or 'none'}\n"
            )

        # Build conversation history for Gemini.
        # Gemini requires history to start with a 'user' turn and alternate user/model.
        # Strip leading model turns (the UI sends the initial greeting as a model message).
        history_contents = []
        for msg in request.chat_history:
            history_contents.append({"role": msg.role, "parts": [{"text": msg.text}]})

        while history_contents and history_contents[0]["role"] == "model":
            history_contents.pop(0)

        # Append the new user message
        history_contents.append({"role": "user", "parts": [{"text": request.message}]})

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=history_contents,
            config=types.GenerateContentConfig(system_instruction=system_instruction),
        )
        return AICoachChatResponse(reply=response.text.strip())
    except Exception as e:
        print(f"Gemini API Chat Error: {e}")
        return AICoachChatResponse(reply=_local_chat_response(request))
