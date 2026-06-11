/**
 * Rep counting + per-rep peak capture.
 *
 * Detection modes:
 *  - 'angle'       : one down→up cycle of a single tracking joint angle
 *                    (squat, push-up, lunge, sumo squat, jump landing). The
 *                    "effort" is at the SMALLEST angle, so the deepest frame of
 *                    each rep is remembered and used for scoring.
 *  - 'alternating' : left/right limbs cycle independently (high knees, butt
 *                    kicks). Each limb runs its own down→up state machine and
 *                    every drive/kick counts. Using a single min()/max() signal
 *                    here fails, because one limb is always flexed so the shared
 *                    angle never returns to the "up" position.
 *  - 'vertical'    : each vertical bounce of the body (pogo jumps), where the
 *                    knee barely flexes and angle thresholds can't work.
 *  - 'none'        : isometric holds (plank) — no reps.
 *
 * Thresholds use hysteresis (separate down/up values) and are deliberately
 * loose, because 2D camera projection makes a "straight" joint read well below
 * 180° and a "bent" joint read above its true value.
 */

function getConfig(exercise) {
  switch (exercise) {
    case 'squat':       return { mode: 'angle', key: 'kneeAngle',  down: 140, up: 158 }
    case 'lunge':       return { mode: 'angle', key: 'kneeAngle',  down: 140, up: 158 }
    case 'sumoSquat':   return { mode: 'angle', key: 'kneeAngle',  down: 135, up: 158 }
    case 'pushup':      return { mode: 'angle', key: 'elbowAngle', down: 110, up: 150 }
    case 'deadlift':    return { mode: 'angle', key: 'kneeAngle',  down: 150, up: 166 }
    case 'jumpLanding': return { mode: 'angle', key: 'kneeAngle',  down: 150, up: 166 }
    case 'highKnees':   return { mode: 'alternating', leftKey: 'leftHipFlexion', rightKey: 'rightHipFlexion', down: 130, up: 155 }
    case 'buttKicks':   return { mode: 'alternating', leftKey: 'leftKneeAngle',  rightKey: 'rightKneeAngle',  down: 110, up: 150 }
    case 'pogoJump':    return { mode: 'vertical', key: 'hipY', minAmplitude: 0.008, peakKey: 'kneeAngle' }
    case 'plank':       return { mode: 'none' }
    default:            return { mode: 'angle', key: 'kneeAngle', down: 140, up: 158 }
  }
}

/** One down→up state machine that also remembers the deepest frame of the rep. */
class Limb {
  constructor(down, up) {
    this.down = down
    this.up = up
    this.phase = 'up'
    this.peakAngle = null
    this.peakSnapshot = null
  }

  /** Returns the peak-angles snapshot if a rep just completed, else null. */
  update(tracking, snapshot) {
    if (tracking === null || tracking === undefined) return null

    if (this.phase === 'up') {
      if (tracking < this.down) {
        this.phase = 'down'
        this.peakAngle = tracking
        this.peakSnapshot = snapshot
      }
      return null
    }

    // phase === 'down': track the deepest frame
    if (this.peakAngle === null || tracking < this.peakAngle) {
      this.peakAngle = tracking
      this.peakSnapshot = snapshot
    }
    if (tracking > this.up) {
      this.phase = 'up'
      const peak = this.peakSnapshot
      this.peakAngle = null
      this.peakSnapshot = null
      return peak // rep complete
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
    const { mode, down, up } = this.config
    if (mode === 'angle') {
      this._limb = new Limb(down, up)
    } else if (mode === 'alternating') {
      this._left = new Limb(down, up)
      this._right = new Limb(down, up)
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
    if (peak) {
      this.repCount += 1
      this._completedPeak = peak
    }
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
