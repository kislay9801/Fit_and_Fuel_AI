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
    // Hip sagging >15% deviation (0.15 in normalized coords)
    if (angles.hipSagAmount > 0.15) {
      risks.push({
        id: 'hip_sag',
        label: 'Hip Sagging',
        injury: 'Lower Back Risk',
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

  return risks
}

export function getJointColor(angle, idealMin, idealMax) {
  if (angle === null || angle === undefined) return '#6B7280'
  const slack = 15 // degrees of yellow zone
  if (angle >= idealMin && angle <= idealMax) return '#10B981' // green
  if (angle >= idealMin - slack && angle <= idealMax + slack) return '#F59E0B' // yellow
  return '#EF4444' // red
}
