/**
 * Rep counting state machine.
 * Tracks angle threshold crossings in a down→up cycle.
 */

export class RepCounter {
  constructor(exercise) {
    this.exercise = exercise
    this.repCount = 0
    this.phase = 'up' // 'up' | 'down'
    this.angleBuffer = []
  }

  // Thresholds per exercise (using the primary tracking angle)
  getThresholds() {
    switch (this.exercise) {
      case 'squat':
        return { downThreshold: 110, upThreshold: 150 } // knee angle
      case 'lunge':
        return { downThreshold: 110, upThreshold: 150 } // front knee angle
      case 'pushup':
        return { downThreshold: 90, upThreshold: 140 } // elbow angle
      case 'deadlift':
        return { downThreshold: 130, upThreshold: 160 } // knee angle: ~130° at bottom of conventional lift, ~160° at lockout
      case 'plank':
        return { downThreshold: 0, upThreshold: 360 } // isometric — no reps
      case 'jumpLanding':
        return { downThreshold: 120, upThreshold: 155 } // bilateral knee avg
      case 'highKnees':
        return { downThreshold: 100, upThreshold: 150 } // hip-flexion angle of raised knee
      case 'sumoSquat':
        return { downThreshold: 100, upThreshold: 150 } // bilateral knee avg
      case 'buttKicks':
        return { downThreshold: 100, upThreshold: 140 } // most-flexed knee angle
      case 'pogoJump':
        return { downThreshold: 155, upThreshold: 168 } // brief knee bend on landing
      default:
        return { downThreshold: 100, upThreshold: 150 }
    }
  }

  // Extract the relevant angle for rep counting from angles object
  getTrackingAngle(angles) {
    if (!angles) return null
    switch (this.exercise) {
      case 'squat':
      case 'lunge':
      case 'sumoSquat':
      case 'jumpLanding':
      case 'pogoJump':
        return angles.kneeAngle
      case 'pushup':      return angles.elbowAngle
      case 'deadlift':    return angles.kneeAngle
      case 'plank':       return 180 // constant — reps stay 0
      case 'highKnees':   return angles.hipFlexionAngle ?? angles.kneeAngle
      case 'buttKicks':   return angles.bentKneeAngle ?? angles.kneeAngle
      default:            return null
    }
  }

  update(angles) {
    const angle = this.getTrackingAngle(angles)
    if (angle === null || angle === undefined) return this.repCount

    const { downThreshold, upThreshold } = this.getThresholds()

    // State machine: up → down → up = 1 rep
    if (this.phase === 'up' && angle < downThreshold) {
      this.phase = 'down'
    } else if (this.phase === 'down' && angle > upThreshold) {
      this.phase = 'up'
      this.repCount++
    }

    return this.repCount
  }

  reset() {
    this.repCount = 0
    this.phase = 'up'
    this.angleBuffer = []
  }

  getCount() {
    return this.repCount
  }

  getPhase() {
    return this.phase
  }
}
