/**
 * Calculate the angle (in degrees) at joint B, given three points A, B, C.
 * Uses the dot product of vectors BA and BC.
 */
export function calculateAngle(A, B, C) {
  const v1 = { x: A.x - B.x, y: A.y - B.y }
  const v2 = { x: C.x - B.x, y: C.y - B.y }

  const dot = v1.x * v2.x + v1.y * v2.y
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)

  if (mag1 === 0 || mag2 === 0) return 0

  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
  return Math.acos(cosAngle) * (180 / Math.PI)
}

/** Landmark visibility (0–1); 1 if the model didn't report one. */
function vis(lm) {
  return lm && lm.visibility !== undefined ? lm.visibility : 1
}

/**
 * Returns false only if a landmark is missing or essentially invisible.
 * The floor is intentionally low (0.2): MediaPipe assigns low visibility to the
 * far-side limbs in a side-on view, but its position estimate is still usable
 * for form analysis. A high cutoff caused side-view squats/push-ups to return
 * null on every frame ("no frames detected / 0 reps").
 */
function isVisible(landmark, threshold = 0.2) {
  return landmark && (landmark.visibility === undefined || landmark.visibility >= threshold)
}

/** Summed visibility of a set of landmarks — used to pick the camera-facing side. */
function sideScore(...lms) {
  return lms.reduce((s, lm) => s + vis(lm), 0)
}

/**
 * MediaPipe Pose landmark indices (for reference):
 * 0  = nose
 * 11 = left shoulder, 12 = right shoulder
 * 13 = left elbow, 14 = right elbow
 * 15 = left wrist, 16 = right wrist
 * 23 = left hip, 24 = right hip
 * 25 = left knee, 26 = right knee
 * 27 = left ankle, 28 = right ankle
 */

export function getSquatAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const lShoulder = landmarks[11], rShoulder = landmarks[12]
  const lHip = landmarks[23], rHip = landmarks[24]
  const lKnee = landmarks[25], rKnee = landmarks[26]
  const lAnkle = landmarks[27], rAnkle = landmarks[28]

  // Use whichever leg the camera sees best (side-on filming occludes one side).
  const useLeft = sideScore(lHip, lKnee, lAnkle) >= sideScore(rHip, rKnee, rAnkle)
  const shoulder = useLeft ? lShoulder : rShoulder
  const hip = useLeft ? lHip : rHip
  const knee = useLeft ? lKnee : rKnee
  const ankle = useLeft ? lAnkle : rAnkle

  if (!isVisible(hip) || !isVisible(knee) || !isVisible(ankle)) return null

  const kneeAngle = calculateAngle(hip, knee, ankle)
  const hipAngle = calculateAngle(shoulder, hip, knee)

  const spineAngle = Math.abs(Math.atan2(shoulder.x - hip.x, -(shoulder.y - hip.y)) * (180 / Math.PI))

  // Knee valgus only reads correctly from the front, where both knees+ankles are
  // clearly visible — otherwise skip it to avoid false cave alerts in side views.
  const valgusMeasurable = vis(lKnee) > 0.5 && vis(lAnkle) > 0.5 && vis(rKnee) > 0.5 && vis(rAnkle) > 0.5
  const kneeValgus = valgusMeasurable && (lKnee.x < lAnkle.x || rKnee.x > rAnkle.x)
  const kneeValgusAmount = valgusMeasurable ? Math.max(0, lAnkle.x - lKnee.x, rKnee.x - rAnkle.x) : 0

  return { kneeAngle, hipAngle, spineAngle, kneeValgus, kneeValgusAmount }
}

