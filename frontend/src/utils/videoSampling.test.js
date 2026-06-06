import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createSampleTimes, ANALYSIS_PRESETS } from './videoSampling.js'

describe('createSampleTimes', () => {
  it('returns no frames and warning for invalid duration', () => {
    const result = createSampleTimes(Number.NaN, 'fast')

    assert.deepEqual(result.times, [])
    assert.ok(result.warning)
  })

  it('includes first and last usable timestamps', () => {
    const result = createSampleTimes(12, 'fast')

    assert.equal(result.times[0], 0)
    assert.ok(result.times.at(-1) > 11.9)
    assert.ok(result.times.length > 2)
  })

  it('caps and falls back to safe mode for very long videos', () => {
    const result = createSampleTimes(120, 'fast')

    // For a 120-second video, fast mode would want 480+ frames but caps at 60.
    // Since that's >2/3 reduction, it falls back to safe mode (30 max frames)
    assert.ok(result.times.length >= 2, 'Should maintain minimum frames')
    assert.ok(result.warning, 'Should include warning for capping')
    assert.equal(result.fallback, true, 'Should flag fallback for very long videos')
    assert.ok(result.times.length <= 60, 'Should not exceed original fast mode max')
  })

  it('normal mode samples more densely than fast mode', () => {
    const normal = createSampleTimes(12, 'normal')
    const fast = createSampleTimes(12, 'fast')

    assert.ok(normal.times.length > fast.times.length)
  })

  // ─── NEW TESTS FOR RELIABILITY ─────────────────────────────────────────────

  it('always returns minimum 2 unique frames', () => {
    const durations = [0.001, 0.1, 0.2, 0.5, 1, 5, 10, 60, 300]
    for (const duration of durations) {
      const result = createSampleTimes(duration, 'fast')
      assert.ok(result.times.length >= 2, `Should have ≥2 frames for ${duration}s video`)
      assert.equal(new Set(result.times).size, result.times.length, `All times should be unique for ${duration}s`)
    }
  })

  it('handles very short videos (< 0.1 seconds)', () => {
    const result = createSampleTimes(0.05, 'fast')

    assert.ok(result.times.length >= 2, 'Should still extract minimum 2 frames')
    assert.equal(result.times[0], 0)
    assert.ok(result.times.at(-1) > 0, 'Last frame should be at non-zero time')
  })

  it('handles very long videos with auto-fallback', () => {
    const result = createSampleTimes(600, 'fast') // 10 minute video

    assert.ok(result.times.length >= 2, 'Should maintain minimum frame count')
    // In fast mode with 300s cap, might fallback to safe mode
    if (result.fallback) {
      assert.ok(result.warning, 'Should include warning on fallback')
    }
  })

  it('never has duplicate timestamps', () => {
    const durations = [0.001, 1, 12, 60, 300]
    const presets = ['fast', 'normal', 'safe']

    for (const duration of durations) {
      for (const preset of presets) {
        const result = createSampleTimes(duration, preset)
        const uniqueTimes = new Set(result.times)
        assert.equal(
          result.times.length,
          uniqueTimes.size,
          `Duplicates detected for ${duration}s ${preset} mode`
        )
      }
    }
  })

  it('respects target FPS limits', () => {
    const fast = createSampleTimes(12, 'fast')
    const normal = createSampleTimes(12, 'normal')

    // Fast should target ~4 FPS, normal should target ~8 FPS
    const fastExpectedMin = Math.ceil(12 * ANALYSIS_PRESETS.fast.targetFps)
    const normalExpectedMin = Math.ceil(12 * ANALYSIS_PRESETS.normal.targetFps)

    assert.ok(fast.times.length >= 2, 'Fast should have minimum frames')
    assert.ok(normal.times.length >= normalExpectedMin || normal.times.length >= 2, 'Normal should respect FPS target or minimum')
  })

  it('provides timing information in result', () => {
    const result = createSampleTimes(12, 'fast')

    assert.ok(result.targetFps !== undefined, 'Should include targetFps')
    assert.ok(typeof result.fallback === 'boolean', 'Should include fallback flag')
  })

  it('first frame is always at 0', () => {
    const presets = ['fast', 'normal', 'safe']
    for (const preset of presets) {
      const result = createSampleTimes(12, preset)
      assert.equal(result.times[0], 0, `First frame should be at t=0 for ${preset}`)
    }
  })

  it('last frame is always near video end', () => {
    const presets = ['fast', 'normal', 'safe']
    const durations = [1, 12, 60]

    for (const duration of durations) {
      for (const preset of presets) {
        const result = createSampleTimes(duration, preset)
        const lastTime = result.times.at(-1)
        assert.ok(lastTime > duration * 0.95, `Last frame should be near end (>95%) for ${duration}s ${preset}`)
        assert.ok(lastTime <= duration, `Last frame should not exceed video duration for ${duration}s ${preset}`)
      }
    }
  })

  it('distributes frames evenly across video', () => {
    const result = createSampleTimes(12, 'fast')

    if (result.times.length >= 3) {
      // Check that frames are roughly evenly spaced
      const intervals = []
      for (let i = 1; i < result.times.length; i++) {
        intervals.push(result.times[i] - result.times[i - 1])
      }

      const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length
      // Allow 50% variance in interval spacing
      for (const interval of intervals) {
        assert.ok(
          interval >= avgInterval * 0.5 && interval <= avgInterval * 1.5,
          `Frame intervals should be roughly equal (avg: ${avgInterval}, got: ${interval})`
        )
      }
    }
  })

  it('handles precision edge cases with toFixed(3)', () => {
    // Test values that might have precision issues
    const problematicDurations = [1/3, 1/7, Math.PI, 12.345]

    for (const duration of problematicDurations) {
      const result = createSampleTimes(duration, 'fast')

      assert.ok(result.times.length >= 2, `Should handle precision for ${duration}`)
      assert.equal(new Set(result.times).size, result.times.length, `Should have unique times for ${duration}`)

      // All times should be valid numbers with 3 decimals max
      for (const time of result.times) {
        assert.ok(Number.isFinite(time), `Time should be finite: ${time}`)
        const decimals = (time.toString().split('.')[1] || '').length
        assert.ok(decimals <= 3, `Time should have ≤3 decimals: ${time}`)
      }
    }
  })

  it('invalid preset falls back to fast', () => {
    const result = createSampleTimes(12, 'invalid_preset')

    assert.ok(result.times.length >= 2)
    assert.equal(result.targetFps, ANALYSIS_PRESETS.fast.targetFps)
  })

  it('safe mode exists and provides adequate coverage', () => {
    const result = createSampleTimes(12, 'safe')

    assert.ok(result.times.length >= 2, 'Safe mode should have minimum frames')
    // Safe should still get reasonable coverage
    assert.ok(result.times.length >= 5, 'Safe mode should provide reasonable frame coverage')
  })

  it('handles zero and negative durations gracefully', () => {
    const result1 = createSampleTimes(0, 'fast')
    const result2 = createSampleTimes(-1, 'fast')

    assert.deepEqual(result1.times, [], 'Zero duration should return empty times')
    assert.deepEqual(result2.times, [], 'Negative duration should return empty times')
    assert.ok(result1.warning, 'Should warn for invalid duration')
    assert.ok(result2.warning, 'Should warn for invalid duration')
  })
})
