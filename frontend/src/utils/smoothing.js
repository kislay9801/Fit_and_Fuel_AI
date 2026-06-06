/**
 * Rolling average smoothing for joint angles.
 * Prevents jitter from per-frame MediaPipe noise.
 */

export class RollingAverage {
  constructor(windowSize = 5) {
    this.windowSize = windowSize
    this.buffer = []
  }

  push(value) {
    this.buffer.push(value)
    if (this.buffer.length > this.windowSize) {
      this.buffer.shift()
    }
    return this.average()
  }

  average() {
    if (this.buffer.length === 0) return 0
    return this.buffer.reduce((a, b) => a + b, 0) / this.buffer.length
  }

  reset() {
    this.buffer = []
  }
}

/**
 * Smooth an entire angles object using multiple RollingAverage instances.
 */
export class AnglesSmoother {
  constructor(windowSize = 5) {
    this.windowSize = windowSize
    this.smoothers = {}
  }

  smooth(angles) {
    if (!angles) return null
    const smoothed = {}

    for (const [key, value] of Object.entries(angles)) {
      if (typeof value === 'number') {
        if (!this.smoothers[key]) {
          this.smoothers[key] = new RollingAverage(this.windowSize)
        }
        smoothed[key] = this.smoothers[key].push(value)
      } else {
        smoothed[key] = value
      }
    }

    return smoothed
  }

  reset() {
    this.smoothers = {}
  }
}