export function getPushupAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const nose = landmarks[0]
  const lShoulder = landmarks[11], rShoulder = landmarks[12]
  const lElbow = landmarks[13], rElbow = landmarks[14]
  const lWrist = landmarks[15], rWrist = landmarks[16]
  const lHip = landmarks[23], rHip = landmarks[24]
  const lAnkle = landmarks[27], rAnkle = landmarks[28]

  // Push-ups are filmed side-on — use the camera-facing arm/side only.
  const useLeft = sideScore(lShoulder, lElbow, lWrist, lHip) >= sideScore(rShoulder, rElbow, rWrist, rHip)
  const shoulder = useLeft ? lShoulder : rShoulder
  const elbow = useLeft ? lElbow : rElbow
  const wrist = useLeft ? lWrist : rWrist
  const hip = useLeft ? lHip : rHip
  const ankle = useLeft ? lAnkle : rAnkle

  if (!isVisible(shoulder) || !isVisible(elbow) || !isVisible(wrist) || !isVisible(hip)) return null

  const elbowAngle = calculateAngle(shoulder, elbow, wrist)

  // Hip sag/pike: where the hip sits relative to the shoulder→ankle line.
  let hipDeviation = 0
  if (isVisible(ankle)) {
    const t = (hip.x - shoulder.x) / (ankle.x - shoulder.x + 0.0001)
    const expectedHipY = shoulder.y + t * (ankle.y - shoulder.y)
    hipDeviation = hip.y - expectedHipY // + = sag, - = pike
  }
  const hipSagAmount = Math.abs(hipDeviation)

  const elbowFlare = calculateAngle(shoulder, elbow, hip)
  const spineAngle = isVisible(ankle) ? calculateAngle(shoulder, hip, ankle) : 180

  return {
    elbowAngle,
    hipSagAmount,
    hipDeviation,
    spineAngle,
    elbowFlare,
    midShoulder: shoulder,
    midHip: hip,
    midAnkle: ankle,
  }
}

export function getDeadliftAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const lShoulder = landmarks[11], rShoulder = landmarks[12]
  const lHip = landmarks[23], rHip = landmarks[24]
  const lKnee = landmarks[25], rKnee = landmarks[26]
  const lAnkle = landmarks[27], rAnkle = landmarks[28]

  const useLeft = sideScore(lShoulder, lHip, lKnee, lAnkle) >= sideScore(rShoulder, rHip, rKnee, rAnkle)
  const shoulder = useLeft ? lShoulder : rShoulder
  const hip = useLeft ? lHip : rHip
  const knee = useLeft ? lKnee : rKnee
  const ankle = useLeft ? lAnkle : rAnkle

  if (!isVisible(shoulder) || !isVisible(hip) || !isVisible(knee) || !isVisible(ankle)) return null

  const spineAngle = Math.abs(Math.atan2(shoulder.x - hip.x, -(shoulder.y - hip.y)) * (180 / Math.PI))
  const kneeAngle = calculateAngle(hip, knee, ankle)
  const hipsAboveKnees = hip.y < knee.y
  const hyperextension = shoulder.x < hip.x
  const shoulderRounding = shoulder.y - hip.y

  return { spineAngle, kneeAngle, hipsAboveKnees, hyperextension, shoulderRounding, midShoulder: shoulder, midHip: hip }
}

// ─── LUNGE ─────────────────────────────────────────────────────────────────
export function getLungeAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const lShoulder = landmarks[11], rShoulder = landmarks[12]
  const leftHip = landmarks[23], rightHip = landmarks[24]
  const leftKnee = landmarks[25], rightKnee = landmarks[26]
  const leftAnkle = landmarks[27], rightAnkle = landmarks[28]

  // Both legs are in the sagittal plane and usually both visible from the side.
  const leftOk = isVisible(leftHip) && isVisible(leftKnee) && isVisible(leftAnkle)
  const rightOk = isVisible(rightHip) && isVisible(rightKnee) && isVisible(rightAnkle)
  if (!leftOk && !rightOk) return null

  const leftKneeAngle = leftOk ? calculateAngle(leftHip, leftKnee, leftAnkle) : 180
  const rightKneeAngle = rightOk ? calculateAngle(rightHip, rightKnee, rightAnkle) : 180

  const frontKneeAngle = Math.min(leftKneeAngle, rightKneeAngle)
  const rearKneeAngle = Math.max(leftKneeAngle, rightKneeAngle)
  const frontIsLeft = leftKneeAngle <= rightKneeAngle

  const midShoulder = { x: (lShoulder.x + rShoulder.x) / 2, y: (lShoulder.y + rShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
  const spineAngle = Math.abs(Math.atan2(midShoulder.x - midHip.x, -(midShoulder.y - midHip.y)) * (180 / Math.PI))

  const frontKnee = frontIsLeft ? leftKnee : rightKnee
  const frontAnkle = frontIsLeft ? leftAnkle : rightAnkle
  const valgusMeasurable = vis(frontKnee) > 0.5 && vis(frontAnkle) > 0.5
  const kneeValgus = valgusMeasurable && (frontIsLeft ? frontKnee.x < frontAnkle.x : frontKnee.x > frontAnkle.x)
  const kneeValgusAmount = valgusMeasurable
    ? Math.max(0, frontIsLeft ? frontAnkle.x - frontKnee.x : frontKnee.x - frontAnkle.x)
    : 0

  return { kneeAngle: frontKneeAngle, frontKneeAngle, rearKneeAngle, spineAngle, kneeValgus, kneeValgusAmount }
}

// ─── PLANK ─────────────────────────────────────────────────────────────────
export function getPlankAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const nose = landmarks[0]
  const lShoulder = landmarks[11], rShoulder = landmarks[12]
  const lElbow = landmarks[13], rElbow = landmarks[14]
  const lWrist = landmarks[15], rWrist = landmarks[16]
  const lHip = landmarks[23], rHip = landmarks[24]
  const lAnkle = landmarks[27], rAnkle = landmarks[28]

  const useLeft = sideScore(lShoulder, lHip, lAnkle) >= sideScore(rShoulder, rHip, rAnkle)
  const shoulder = useLeft ? lShoulder : rShoulder
  const hip = useLeft ? lHip : rHip
  const ankle = useLeft ? lAnkle : rAnkle
  const elbow = useLeft ? lElbow : rElbow
  const wrist = useLeft ? lWrist : rWrist

  if (!isVisible(shoulder) || !isVisible(hip) || !isVisible(ankle)) return null

  const t = (hip.x - shoulder.x) / (ankle.x - shoulder.x + 0.0001)
  const expectedHipY = shoulder.y + t * (ankle.y - shoulder.y)
  const hipDeviation = hip.y - expectedHipY // + = sag, - = pike
  const hipSagAmount = Math.abs(hipDeviation)

  const elbowAngle = isVisible(elbow) && isVisible(wrist) ? calculateAngle(shoulder, elbow, wrist) : null
  const headNeutral = shoulder.y - nose.y

  return { hipSagAmount, hipDeviation, elbowAngle, headNeutral, midShoulder: shoulder, midHip: hip, midAnkle: ankle }
}

