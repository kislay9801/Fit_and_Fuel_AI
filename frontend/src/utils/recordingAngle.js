/**
 * Recommended camera angle per exercise, and which checks that angle can
 * actually see. The pose model works in 2D, so some faults are only visible
 * from a specific angle (e.g. knee cave / valgus can't be judged from a side-on
 * squat — you need a front view). We tell the user where to film, and the risk
 * detection already suppresses flags whose landmarks aren't clearly visible.
 */

export const RECORDING_ANGLE = {
  squat: {
    angle: 'Side view',
    tip: 'Film side-on (lateral) so the camera sees your knee bend, depth, and back angle. Knee cave is not graded from this angle — use a front view for that.',
  },
  pushup: {
    angle: 'Side view',
    tip: 'Film side-on (lateral) so the camera sees your elbow bend, hip line, and body alignment.',
  },
  deadlift: {
    angle: 'Side view',
    tip: 'Film side-on (lateral) so the camera sees your spine angle and hip hinge.',
  },
  lunge: {
    angle: 'Side view',
    tip: 'Film side-on (lateral) so the camera sees your front-knee depth and torso angle.',
  },
  plank: {
    angle: 'Side view',
    tip: 'Film side-on (lateral) so the camera sees your body line from head to heels.',
  },
  jumpLanding: {
    angle: 'Front view',
    tip: 'Film facing the camera (front-on) so it can see both knees for landing symmetry and knee-cave detection.',
  },
  highKnees: {
    angle: 'Side view',
    tip: 'Film side-on (lateral) so the camera sees how high each knee drives and your torso posture.',
  },
  sumoSquat: {
    angle: 'Front view',
    tip: 'Film facing the camera (front-on) so it can see your stance width and whether your knees track outward.',
  },
  buttKicks: {
    angle: 'Side view',
    tip: 'Film side-on (lateral) so the camera sees your heels kicking toward your glutes and your posture.',
  },
  pogoJump: {
    angle: 'Front view',
    tip: 'Film facing the camera (front-on) so it can see both legs for symmetry and stiffness.',
  },
}

export function getRecordingAngle(exercise) {
  return RECORDING_ANGLE[exercise] || { angle: 'Full body', tip: 'Position the camera so your full body stays in frame.' }
}
