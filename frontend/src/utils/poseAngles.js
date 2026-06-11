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

/** Returns false if a landmark is missing or has low visibility confidence */
function isVisible(landmark, threshold = 0.5) {
  return landmark && (landmark.visibility === undefined || landmark.visibility >= threshold)
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

  // Use left side landmarks (more reliable for side-on view)
  const leftShoulder = landmarks[11]
  const leftHip = landmarks[23]
  const leftKnee = landmarks[25]
  const leftAnkle = landmarks[27]
  const rightKnee = landmarks[26]
  const rightAnkle = landmarks[28]

  if (!isVisible(leftShoulder) || !isVisible(leftHip) || !isVisible(leftKnee) || !isVisible(leftAnkle)) return null

  const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee)

  // Spine angle: angle of shoulder-hip line from vertical
  const shoulderHipDx = leftShoulder.x - leftHip.x
  const shoulderHipDy = leftShoulder.y - leftHip.y
  const spineAngle = Math.abs(Math.atan2(shoulderHipDx, -shoulderHipDy) * (180 / Math.PI))

  // Knee valgus: left knee x should be >= left ankle x (knees out over toes)
  const kneeValgusLeft = leftKnee.x < leftAnkle.x // true = valgus detected
  const kneeValgusRight = rightKnee.x > rightAnkle.x // for right side (mirrored)

  return {
    kneeAngle,
    hipAngle,
    spineAngle,
    kneeValgus: kneeValgusLeft || kneeValgusRight,
    kneeValgusAmount: Math.max(0, leftAnkle.x - leftKnee.x, rightKnee.x - rightAnkle.x), // max cave from either side
  }
}

export function getPushupAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const nose = landmarks[0]
  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftElbow = landmarks[13]
  const rightElbow = landmarks[14]
  const leftWrist = landmarks[15]
  const rightWrist = landmarks[16]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  if (
    !isVisible(leftShoulder) || !isVisible(rightShoulder) ||
    !isVisible(leftElbow) || !isVisible(rightElbow) ||
    !isVisible(leftWrist) || !isVisible(rightWrist) ||
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftAnkle) || !isVisible(rightAnkle)
  ) return null

  // Average left and right for reliability
  const elbowAngle = (
    calculateAngle(leftShoulder, leftElbow, leftWrist) +
    calculateAngle(rightShoulder, rightElbow, rightWrist)
  ) / 2

  // Hip sag: mid-hip should be on line between mid-shoulder and mid-ankle
  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
  const midAnkle = { x: (leftAnkle.x + rightAnkle.x) / 2, y: (leftAnkle.y + rightAnkle.y) / 2 }

  // Interpolate expected hip y on shoulder-ankle line
  const t = (midHip.x - midShoulder.x) / (midAnkle.x - midShoulder.x + 0.0001)
  const expectedHipY = midShoulder.y + t * (midAnkle.y - midShoulder.y)
  // positive = sag (hips dropping below line), negative = pike (hips above line)
  const hipDeviation = midHip.y - expectedHipY
  const hipSagAmount = Math.abs(hipDeviation)

  // Head position: nose vs spine line
  const spineAngle = calculateAngle(midShoulder, midHip, midAnkle)

  // Elbow flare: angle between elbow direction and torso
  const leftElbowFlare = calculateAngle(
    { x: leftShoulder.x, y: leftShoulder.y },
    { x: leftElbow.x, y: leftElbow.y },
    { x: leftHip.x, y: leftHip.y }
  )

  return {
    elbowAngle,
    hipSagAmount,
    hipDeviation,
    spineAngle,
    elbowFlare: leftElbowFlare,
    midShoulder,
    midHip,
    midAnkle,
  }
}

export function getDeadliftAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]

  if (
    !isVisible(leftShoulder) || !isVisible(rightShoulder) ||
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftKnee) || !isVisible(leftAnkle)
  ) return null

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  // Spine angle from vertical (forward lean)
  const spineDx = midShoulder.x - midHip.x
  const spineDy = midShoulder.y - midHip.y
  const spineAngle = Math.abs(Math.atan2(spineDx, -spineDy) * (180 / Math.PI))

  // Knee angle (hip hinge check)
  const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)

  // Hip height vs knee height (hips should be higher)
  const hipsAboveKnees = midHip.y < leftKnee.y // lower y = higher on screen

  // Lockout: at top, shoulders should be behind/above hips (not hyperextended)
  const hyperextension = midShoulder.x < midHip.x // shoulder behind hip = hyperextension (if camera on right side)

  // Thoracic rounding: shoulder y relative to expected position on hip-ankle line
  const hipToAnkleDy = leftAnkle.y - midHip.y
  const shoulderRounding = leftShoulder.y - midHip.y // if positive, shoulder dropped forward

  return {
    spineAngle,
    kneeAngle,
    hipsAboveKnees,
    hyperextension,
    shoulderRounding,
    midShoulder,
    midHip,
  }
}