// ─── JUMP LANDING ──────────────────────────────────────────────────────────
export function getJumpLandingAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11], rightShoulder = landmarks[12]
  const leftHip = landmarks[23], rightHip = landmarks[24]
  const leftKnee = landmarks[25], rightKnee = landmarks[26]
  const leftAnkle = landmarks[27], rightAnkle = landmarks[28]

  const leftOk = isVisible(leftHip) && isVisible(leftKnee) && isVisible(leftAnkle)
  const rightOk = isVisible(rightHip) && isVisible(rightKnee) && isVisible(rightAnkle)
  if (!leftOk && !rightOk) return null

  const leftKneeAngle = leftOk ? calculateAngle(leftHip, leftKnee, leftAnkle) : null
  const rightKneeAngle = rightOk ? calculateAngle(rightHip, rightKnee, rightAnkle) : null
  const both = leftOk && rightOk
  const kneeAngle = both ? (leftKneeAngle + rightKneeAngle) / 2 : (leftKneeAngle ?? rightKneeAngle)
  const kneeAsymmetry = both ? Math.abs(leftKneeAngle - rightKneeAngle) : 0

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
  const spineAngle = Math.abs(Math.atan2(midShoulder.x - midHip.x, -(midShoulder.y - midHip.y)) * (180 / Math.PI))

  const valgusMeasurable = both && vis(leftKnee) > 0.5 && vis(rightKnee) > 0.5
  const kneeValgus = valgusMeasurable && (leftKnee.x < leftAnkle.x || rightKnee.x > rightAnkle.x)
  const kneeValgusAmount = valgusMeasurable ? Math.max(0, leftAnkle.x - leftKnee.x, rightKnee.x - rightAnkle.x) : 0

  return { kneeAngle, leftKneeAngle, rightKneeAngle, kneeAsymmetry, spineAngle, kneeValgus, kneeValgusAmount }
}

