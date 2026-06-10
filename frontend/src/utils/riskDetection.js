/**
 * Injury risk detection for each exercise.
 * Returns array of { id, label, injury, severity, color, bgColor }
 */

export function detectRisks(angles, exercise) {
  if (!angles) return []
  const risks = []

  if (exercise === 'squat') {
    // Knee valgus → ACL strain risk
    if (angles.kneeValgus && angles.kneeValgusAmount > 0.02) {
      risks.push({
        id: 'knee_valgus',
        label: 'Knee Valgus Detected',
        injury: 'ACL Strain Risk',
        severity: 'high',
        color: '#EF4444',
        bgColor: 'rgba(239,68,68,0.15)',
      })
    }

    // Excessive forward lean >50°
    if (angles.spineAngle > 50) {
      risks.push({
        id: 'forward_lean',
        label: 'Excessive Forward Lean',
        injury: 'Lower Back Stress',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
  }

  if (exercise === 'pushup') {
    // Hip sagging >15% below the shoulder-ankle line
    if (angles.hipSagAmount > 0.15 && (angles.hipDeviation === undefined || angles.hipDeviation > 0)) {
      risks.push({
        id: 'hip_sag',
        label: 'Hip Sagging',
        injury: 'Lower Back Risk',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }

    // Hips piking >10% above the shoulder-ankle line
    if (angles.hipDeviation !== undefined && angles.hipDeviation < -0.1) {
      risks.push({
        id: 'hip_pike',
        label: 'Hips Piking Up',
        injury: 'Poor Core Engagement',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }

    // Elbow flaring >75°
    if (angles.elbowFlare > 75) {
      risks.push({
        id: 'elbow_flare',
        label: 'Elbow Flaring',
        injury: 'Shoulder Impingement',
        severity: 'high',
        color: '#EF4444',
        bgColor: 'rgba(239,68,68,0.15)',
      })
    }
  }

  if (exercise === 'deadlift') {
    // Lumbar rounding (spine angle too high = rounding)
    if (angles.spineAngle > 60) {
      risks.push({
        id: 'lumbar_rounding',
        label: 'Lumbar Rounding',
        injury: 'Herniated Disc Risk',
        severity: 'high',
        color: '#EF4444',
        bgColor: 'rgba(239,68,68,0.15)',
      })
    }

    // Hyperextension at lockout
    if (angles.hyperextension) {
      risks.push({
        id: 'hyperextension',
        label: 'Hyperextension at Lockout',
        injury: 'Lumbar Strain',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
  }

  if (exercise === 'lunge') {
    if (angles.kneeValgus && angles.kneeValgusAmount > 0.02) {
      risks.push({
        id: 'knee_valgus',
        label: 'Front Knee Valgus',
        injury: 'ACL Strain Risk',
        severity: 'high',
        color: '#EF4444',
        bgColor: 'rgba(239,68,68,0.15)',
      })
    }
    if (angles.spineAngle > 45) {
      risks.push({
        id: 'forward_lean',
        label: 'Excessive Forward Lean',
        injury: 'Lower Back Stress',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    return risks
  }

  if (exercise === 'plank') {
    if (angles.hipSagAmount > 0.12 && (angles.hipDeviation === undefined || angles.hipDeviation > 0)) {
      risks.push({
        id: 'hip_sag',
        label: 'Hip Sagging',
        injury: 'Lower Back Risk',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    if (angles.hipDeviation !== undefined && angles.hipDeviation < -0.1) {
      risks.push({
        id: 'hip_pike',
        label: 'Hips Piking Up',
        injury: 'Poor Core Engagement',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    return risks
  }

  if (exercise === 'jumpLanding') {
    if (angles.kneeAngle > 140) {
      risks.push({
        id: 'stiff_landing',
        label: 'Stiff-Leg Landing',
        injury: 'Joint Compression Risk',
        severity: 'high',
        color: '#EF4444',
        bgColor: 'rgba(239,68,68,0.15)',
      })
    }
    if (angles.kneeValgus && angles.kneeValgusAmount > 0.02) {
      risks.push({
        id: 'valgus_landing',
        label: 'Knee Valgus at Landing',
        injury: 'ACL Tear Risk',
        severity: 'high',
        color: '#EF4444',
        bgColor: 'rgba(239,68,68,0.15)',
      })
    }
    if (angles.kneeAsymmetry > 30) {
      risks.push({
        id: 'asymmetric_landing',
        label: 'Asymmetric Landing',
        injury: 'Compensation / Overuse Risk',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    return risks
  }

  if (exercise === 'highKnees') {
    if (angles.spineAngle > 30) {
      risks.push({
        id: 'forward_lean',
        label: 'Excessive Forward Lean',
        injury: 'Balance / Lower Back Stress',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    return risks
  }

  if (exercise === 'sumoSquat') {
    if (!angles.kneesTrackingOut) {
      risks.push({
        id: 'knee_cave_sumo',
        label: 'Knees Caving In',
        injury: 'Hip / Knee Stress',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    return risks
  }

  if (exercise === 'buttKicks') {
    if (angles.spineAngle > 35) {
      risks.push({
        id: 'forward_lean',
        label: 'Excessive Forward Lean',
        injury: 'Lower Back Stress',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    return risks
  }

  if (exercise === 'pogoJump') {
    if (angles.kneeAngle < 130) {
      risks.push({
        id: 'excess_knee_bend',
        label: 'Excessive Knee Bend',
        injury: 'Loses Pogo Mechanics',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    if (angles.kneeAsymmetry > 20) {
      risks.push({
        id: 'asymmetric_landing',
        label: 'Asymmetric Landing',
        injury: 'Compensation Risk',
        severity: 'medium',
        color: '#F59E0B',
        bgColor: 'rgba(245,158,11,0.15)',
      })
    }
    return risks
  }

  return risks
}

export function getJointColor(angle, idealMin, idealMax) {
  if (angle === null || angle === undefined) return '#6B7280'
  const slack = 15 // degrees of yellow zone
  if (angle >= idealMin && angle <= idealMax) return '#10B981' // green
  if (angle >= idealMin - slack && angle <= idealMax + slack) return '#F59E0B' // yellow
  return '#EF4444' // red
}
