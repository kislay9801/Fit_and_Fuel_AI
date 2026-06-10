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

  const { elbowAngle, hipSagAmount, hipDeviation, elbowFlare } = angles
  const feedback = []

  // Idle: arms fully extended (top of push-up) AND hip is straight
  const isIdle = elbowAngle > 155 && hipSagAmount < 0.04
  if (isIdle) {
    return {
      total: 0,
      breakdown: { elbowScore: 0, hipScore: 0, elbowFlareScore: 0 },
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
  // Sag (hipDeviation > 0) and pike (hipDeviation < 0) are both penalised equally
  let hipScore = 100
  if (hipSagAmount > 0.04) {
    const penalty = (hipSagAmount - 0.04) * 700
    hipScore = clamp(100 - penalty, 0, 100)
    const isPike = hipDeviation !== undefined && hipDeviation < -0.04
    if (hipSagAmount > 0.1) {
      feedback.push(isPike
        ? 'FORM ALERT: Hips piking up — lower hips so your body forms a straight line'
        : 'CORE ALERT: Hips sagging badly — brace your abs and glutes')
    } else {
      feedback.push(isPike
        ? 'Hips too high — lower them to keep your body straight'
        : 'Tighten your core — hips are dropping slightly')
    }
  }

  // ── Elbow flare score (20% weight)
  // Ideal: 45-60° from torso. >75° = shoulder impingement risk
  let elbowFlareScore = 100
  if (elbowFlare > 70) {
    elbowFlareScore = rangeScore(elbowFlare, 0, 65, 1.5)
    feedback.push('Tuck elbows closer to your body (aim for 45° angle) — reduces shoulder stress')
  }

  if (feedback.length === 0) {
    feedback.push('Excellent push-up form — strong alignment and depth!')
  }

  const total = Math.round(0.4 * elbowScore + 0.4 * hipScore + 0.2 * elbowFlareScore)

  return {
    total,
    breakdown: {
      elbowScore: Math.round(elbowScore),
      hipScore: Math.round(hipScore),
      elbowFlareScore: Math.round(elbowFlareScore),
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

// ─── LUNGE SCORING ──────────────────────────────────────────────────────────
export function scoreLunge(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { kneeAngle, spineAngle, kneeValgus, kneeValgusAmount } = angles
  const feedback = []

  const isIdle = kneeAngle > 155
  if (isIdle) {
    return {
      total: 0,
      breakdown: { kneeScore: 0, valgusScore: 0, spineScore: 0 },
      feedback: ['Step forward and bend your knees to start the lunge analysis'],
      isIdle: true,
    }
  }

  // ── Front knee angle score (40% weight)
  // Ideal lunge depth: front knee at 90° (80–100°)
  let kneeScore
  if (kneeAngle >= 80 && kneeAngle <= 100) {
    kneeScore = 100
    feedback.push('Perfect lunge depth — front thigh parallel to the floor!')
  } else if (kneeAngle > 100 && kneeAngle <= 130) {
    kneeScore = rangeScore(kneeAngle, 80, 100, 2.5)
    feedback.push('Bend your front knee more — aim for 90°')
  } else if (kneeAngle > 130 && kneeAngle <= 155) {
    kneeScore = rangeScore(kneeAngle, 80, 100, 2)
    feedback.push('Deeper lunge needed — step forward further or bend the knee more')
  } else {
    kneeScore = rangeScore(kneeAngle, 80, 100, 1.5)
    feedback.push('Very deep lunge — ensure front knee tracks over toes')
  }

  // ── Knee alignment score (30% weight)
  let valgusScore = 100
  if (kneeValgus && kneeValgusAmount > 0.015) {
    const severity = kneeValgusAmount * 600
    valgusScore = clamp(100 - severity, 0, 100)
    feedback.push('KEEP KNEE ALIGNED — front knee caving inward detected')
  }

  // ── Spine angle score (30% weight) — lunges call for a more upright torso
  let spineScore
  if (spineAngle <= 25) {
    spineScore = 100
  } else if (spineAngle <= 40) {
    spineScore = rangeScore(spineAngle, 0, 25, 1.5)
    feedback.push('Keep your torso more upright during the lunge')
  } else {
    spineScore = rangeScore(spineAngle, 0, 25, 2)
    feedback.push('Excessive forward lean — keep chest tall throughout the lunge')
  }

  if (feedback.length === 0) {
    feedback.push('Great lunge mechanics — maintain alignment throughout the set')
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

// ─── PLANK SCORING ──────────────────────────────────────────────────────────
export function scorePlank(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { hipSagAmount, hipDeviation, headNeutral } = angles
  const feedback = []

  // Person is not in plank position (e.g. standing)
  const isIdle = hipSagAmount > 0.35
  if (isIdle) {
    return {
      total: 0,
      breakdown: { alignmentScore: 0, headScore: 0 },
      feedback: ['Get into a plank position to begin the analysis'],
      isIdle: true,
    }
  }

  // ── Body alignment (70% weight) ─ same penalty logic as push-up
  let alignmentScore = 100
  if (hipSagAmount > 0.04) {
    const penalty = (hipSagAmount - 0.04) * 900
    alignmentScore = clamp(100 - penalty, 0, 100)
    const isPike = hipDeviation !== undefined && hipDeviation < -0.04
    if (hipSagAmount > 0.08) {
      feedback.push(isPike
        ? 'FORM ALERT: Hips piking up — lower hips to form a rigid plank line'
        : 'CORE ALERT: Hips sagging — brace core and squeeze glutes')
    } else {
      feedback.push(isPike
        ? 'Hips slightly high — bring them down for a straight line'
        : 'Hips dropping slightly — engage your core')
    }
  }

  // ── Head / neck neutral (30% weight)
  let headScore = 100
  if (headNeutral !== undefined) {
    if (headNeutral < -0.02) {
      headScore = clamp(100 + headNeutral * 1500, 0, 100)
      feedback.push('Keep your head neutral — don\'t let it drop below your spine')
    } else if (headNeutral > 0.1) {
      headScore = clamp(100 - (headNeutral - 0.1) * 1000, 0, 100)
      feedback.push('Keep your head neutral — don\'t crane your neck up')
    }
  }

  if (feedback.length === 0) {
    feedback.push('Solid plank position — keep breathing and hold strong!')
  }

  const total = Math.round(0.7 * alignmentScore + 0.3 * headScore)

  return {
    total,
    breakdown: {
      alignmentScore: Math.round(alignmentScore),
      headScore: Math.round(headScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── JUMP LANDING SCORING ──────────────────────────────────────────────────
export function scoreJumpLanding(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { kneeAngle, kneeAsymmetry, spineAngle, kneeValgus, kneeValgusAmount } = angles
  const feedback = []

  const isIdle = kneeAngle > 160
  if (isIdle) {
    return {
      total: 0,
      breakdown: { absorptionScore: 0, symmetryScore: 0, spineScore: 0 },
      feedback: ['Jump and land to begin landing mechanics analysis'],
      isIdle: true,
    }
  }

  // ── Absorption depth (50% weight): knees 60–100° at landing
  let absorptionScore
  if (kneeAngle >= 60 && kneeAngle <= 100) {
    absorptionScore = 100
    feedback.push('Excellent landing — knees absorbing impact well!')
  } else if (kneeAngle > 100 && kneeAngle <= 130) {
    absorptionScore = rangeScore(kneeAngle, 60, 100, 2)
    feedback.push('Bend your knees more on landing to absorb impact')
  } else if (kneeAngle > 130) {
    absorptionScore = rangeScore(kneeAngle, 60, 100, 2.5)
    feedback.push('STIFF LANDING: Bend knees deeper — straight-leg landings stress joints')
  } else {
    absorptionScore = rangeScore(kneeAngle, 60, 100, 1.5)
    feedback.push('Very deep landing — aim for 70–90° knee bend for control')
  }

  // ── Bilateral symmetry (25% weight)
  let symmetryScore = 100
  if (kneeAsymmetry > 15) {
    symmetryScore = clamp(100 - (kneeAsymmetry - 15) * 3, 0, 100)
    feedback.push('Uneven landing — left and right legs absorbing differently (compensation risk)')
  }
  if (kneeValgus && kneeValgusAmount > 0.015) {
    const severity = kneeValgusAmount * 600
    symmetryScore = clamp(symmetryScore - severity * 0.5, 0, 100)
    feedback.push('DRIVE KNEES OUT on landing — knee cave significantly raises ACL risk')
  }

  // ── Spine neutral at landing (25% weight)
  let spineScore
  if (spineAngle <= 35) {
    spineScore = 100
  } else if (spineAngle <= 50) {
    spineScore = rangeScore(spineAngle, 0, 35, 1.5)
    feedback.push('Excessive forward lean on landing — maintain athletic posture')
  } else {
    spineScore = rangeScore(spineAngle, 0, 35, 2)
    feedback.push('Too much forward lean at landing — risk of losing balance')
  }

  if (feedback.length === 0) {
    feedback.push('Great landing mechanics — soft, controlled, and symmetrical!')
  }

  const total = Math.round(0.5 * absorptionScore + 0.25 * symmetryScore + 0.25 * spineScore)

  return {
    total,
    breakdown: {
      absorptionScore: Math.round(absorptionScore),
      symmetryScore: Math.round(symmetryScore),
      spineScore: Math.round(spineScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── HIGH KNEES SCORING ────────────────────────────────────────────────────
export function scoreHighKnees(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { hipFlexionAngle, spineAngle } = angles
  const feedback = []

  const isIdle = hipFlexionAngle > 160
  if (isIdle) {
    return {
      total: 0,
      breakdown: { kneeHeightScore: 0, torsoScore: 0 },
      feedback: ['Start lifting your knees to begin high-knees analysis'],
      isIdle: true,
    }
  }

  // ── Knee height (50% weight): hip-flexion angle < 90° = knee above hip level
  let kneeHeightScore
  if (hipFlexionAngle <= 90) {
    kneeHeightScore = 100
    feedback.push('Great knee height — thigh above hip level!')
  } else if (hipFlexionAngle <= 110) {
    kneeHeightScore = rangeScore(hipFlexionAngle, 0, 90, 2)
    feedback.push('Lift your knee higher — aim for thigh parallel to the floor')
  } else if (hipFlexionAngle <= 140) {
    kneeHeightScore = rangeScore(hipFlexionAngle, 0, 90, 1.5)
    feedback.push('Much more knee lift needed — drive that knee up!')
  } else {
    kneeHeightScore = rangeScore(hipFlexionAngle, 0, 90, 1)
    feedback.push('Barely lifting knees — focus on driving each knee toward your chest')
  }

  // ── Torso upright (50% weight)
  let torsoScore
  if (spineAngle <= 15) {
    torsoScore = 100
  } else if (spineAngle <= 25) {
    torsoScore = rangeScore(spineAngle, 0, 15, 2)
    feedback.push('Slight forward lean — stay tall and upright')
  } else {
    torsoScore = rangeScore(spineAngle, 0, 15, 2.5)
    feedback.push('Keep your torso upright — don\'t lean forward during high knees')
  }

  if (feedback.length === 0) {
    feedback.push('Excellent high-knee form — great height and posture!')
  }

  const total = Math.round(0.5 * kneeHeightScore + 0.5 * torsoScore)

  return {
    total,
    breakdown: {
      kneeHeightScore: Math.round(kneeHeightScore),
      torsoScore: Math.round(torsoScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── SUMO SQUAT TO STAND SCORING ───────────────────────────────────────────
export function scoreSumoSquat(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { kneeAngle, stanceRatio, kneesTrackingOut, spineAngle } = angles
  const feedback = []

  const isIdle = kneeAngle > 160
  if (isIdle) {
    return {
      total: 0,
      breakdown: { depthScore: 0, stanceScore: 0, kneeTrackScore: 0 },
      feedback: ['Wide squat down to begin sumo squat analysis'],
      isIdle: true,
    }
  }

  // ── Depth (40% weight): sumo squat target 60–90° (deeper than regular squat)
  let depthScore
  if (kneeAngle >= 60 && kneeAngle <= 90) {
    depthScore = 100
    feedback.push('Perfect depth — thighs parallel or below!')
  } else if (kneeAngle > 90 && kneeAngle <= 120) {
    depthScore = rangeScore(kneeAngle, 60, 90, 2.5)
    feedback.push('Sit deeper — aim for thighs parallel to the floor')
  } else if (kneeAngle > 120) {
    depthScore = rangeScore(kneeAngle, 60, 90, 2)
    feedback.push('Much more depth needed — push your knees out and sit down further')
  } else {
    depthScore = rangeScore(kneeAngle, 60, 90, 1.5)
    feedback.push('Very deep sumo squat — excellent hip mobility!')
  }

  // ── Stance width (30% weight): should be >1.4× shoulder width
  let stanceScore
  if (stanceRatio >= 1.4) {
    stanceScore = 100
  } else if (stanceRatio >= 1.1) {
    stanceScore = clamp(((stanceRatio - 1.1) / 0.3) * 100, 0, 100)
    feedback.push('Widen your stance — sumo squat needs a wider-than-shoulder base')
  } else {
    stanceScore = 40
    feedback.push('Stance too narrow — spread your feet significantly wider')
  }

  // ── Knee tracking out (30% weight)
  let kneeTrackScore = kneesTrackingOut ? 100 : 55
  if (!kneesTrackingOut) {
    feedback.push('Drive your knees outward over your toes — don\'t let them cave in')
  }

  if (feedback.length === 0) {
    feedback.push('Great sumo squat — wide stance, deep position, knees tracking out!')
  }

  const total = Math.round(0.4 * depthScore + 0.3 * stanceScore + 0.3 * kneeTrackScore)

  return {
    total,
    breakdown: {
      depthScore: Math.round(depthScore),
      stanceScore: Math.round(stanceScore),
      kneeTrackScore: Math.round(kneeTrackScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── BUTT KICKS SCORING ────────────────────────────────────────────────────
export function scoreButtKicks(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { bentKneeAngle, spineAngle } = angles
  const feedback = []

  const isIdle = bentKneeAngle > 155
  if (isIdle) {
    return {
      total: 0,
      breakdown: { kickScore: 0, torsoScore: 0 },
      feedback: ['Run in place and kick your heels up to begin analysis'],
      isIdle: true,
    }
  }

  // ── Kick depth (60% weight): ideal ≤ 70° (heel reaching glutes)
  let kickScore
  if (bentKneeAngle <= 70) {
    kickScore = 100
    feedback.push('Excellent butt kick — heel reaching the glutes!')
  } else if (bentKneeAngle <= 90) {
    kickScore = rangeScore(bentKneeAngle, 0, 70, 1.5)
    feedback.push('Good kick height — aim to snap the heel all the way to your glutes')
  } else if (bentKneeAngle <= 120) {
    kickScore = rangeScore(bentKneeAngle, 0, 70, 2)
    feedback.push('Kick higher — actively flex your knee to bring heel up')
  } else {
    kickScore = rangeScore(bentKneeAngle, 0, 70, 1.5)
    feedback.push('Barely kicking — focus on rapid heel-to-glutes range of motion')
  }

  // ── Torso upright (40% weight)
  let torsoScore
  if (spineAngle <= 15) {
    torsoScore = 100
  } else if (spineAngle <= 30) {
    torsoScore = rangeScore(spineAngle, 0, 15, 2)
    feedback.push('Stay upright — slight forward lean detected')
  } else {
    torsoScore = rangeScore(spineAngle, 0, 15, 2.5)
    feedback.push('Keep your torso upright — excessive forward lean during butt kicks')
  }

  if (feedback.length === 0) {
    feedback.push('Great butt kicks — full range of motion and upright posture!')
  }

  const total = Math.round(0.6 * kickScore + 0.4 * torsoScore)

  return {
    total,
    breakdown: {
      kickScore: Math.round(kickScore),
      torsoScore: Math.round(torsoScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── POGO JUMP SCORING ─────────────────────────────────────────────────────
export function scorePogoJump(angles) {
  if (!angles) return { total: 0, breakdown: {}, feedback: [], isIdle: true }

  const { kneeAngle, kneeAsymmetry, spineAngle } = angles
  const feedback = []

  // Idle: standing still (very straight knees + upright)
  const isIdle = kneeAngle > 172 && spineAngle < 8
  if (isIdle) {
    return {
      total: 0,
      breakdown: { stiffnessScore: 0, symmetryScore: 0, torsoScore: 0 },
      feedback: ['Begin pogo jumping to start analysis'],
      isIdle: true,
    }
  }

  // ── Leg stiffness (50% weight): minimal knee bend is the goal for pogo
  // Ideal: 150–168° (brief soft landing, ankle-driven)
  let stiffnessScore
  if (kneeAngle >= 150 && kneeAngle <= 168) {
    stiffnessScore = 100
    feedback.push('Good leg stiffness — ankle-driven propulsion!')
  } else if (kneeAngle >= 135 && kneeAngle < 150) {
    stiffnessScore = rangeScore(kneeAngle, 150, 170, 2)
    feedback.push('Reduce knee bend — pogo jumps use stiff ankles, not deep knee bends')
  } else if (kneeAngle < 135) {
    stiffnessScore = rangeScore(kneeAngle, 150, 170, 2.5)
    feedback.push('Too much knee bend — keep legs stiffer for true pogo movement')
  } else {
    stiffnessScore = 100
  }

  // ── Symmetry (25% weight)
  let symmetryScore = 100
  if (kneeAsymmetry > 10) {
    symmetryScore = clamp(100 - (kneeAsymmetry - 10) * 4, 0, 100)
    feedback.push('Uneven jump — both legs should load equally')
  }

  // ── Torso upright (25% weight)
  let torsoScore
  if (spineAngle <= 10) {
    torsoScore = 100
  } else if (spineAngle <= 20) {
    torsoScore = rangeScore(spineAngle, 0, 10, 3)
    feedback.push('Stay upright — lean detected during pogo jump')
  } else {
    torsoScore = rangeScore(spineAngle, 0, 10, 3)
    feedback.push('Excessive forward lean — stay tall during pogo jumps')
  }

  if (feedback.length === 0) {
    feedback.push('Great pogo jump form — stiff, quick, and controlled!')
  }

  const total = Math.round(0.5 * stiffnessScore + 0.25 * symmetryScore + 0.25 * torsoScore)

  return {
    total,
    breakdown: {
      stiffnessScore: Math.round(stiffnessScore),
      symmetryScore: Math.round(symmetryScore),
      torsoScore: Math.round(torsoScore),
    },
    feedback,
    isIdle: false,
  }
}

// ─── DISPATCHER ────────────────────────────────────────────────────────────

export function scoreExercise(exercise, angles) {
  switch (exercise) {
    case 'squat':       return scoreSquat(angles)
    case 'pushup':      return scorePushup(angles)
    case 'deadlift':    return scoreDeadlift(angles)
    case 'lunge':       return scoreLunge(angles)
    case 'plank':       return scorePlank(angles)
    case 'jumpLanding': return scoreJumpLanding(angles)
    case 'highKnees':   return scoreHighKnees(angles)
    case 'sumoSquat':   return scoreSumoSquat(angles)
    case 'buttKicks':   return scoreButtKicks(angles)
    case 'pogoJump':    return scorePogoJump(angles)
    default:            return { total: 0, breakdown: {}, feedback: [], isIdle: true }
  }
}

/**
 * True for exercises that count discrete reps — their final score should be the
 * average of per-rep peak grades. Isometric holds (plank) are graded per frame.
 */
export function isRepBased(exercise) {
  return exercise !== 'plank'
}