// ─── HIGH KNEES ────────────────────────────────────────────────────────────
export function getHighKneesAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11], rightShoulder = landmarks[12]
  const leftHip = landmarks[23], rightHip = landmarks[24]
  const leftKnee = landmarks[25], rightKnee = landmarks[26]

  if (!isVisible(leftHip) || !isVisible(rightHip) || !isVisible(leftKnee) || !isVisible(rightKnee)) return null

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  const raisedKneeIsLeft = leftKnee.y < rightKnee.y
  const raisedKnee = raisedKneeIsLeft ? leftKnee : rightKnee
  const raisedHip = raisedKneeIsLeft ? leftHip : rightHip

  const hipFlexionAngle = calculateAngle(midShoulder, raisedHip, raisedKnee)
  const leftHipFlexion = calculateAngle(midShoulder, leftHip, leftKnee)
  const rightHipFlexion = calculateAngle(midShoulder, rightHip, rightKnee)
  const kneeHeightRatio = midHip.y - raisedKnee.y
  const spineAngle = Math.abs(Math.atan2(midShoulder.x - midHip.x, -(midShoulder.y - midHip.y)) * (180 / Math.PI))

  return { hipFlexionAngle, leftHipFlexion, rightHipFlexion, kneeHeightRatio, spineAngle, kneeAngle: hipFlexionAngle }
}

// ─── SUMO SQUAT TO STAND ───────────────────────────────────────────────────
export function getSumoSquatAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11], rightShoulder = landmarks[12]
  const leftHip = landmarks[23], rightHip = landmarks[24]
  const leftKnee = landmarks[25], rightKnee = landmarks[26]
  const leftAnkle = landmarks[27], rightAnkle = landmarks[28]

  if (!isVisible(leftHip) || !isVisible(rightHip) || !isVisible(leftKnee) || !isVisible(rightKnee)) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
  const spineAngle = Math.abs(Math.atan2(midShoulder.x - midHip.x, -(midShoulder.y - midHip.y)) * (180 / Math.PI))

  const ankleWidth = Math.abs(rightAnkle.x - leftAnkle.x)
  const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x)
  const stanceRatio = shoulderWidth > 0.01 ? ankleWidth / shoulderWidth : 1
  const kneesTrackingOut = leftKnee.x <= leftAnkle.x && rightKnee.x >= rightAnkle.x

  return { kneeAngle, leftKneeAngle, rightKneeAngle, spineAngle, stanceRatio, kneesTrackingOut }
}

// ─── BUTT KICKS ────────────────────────────────────────────────────────────
export function getButtKicksAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11], rightShoulder = landmarks[12]
  const leftHip = landmarks[23], rightHip = landmarks[24]
  const leftKnee = landmarks[25], rightKnee = landmarks[26]
  const leftAnkle = landmarks[27], rightAnkle = landmarks[28]

  if (!isVisible(leftHip) || !isVisible(rightHip) || !isVisible(leftKnee) || !isVisible(rightKnee)) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  const bentKneeAngle = Math.min(leftKneeAngle, rightKneeAngle)

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
  const spineAngle = Math.abs(Math.atan2(midShoulder.x - midHip.x, -(midShoulder.y - midHip.y)) * (180 / Math.PI))

  return { leftKneeAngle, rightKneeAngle, bentKneeAngle, spineAngle, kneeAngle: bentKneeAngle }
}

// ─── POGO JUMPS ────────────────────────────────────────────────────────────
export function getPogoJumpAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11], rightShoulder = landmarks[12]
  const leftHip = landmarks[23], rightHip = landmarks[24]
  const leftKnee = landmarks[25], rightKnee = landmarks[26]
  const leftAnkle = landmarks[27], rightAnkle = landmarks[28]

  if (!isVisible(leftHip) || !isVisible(rightHip) || !isVisible(leftKnee) || !isVisible(rightKnee)) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2
  const kneeAsymmetry = Math.abs(leftKneeAngle - rightKneeAngle)

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
  const spineAngle = Math.abs(Math.atan2(midShoulder.x - midHip.x, -(midShoulder.y - midHip.y)) * (180 / Math.PI))

  return { kneeAngle, leftKneeAngle, rightKneeAngle, kneeAsymmetry, spineAngle, hipY: midHip.y }
}

// ─── DISPATCHER ────────────────────────────────────────────────────────────
export function getExerciseAngles(exercise, landmarks) {
  switch (exercise) {
    case 'squat':       return getSquatAngles(landmarks)
    case 'pushup':      return getPushupAngles(landmarks)
    case 'deadlift':    return getDeadliftAngles(landmarks)
    case 'lunge':       return getLungeAngles(landmarks)
    case 'plank':       return getPlankAngles(landmarks)
    case 'jumpLanding': return getJumpLandingAngles(landmarks)
    case 'highKnees':   return getHighKneesAngles(landmarks)
    case 'sumoSquat':   return getSumoSquatAngles(landmarks)
    case 'buttKicks':   return getButtKicksAngles(landmarks)
    case 'pogoJump':    return getPogoJumpAngles(landmarks)
    default:            return null
  }
}
