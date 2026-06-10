/**
 * Rep counting + per-rep peak capture.
 *
 * Two detection modes:
 *  - 'angle'    : counts a rep on a down→up cycle of a tracking joint angle
 *                 (squat, push-up, lunge, high knees, etc.). The "effort" of
 *                 every supported exercise happens at the SMALLEST joint angle,
 *                 so we also remember the angles snapshot at the deepest point
 *                 of each rep — that peak frame is what gets scored.
 *  - 'vertical' : counts a rep on each vertical bounce of the body (pogo jumps),
 *                 where the knee barely flexes and angle thresholds can't work.
 *                 Detects the apex of each hop from the hip's vertical motion.
 *  - 'none'     : isometric holds (plank) — no reps.
 *
 * The state machine uses hysteresis (separate down/up thresholds) so a single
 * noisy frame near a threshold can't double-count.
 */

function getConfig(exercise) {
  switch (exercise) {
    // angle key + hysteresis thresholds (degrees). down = enter bottom, up = rep complete
    case 'squat':       return { mode: 'angle', key: 'kneeAngle',       down: 130, up: 150 }
    case 'lunge':       return { mode: 'angle', key: 'kneeAngle',       down: 130, up: 150 }
    case 'pushup':      return { mode: 'angle', key: 'elbowAngle',      down: 110, up: 150 }
    case 'deadlift':    return { mode: 'angle', key: 'kneeAngle',       down: 150, up: 168 }
    case 'jumpLanding': return { mode: 'angle', key: 'kneeAngle',       down: 140, up: 160 }
    case 'highKnees':   return { mode: 'angle', key: 'hipFlexionAngle', down: 120, up: 150 }
    case 'sumoSquat':   return { mode: 'angle', key: 'kneeAngle',       down: 120, up: 150 }
    case 'buttKicks':   return { mode: 'angle', key: 'bentKneeAngle',   down: 110, up: 145 }
    case 'pogoJump':    return { mode: 'vertical', key: 'hipY', minAmplitude: 0.012, peakKey: 'kneeAngle' }
    case 'plank':       return { mode: 'none' }
    default:            return { mode: 'angle', key: 'kneeAngle', down: 120, up: 150 }
  }
}

export class RepCounter {
  constructor(exercise) {
    this.exercise = exercise
    this.config = getConfig(exercise)
    this.reset()
  }

  reset() {
    this.repCount = 0
    this.phase = 'up' // 'up' (extended/standing) | 'down' (bottom/effort)
    // peak capture for the rep currently in progress
    this._peakTracking = null   // most-extreme (smallest) tracking angle seen this rep
    this._peakAngles = null     // full angles snapshot at that peak
    this._completedPeak = null  // peak angles of the rep that JUST completed (consumed once)
    // vertical-mode state
    this._prevY = null
    this._prevVel = 0
    this._minY = Infinity
    this._maxY = -Infinity
  }

  update(angles) {
    if (!angles) return this.repCount
    if (this.config.mode === 'none') return this.repCount
    if (this.config.mode === 'vertical') return this._updateVertical(angles)
    return this._updateAngle(angles)
  }

  _updateAngle(angles) {
    const { key, down, up } = this.config
    const tracking = angles[key]
    if (tracking === null || tracking === undefined) return this.repCount

    if (this.phase === 'up') {
      if (tracking < down) {
        // entered the bottom of a rep — start tracking the peak
        this.phase = 'down'
        this._peakTracking = tracking
        this._peakAngles = angles
      }
    } else {
      // in the bottom — remember the deepest (smallest-angle) frame
      if (this._peakTracking === null || tracking < this._peakTracking) {
        this._peakTracking = tracking
        this._peakAngles = angles
      }
      if (tracking > up) {
        // came back up — rep complete
        this.phase = 'up'
        this.repCount += 1
        this._completedPeak = this._peakAngles
        this._peakTracking = null
        this._peakAngles = null
      }
    }
    return this.repCount
  }

  _updateVertical(angles) {
    const y = angles[this.config.key]            // hip vertical position (lower y = higher in the air)
    const peakKey = this.config.peakKey
    const peakVal = angles[peakKey]

    // continuously remember the deepest knee bend (smallest angle) within this hop
    if (peakVal !== undefined && (this._peakTracking === null || peakVal < this._peakTracking)) {
      this._peakTracking = peakVal
      this._peakAngles = angles
    }

    if (y === null || y === undefined) return this.repCount
    if (this._prevY === null) { this._prevY = y; return this.repCount }

    const vel = y - this._prevY                  // >0 falling, <0 rising
    this._minY = Math.min(this._minY, y)
    this._maxY = Math.max(this._maxY, y)

    // apex of a hop = vertical velocity flips from rising to falling
    if (this._prevVel < 0 && vel >= 0) {
      const amplitude = this._maxY - this._minY
      if (amplitude > this.config.minAmplitude) {
        this.repCount += 1
        this._completedPeak = this._peakAngles || angles
        this._peakTracking = null
        this._peakAngles = null
        this._minY = Infinity
        this._maxY = -Infinity
      }
    }

    this._prevY = y
    this._prevVel = vel
    return this.repCount
  }

  /** Returns the peak-angles snapshot of the rep that just completed (once), else null. */
  popCompletedRep() {
    const peak = this._completedPeak
    this._completedPeak = null
    return peak
  }

  getCount() {
    return this.repCount
  }

  getPhase() {
    return this.phase
  }
}
