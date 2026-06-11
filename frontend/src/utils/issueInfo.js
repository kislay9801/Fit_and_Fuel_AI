/**
 * Human-friendly names and plain-language explanations for the form issues
 * flagged by riskDetection.js. Issues are stored as raw ids (e.g. 'knee_valgus')
 * — this maps them to a readable label and a short "what it means / how to fix"
 * explanation shown to the user after a session.
 */

export const ISSUE_INFO = {
  knee_valgus: {
    label: 'Knee Cave',
    detail: 'Your knees collapse inward instead of tracking over your toes — a leading cause of ACL strain. Cue: push your knees out.',
  },
  forward_lean: {
    label: 'Forward Lean',
    detail: 'Your torso tips too far forward, shifting load onto your lower back. Keep your chest up and core braced.',
  },
  hip_sag: {
    label: 'Hips Sagging',
    detail: 'Your hips drop below a straight body line, arching the lower back. Squeeze your glutes and brace your abs.',
  },
  hip_pike: {
    label: 'Hips Too High',
    detail: 'Your hips lift above a straight body line, breaking your plank/push-up position. Lower them so your body forms one line.',
  },
  elbow_flare: {
    label: 'Elbows Flaring Out',
    detail: 'Your elbows point out near 90° from your body, stressing the shoulders. Tuck them to about 45° from your torso.',
  },
  lumbar_rounding: {
    label: 'Lower-Back Rounding',
    detail: 'Your lower back rounds under load — a major disc-injury risk. Keep a flat, neutral spine and reduce the weight.',
  },
  hyperextension: {
    label: 'Leaning Back at the Top',
    detail: 'You lean back too far at lockout, over-arching the lower back. Finish standing tall with your ribs down.',
  },
  stiff_landing: {
    label: 'Stiff-Leg Landing',
    detail: 'You land with near-straight legs, driving impact into your knees and hips. Bend your knees to absorb the landing.',
  },
  valgus_landing: {
    label: 'Knees Caving on Landing',
    detail: 'Your knees collapse inward as you land — the top ACL-tear risk. Land with knees pushed out over your toes.',
  },
  asymmetric_landing: {
    label: 'Uneven Landing',
    detail: 'One leg absorbs more force than the other. Even out your landing so both legs share the load.',
  },
  knee_cave_sumo: {
    label: 'Knees Caving In',
    detail: 'Your knees drift inward during the sumo squat. Drive them outward, tracking in line with your toes.',
  },
  excess_knee_bend: {
    label: 'Too Much Knee Bend',
    detail: 'You bend your knees too much for a pogo hop. Keep your legs stiff and bounce off your ankles.',
  },
}

/** Returns { label, detail } for an issue id, with a sensible fallback. */
export function getIssueInfo(id) {
  return ISSUE_INFO[id] || { label: String(id).replace(/_/g, ' '), detail: '' }
}
