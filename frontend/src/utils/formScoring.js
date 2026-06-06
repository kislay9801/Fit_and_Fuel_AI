/**
 * Form scoring engine for each exercise.
 * Based on biomechanical research:
 * - Squat: knee angle 70-100° at bottom, spine <35° lean, no valgus
 * - Push-up: elbow 70-90° at bottom, body straight (< 5% hip deviation)
 * - Deadlift: spine 25-45° lean during lift, hip hinge pattern
 *
 * Returns { total: 0-100, breakdown: {}, feedback: [], isIdle: bool }
 * isIdle=true when pose is detected but person is just standing (not exercising)
 */

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

/** Linear score: 100 inside ideal range, drops linearly outside */
function rangeScore(value, idealMin, idealMax, penaltyPerDegree = 2) {
  if (value >= idealMin && value <= idealMax) return 100
  if (value < idealMin) return clamp(100 - (idealMin - value) * penaltyPerDegree, 0, 100)
  return clamp(100 - (value - idealMax) * penaltyPerDegree, 0, 100)
}

// ─── SQUAT SCORING ─────────────────────────────────────────────────────────

export function scoreSquat(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { kneeAngle, spineAngle, kneeValgus, kneeValgusAmount } = angles
  const feedback = []

  // Idle detection: person is standing upright (knee > 155°)
  const isIdle = kneeAngle > 155
  if (isIdle) {
    return {
      total: 0,
      breakdown: { kneeScore: 0, valgusScore: 0, spineScore: 0 },
      feedback: ['Get into squat position — bend your knees to begin'],
      isIdle: true,
    }
  }

  // ── Knee angle score (most important — 40% weight)
  // Ideal squat depth: 70°–100° (parallel to slightly below parallel)
  // 100–120°: quarter squat → penalize
  // <70°: too deep but not dangerous, small penalty
  let kneeScore
  if (kneeAngle >= 70 && kneeAngle <= 100) {
    kneeScore = 100
    if (kneeAngle >= 85 && kneeAngle <= 100) {
      feedback.push('Perfect squat depth — excellent parallel position!')
    }
  } else if (kneeAngle > 100 && kneeAngle <= 120) {
    kneeScore = rangeScore(kneeAngle, 70, 100, 3)
    feedback.push('Go deeper — aim for thighs parallel to the floor (90° knee angle)')
  } else if (kneeAngle > 120 && kneeAngle <= 155) {
    kneeScore = rangeScore(kneeAngle, 70, 100, 2.5)
    feedback.push('Much more depth needed — you\'re barely bending your knees')
  } else {
    // < 70°: below parallel (ok for advanced, slight penalty)
    kneeScore = rangeScore(kneeAngle, 70, 100, 1.5)
    feedback.push('Very deep squat — ensure knees are tracking over toes')
  }

  // ── Knee valgus score (30% weight)
  // Valgus = knees caving inward (ACL risk)
  let valgusScore = 100
  if (kneeValgus && kneeValgusAmount > 0.015) {
    const severity = kneeValgusAmount * 600 // normalize: 0.05 = 30pts off
    valgusScore = clamp(100 - severity, 0, 100)
    feedback.push('DRIVE KNEES OUT — knee cave detected (ACL risk!)')
  }

  // ── Spine angle score (30% weight)
  // At squat bottom, some forward lean is normal (15-35°)
  // >45° = excessive lean → lower back stress
  let spineScore
  if (spineAngle <= 35) {
    spineScore = 100
  } else if (spineAngle <= 45) {
    spineScore = rangeScore(spineAngle, 0, 35, 1.5)
  } else {
    spineScore = rangeScore(spineAngle, 0, 35, 2)
    feedback.push('Keep your chest up — excessive forward lean stresses your lower back')
  }

  if (feedback.length === 0) {
    feedback.push('Solid squat mechanics — maintain this form throughout the set')
  }

  const total = Math.round(0.4 * kneeScore + 0.3 * valgusScore + 0.3 * spineScore)

  return {
    total,
    breakdown: {
      kneeScore: Math.round(kneeScore),
      valgusScore: Math.round(valgusScore),
      spineScore: Math.round(spineScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── PUSH-UP SCORING ───────────────────────────────────────────────────────

export function scorePushup(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { elbowAngle, hipSagAmount, elbowFlare } = angles
  const feedback = []

  // Idle: arms fully extended (top of push-up) AND hip is straight
  const isIdle = elbowAngle > 155 && hipSagAmount < 0.04
  if (isIdle) {
    return {
      total: 0,
      breakdown: { elbowScore: 0, hipScore: 0, headScore: 0 },
      feedback: ['Lower yourself down to begin the push-up analysis'],
      isIdle: true,
    }
  }

  // ── Elbow depth score (40% weight)
  // Ideal: 70°-95° at the bottom
  let elbowScore
  if (elbowAngle >= 70 && elbowAngle <= 95) {
    elbowScore = 100
    feedback.push('Great depth — chest close to the ground!')
  } else if (elbowAngle > 95 && elbowAngle <= 130) {
    elbowScore = rangeScore(elbowAngle, 70, 95, 2)
    feedback.push('Lower your chest more — aim for upper arms parallel to floor')
  } else if (elbowAngle > 130 && elbowAngle <= 155) {
    elbowScore = rangeScore(elbowAngle, 70, 95, 1.5)
    feedback.push('Much more depth needed — barely bending your elbows')
  } else {
    // Top position — score the alignment
    elbowScore = 70 // partial credit for being in position
  }

  // ── Hip alignment score (40% weight)
  // Hip sag > 5% (0.05 normalized) = sagging; > 15% = dangerous
  // Hip pike > 5% also bad
  let hipScore = 100
  if (hipSagAmount > 0.04) {
    const penalty = (hipSagAmount - 0.04) * 700
    hipScore = clamp(100 - penalty, 0, 100)
    if (hipSagAmount > 0.1) {
      feedback.push('CORE ALERT: Hips sagging badly — brace your abs and glutes')
    } else {
      feedback.push('Tighten your core — hips are dropping slightly')
    }
  }

  // ── Elbow flare score (20% weight)
  // Ideal: 45-60° from torso. >75° = shoulder impingement risk
  let headScore = 100
  if (elbowFlare > 70) {
    headScore = rangeScore(elbowFlare, 0, 65, 1.5)
    feedback.push('Tuck elbows closer to your body (aim for 45° angle) — reduces shoulder stress')
  }

  if (feedback.length === 0) {
    feedback.push('Excellent push-up form — strong alignment and depth!')
  }

  const total = Math.round(0.4 * elbowScore + 0.4 * hipScore + 0.2 * headScore)

  return {
    total,
    breakdown: {
      elbowScore: Math.round(elbowScore),
      hipScore: Math.round(hipScore),
      headScore: Math.round(headScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── DEADLIFT SCORING ──────────────────────────────────────────────────────

export function scoreDeadlift(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { spineAngle, kneeAngle, hipsAboveKnees, hyperextension } = angles
  const feedback = []

  // Idle: person standing upright (spine < 10° lean)
  const isIdle = spineAngle < 10
  if (isIdle) {
    return {
      total: 0,
      breakdown: { spineScore: 0, hipHingeScore: 0, lockoutScore: 0 },
      feedback: ['Hinge at the hips to start the deadlift — push hips back'],
      isIdle: true,
    }
  }

  // ── Spine neutrality score (50% weight)
  // During lift: 25-50° forward lean is normal
  // <15°: too upright (Romanian deadlift pattern but ok)
  // >60°: rounding — herniated disc risk!
  let spineScore
  if (spineAngle >= 25 && spineAngle <= 50) {
    spineScore = 100
  } else if (spineAngle > 50 && spineAngle <= 60) {
    spineScore = rangeScore(spineAngle, 25, 50, 2)
    feedback.push('Chest is dropping — keep your lats engaged and chest tall')
  } else if (spineAngle > 60) {
    spineScore = rangeScore(spineAngle, 25, 50, 3)
    feedback.push('DANGER: Excessive spine rounding — risk of herniated disc! Reduce weight immediately')
  } else if (spineAngle < 25 && spineAngle >= 10) {
    spineScore = rangeScore(spineAngle, 25, 50, 1.5)
    feedback.push('Good uprightness — hinge a bit more at the hip for conventional deadlift')
  } else {
    spineScore = 80 // mild lean, generally fine
  }

  // ── Hip hinge quality score (30% weight)
  // Knee should be 100-155° during a deadlift (not a squat)
  let hipHingeScore = 100
  if (kneeAngle < 90) {
    // Squatting the bar — deadlift starts with hip hinge not knee bend
    hipHingeScore = rangeScore(kneeAngle, 100, 155, 2)
    feedback.push('More hip hinge, less knee bend — push your hips back as you descend')
  } else if (kneeAngle >= 90 && kneeAngle < 110) {
    hipHingeScore = rangeScore(kneeAngle, 100, 155, 1)
  }

  // ── Lockout quality (20% weight)
  let lockoutScore = 100
  if (hyperextension && spineAngle > 45) {
    lockoutScore = 65
    feedback.push('Stand tall at lockout — don\'t hyperextend backward (lumbar strain risk)')
  }

  if (!hipsAboveKnees && kneeAngle > 30) {
    hipHingeScore = Math.min(hipHingeScore, 55)
    if (!feedback.some(f => f.includes('hip'))) {
      feedback.push('Hips must stay above knees — this is a hip hinge, not a squat')
    }
  }

  if (feedback.length === 0 && spineAngle >= 25) {
    feedback.push('Good deadlift form — maintain that neutral spine and hip hinge pattern')
  }

  const total = Math.round(0.5 * spineScore + 0.3 * hipHingeScore + 0.2 * lockoutScore)

  return {
    total,
    breakdown: {
      spineScore: Math.round(spineScore),
      hipHingeScore: Math.round(hipHingeScore),
      lockoutScore: Math.round(lockoutScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── SCORE BAND ────────────────────────────────────────────────────────────

export function getScoreBand(score) {
  if (score >= 90) return { label: 'Excellent', emoji: '✅', color: '#10B981', bg: 'rgba(16,185,129,0.15)' }
  if (score >= 75) return { label: 'Good', emoji: '👍', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' }
  if (score >= 55) return { label: 'Needs Improvement', emoji: '⚠️', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' }
  return { label: 'High Risk', emoji: '🔴', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' }
}

// ─── DISPATCHER ────────────────────────────────────────────────────────────

export function scoreExercise(exercise, angles) {
  switch (exercise) {
    case 'squat':    return scoreSquat(angles)
    case 'pushup':   return scorePushup(angles)
    case 'deadlift': return scoreDeadlift(angles)
    default:         return { total: 0, breakdown: {}, feedback: [], isIdle: true }
  }
}