// ─── LUNGE ─────────────────────────────────────────────────────────────────
export function getLungeAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  if (
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftKnee) || !isVisible(rightKnee) ||
    !isVisible(leftAnkle) || !isVisible(rightAnkle)
  ) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

  // Front leg = more bent knee (smaller angle); rear = less bent
  const frontKneeAngle = Math.min(leftKneeAngle, rightKneeAngle)
  const rearKneeAngle = Math.max(leftKneeAngle, rightKneeAngle)
  const frontIsLeft = leftKneeAngle <= rightKneeAngle

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  const spineDx = midShoulder.x - midHip.x
  const spineDy = midShoulder.y - midHip.y
  const spineAngle = Math.abs(Math.atan2(spineDx, -spineDy) * (180 / Math.PI))

  // Valgus on the front knee
  const frontKnee = frontIsLeft ? leftKnee : rightKnee
  const frontAnkle = frontIsLeft ? leftAnkle : rightAnkle
  const kneeValgus = frontIsLeft
    ? frontKnee.x < frontAnkle.x
    : frontKnee.x > frontAnkle.x
  const kneeValgusAmount = Math.max(0,
    frontIsLeft ? frontAnkle.x - frontKnee.x : frontKnee.x - frontAnkle.x,
  )

  return {
    kneeAngle: frontKneeAngle, // alias used by rep counter
    frontKneeAngle,
    rearKneeAngle,
    spineAngle,
    kneeValgus,
    kneeValgusAmount,
  }
}

// ─── PLANK ─────────────────────────────────────────────────────────────────
export function getPlankAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const nose = landmarks[0]
  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftElbow = landmarks[13]
  const rightElbow = landmarks[14]
  const leftWrist = landmarks[15]
  const rightWrist = landmarks[16]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  if (
    !isVisible(leftShoulder) || !isVisible(rightShoulder) ||
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftAnkle) || !isVisible(rightAnkle)
  ) return null

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
  const midAnkle = { x: (leftAnkle.x + rightAnkle.x) / 2, y: (leftAnkle.y + rightAnkle.y) / 2 }
  const midElbow = { x: (leftElbow.x + rightElbow.x) / 2, y: (leftElbow.y + rightElbow.y) / 2 }

  // Body alignment — same math as push-up hip sag
  const t = (midHip.x - midShoulder.x) / (midAnkle.x - midShoulder.x + 0.0001)
  const expectedHipY = midShoulder.y + t * (midAnkle.y - midShoulder.y)
  const hipDeviation = midHip.y - expectedHipY // positive = sag, negative = pike
  const hipSagAmount = Math.abs(hipDeviation)

  // Elbow angle (forearm plank = ~90°; high plank = ~175°)
  const elbowAngle = isVisible(leftElbow) && isVisible(rightElbow)
    ? (calculateAngle(leftShoulder, leftElbow, leftWrist) + calculateAngle(rightShoulder, rightElbow, rightWrist)) / 2
    : null

  // Head neutrality: nose y relative to shoulder line (negative = head too low)
  const headNeutral = midShoulder.y - nose.y

  return {
    hipSagAmount,
    hipDeviation,
    elbowAngle,
    headNeutral,
    midShoulder,
    midHip,
    midAnkle,
  }
}

// ─── JUMP LANDING ──────────────────────────────────────────────────────────
export function getJumpLandingAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  if (
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftKnee) || !isVisible(rightKnee) ||
    !isVisible(leftAnkle) || !isVisible(rightAnkle)
  ) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2
  const kneeAsymmetry = Math.abs(leftKneeAngle - rightKneeAngle)

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  const spineDx = midShoulder.x - midHip.x
  const spineDy = midShoulder.y - midHip.y
  const spineAngle = Math.abs(Math.atan2(spineDx, -spineDy) * (180 / Math.PI))

  const kneeValgusLeft = leftKnee.x < leftAnkle.x
  const kneeValgusRight = rightKnee.x > rightAnkle.x
  const kneeValgus = kneeValgusLeft || kneeValgusRight
  const kneeValgusAmount = Math.max(0, leftAnkle.x - leftKnee.x, rightKnee.x - rightAnkle.x)

  return {
    kneeAngle,
    leftKneeAngle,
    rightKneeAngle,
    kneeAsymmetry,
    spineAngle,
    kneeValgus,
    kneeValgusAmount,
  }
}

