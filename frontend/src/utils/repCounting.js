/**
 * Rep counting + per-rep peak capture — adaptive (range-of-motion relative).
 *
 * Why adaptive instead of fixed thresholds:
 *   A fixed rule like "knee must exceed 158° to finish a rep" fails badly with
 *   a 2D camera — depending on distance and angle, a fully straight leg can read
 *   anywhere from ~150° to ~178°. If the camera reads a straight leg at 152°, a
 *   158° threshold is never crossed and the rep counter stays at zero even after
 *   many real reps.
 *
 *   Instead we detect a rep whenever the tracked joint angle DIPS and then
 *   RECOVERS by at least `minAmp` degrees, measured relative to the local
 *   extremes the person actually hits. This self-calibrates to any camera angle,
 *   body, and depth, and the deepest frame of each dip is captured for scoring.
 *
 * Modes:
 *   'angle'       – one joint signal (squat, push-up, lunge, sumo, deadlift,
 *                   jump landing). Effort = smallest angle.
 *   'alternating' – left/right limbs cycle independently (high knees, butt
 *                   kicks); each limb is its own detector and both legs count.
 *   'vertical'    – body bounce for pogo jumps (knees barely bend).
 *   'none'        – isometric hold (plank), no reps.
 */

function getConfig(exercise) {
  switch (exercise) {
    case 'squat':       return { mode: 'angle', key: 'kneeAngle',  minAmp: 28 }
    case 'lunge':       return { mode: 'angle', key: 'kneeAngle',  minAmp: 26 }
    case 'sumoSquat':   return { mode: 'angle', key: 'kneeAngle',  minAmp: 26 }
    case 'pushup':      return { mode: 'angle', key: 'elbowAngle', minAmp: 26 }
    case 'deadlift':    return { mode: 'angle', key: 'kneeAngle',  minAmp: 20 }
    case 'jumpLanding': return { mode: 'angle', key: 'kneeAngle',  minAmp: 22 }
    case 'highKnees':   return { mode: 'alternating', leftKey: 'leftHipFlexion', rightKey: 'rightHipFlexion', minAmp: 28 }
    case 'buttKicks':   return { mode: 'alternating', leftKey: 'leftKneeAngle',  rightKey: 'rightKneeAngle',  minAmp: 34 }
    case 'pogoJump':    return { mode: 'vertical', key: 'hipY', minAmplitude: 0.008, peakKey: 'kneeAngle' }
    case 'plank':       return { mode: 'none' }
    default:            return { mode: 'angle', key: 'kneeAngle', minAmp: 28 }
  }
}

/**
 * Adaptive valley detector for a single limb/joint.
 * Tracking value convention: SMALLER = more effort (deeper). Counts a rep when
 * the value dips `minAmp` below a local high and then recovers `minAmp` above
 * the dip's lowest point. The lowest frame's snapshot is returned for scoring.
 */
class Limb {
  constructor(minAmp) {
    this.minAmp = minAmp
    this.reset()
  }

  reset() {
    this.phase = 'up'      // 'up' = extended / between reps, 'down' = inside a dip
    this.refHigh = null    // highest (most extended) value seen since last rep
    this.valley = null     // lowest value within the current dip
    this.valleySnap = null // full angles snapshot at the valley
  }

  /** Returns the valley snapshot when a rep completes, else null. */
  update(x, snapshot) {
    if (x === null || x === undefined || Number.isNaN(x)) return null
    if (this.refHigh === null) { this.refHigh = x; return null }

    if (this.phase === 'up') {
      if (x > this.refHigh) this.refHigh = x        // track the local high
      if (x < this.refHigh - this.minAmp) {          // dipped enough → entering a rep
        this.phase = 'down'
        this.valley = x
        this.valleySnap = snapshot
      }
      return null
    }

    // phase === 'down': remember the deepest point, watch for recovery
    if (x < this.valley) { this.valley = x; this.valleySnap = snapshot }
    if (x > this.valley + this.minAmp) {             // recovered enough → rep complete
      const snap = this.valleySnap
      this.phase = 'up'
      this.refHigh = x                               // reset local high for next rep
      this.valley = null
      this.valleySnap = null
      return snap
    }
    return null
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
    this._completedPeak = null
    const { mode, minAmp } = this.config
    if (mode === 'angle') {
      this._limb = new Limb(minAmp)
    } else if (mode === 'alternating') {
      this._left = new Limb(minAmp)
      this._right = new Limb(minAmp)
    } else if (mode === 'vertical') {
      this._prevY = null
      this._prevVel = 0
      this._minY = Infinity
      this._maxY = -Infinity
      this._peakAngle = null
      this._peakSnapshot = null
    }
  }

  update(angles) {
    if (!angles) return this.repCount
    switch (this.config.mode) {
      case 'angle':       return this._updateAngle(angles)
      case 'alternating': return this._updateAlternating(angles)
      case 'vertical':    return this._updateVertical(angles)
      default:            return this.repCount // 'none'
    }
  }

  _updateAngle(angles) {
    const peak = this._limb.update(angles[this.config.key], angles)
    if (peak) { this.repCount += 1; this._completedPeak = peak }
    return this.repCount
  }

  _updateAlternating(angles) {
    const lPeak = this._left.update(angles[this.config.leftKey], angles)
    if (lPeak) { this.repCount += 1; this._completedPeak = lPeak }
    const rPeak = this._right.update(angles[this.config.rightKey], angles)
    if (rPeak) { this.repCount += 1; this._completedPeak = rPeak }
    return this.repCount
  }

  _updateVertical(angles) {
    const y = angles[this.config.key]
    const peakVal = angles[this.config.peakKey]

    // remember the deepest knee bend within the current hop (for scoring)
    if (peakVal !== undefined && (this._peakAngle === null || peakVal < this._peakAngle)) {
      this._peakAngle = peakVal
      this._peakSnapshot = angles
    }

    if (y === null || y === undefined) return this.repCount
    if (this._prevY === null) { this._prevY = y; return this.repCount }

    const vel = y - this._prevY // >0 falling, <0 rising
    this._minY = Math.min(this._minY, y)
    this._maxY = Math.max(this._maxY, y)

    // apex of a hop = vertical velocity flips from rising to falling
    if (this._prevVel < 0 && vel >= 0) {
      if (this._maxY - this._minY > this.config.minAmplitude) {
        this.repCount += 1
        this._completedPeak = this._peakSnapshot || angles
        this._peakAngle = null
        this._peakSnapshot = null
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
    const { mode } = this.config
    if (mode === 'angle') return this._limb.phase
    if (mode === 'alternating') {
      return (this._left.phase === 'down' || this._right.phase === 'down') ? 'down' : 'up'
    }
    return 'up'
  }
}
