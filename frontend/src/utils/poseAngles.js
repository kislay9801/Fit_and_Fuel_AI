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
    kneeValgusAmount: Math.max(0, leftAnkle.x - leftKnee.x), // how far inward
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
  const hipSagAmount = Math.abs(midHip.y - expectedHipY) // in normalized coords (0-1)

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