// ─── HIGH KNEES ────────────────────────────────────────────────────────────
export function getHighKneesAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]

  if (
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftKnee) || !isVisible(rightKnee)
  ) return null

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  // Raised knee = higher on screen = lower y value
  const raisedKneeIsLeft = leftKnee.y < rightKnee.y
  const raisedKnee = raisedKneeIsLeft ? leftKnee : rightKnee
  const raisedHip = raisedKneeIsLeft ? leftHip : rightHip

  // Hip-flexion angle: decreases as knee rises (180° = standing, ~80° = knee at hip level)
  const hipFlexionAngle = calculateAngle(midShoulder, raisedHip, raisedKnee)

  // Per-leg hip flexion — needed to count each knee drive independently
  const leftHipFlexion = calculateAngle(midShoulder, leftHip, leftKnee)
  const rightHipFlexion = calculateAngle(midShoulder, rightHip, rightKnee)

  // Positive = knee above hip (good for high knees)
  const kneeHeightRatio = midHip.y - raisedKnee.y

  const spineDx = midShoulder.x - midHip.x
  const spineDy = midShoulder.y - midHip.y
  const spineAngle = Math.abs(Math.atan2(spineDx, -spineDy) * (180 / Math.PI))

  return {
    hipFlexionAngle,
    leftHipFlexion,
    rightHipFlexion,
    kneeHeightRatio,
    spineAngle,
    kneeAngle: hipFlexionAngle, // alias for rep counter
  }
}

// ─── SUMO SQUAT TO STAND ───────────────────────────────────────────────────
export function getSumoSquatAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  if (
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftKnee) || !isVisible(rightKnee) ||
    !isVisible(leftAnkle) || !isVisible(rightAnkle)
  ) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  const spineDx = midShoulder.x - midHip.x
  const spineDy = midShoulder.y - midHip.y
  const spineAngle = Math.abs(Math.atan2(spineDx, -spineDy) * (180 / Math.PI))

  // Stance width relative to shoulder width (sumo should be >1.4×)
  const ankleWidth = Math.abs(rightAnkle.x - leftAnkle.x)
  const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x)
  const stanceRatio = shoulderWidth > 0.01 ? ankleWidth / shoulderWidth : 1

  // Each knee should track outside its ankle (wide tracking)
  const kneesTrackingOut = leftKnee.x <= leftAnkle.x && rightKnee.x >= rightAnkle.x

  return {
    kneeAngle,
    leftKneeAngle,
    rightKneeAngle,
    spineAngle,
    stanceRatio,
    kneesTrackingOut,
  }
}

// ─── BUTT KICKS ────────────────────────────────────────────────────────────
export function getButtKicksAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  if (
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftKnee) || !isVisible(rightKnee) ||
    !isVisible(leftAnkle) || !isVisible(rightAnkle)
  ) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

  // The bent knee is the one currently kicking
  const bentKneeAngle = Math.min(leftKneeAngle, rightKneeAngle)

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  const spineDx = midShoulder.x - midHip.x
  const spineDy = midShoulder.y - midHip.y
  const spineAngle = Math.abs(Math.atan2(spineDx, -spineDy) * (180 / Math.PI))

  return {
    leftKneeAngle,
    rightKneeAngle,
    bentKneeAngle,
    spineAngle,
    kneeAngle: bentKneeAngle, // alias for rep counter
  }
}

// ─── POGO JUMPS ────────────────────────────────────────────────────────────
export function getPogoJumpAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null

  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  if (
    !isVisible(leftHip) || !isVisible(rightHip) ||
    !isVisible(leftKnee) || !isVisible(rightKnee) ||
    !isVisible(leftAnkle) || !isVisible(rightAnkle)
  ) return null

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2
  const kneeAsymmetry = Math.abs(leftKneeAngle - rightKneeAngle)

  const midShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
  const midHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }

  const spineDx = midShoulder.x - midHip.x
  const spineDy = midShoulder.y - midHip.y
  const spineAngle = Math.abs(Math.atan2(spineDx, -spineDy) * (180 / Math.PI))

  return {
    kneeAngle,
    leftKneeAngle,
    rightKneeAngle,
    kneeAsymmetry,
    spineAngle,
    hipY: midHip.y, // vertical position — drives bounce-based rep counting
  }
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
