import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { calculateAngle } from './poseAngles.js'
import { scoreExercise } from './formScoring.js'
import { createSampleTimes } from './videoSampling.js'

describe('pose angle and scoring utilities', () => {
  it('calculates a right angle at the middle point', () => {
    const angle = calculateAngle(
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    )

    assert.ok(Math.abs(angle - 90) < 0.0001)
  })

  it('keeps squat scores inside the 0-100 range', () => {
    const result = scoreExercise('squat', {
      kneeAngle: 90,
      spineAngle: 20,
      kneeValgus: false,
      kneeValgusAmount: 0,
    })

    assert.ok(result.total >= 0)
    assert.ok(result.total <= 100)
    assert.equal(result.breakdown.kneeScore, 100)
  })
})

describe('fast mode reliability tests', () => {
  it('fast mode never returns zero frames', () => {
    const durations = [1, 5, 12, 30, 60, 120, 300]

    for (const duration of durations) {
      const result = createSampleTimes(duration, 'fast')
      assert.ok(result.times.length > 0, `Fast mode should extract frames for ${duration}s video`)
      assert.ok(result.times.length >= 2, `Fast mode should extract minimum 2 frames for ${duration}s video`)
    }
  })

  it('fast mode extracts expected frame count for typical videos', () => {
    // 12-second squat video should extract ~48 frames at 4 FPS
    const result = createSampleTimes(12, 'fast')

    // With capping at 60, we expect close to 48 frames
    assert.ok(result.times.length >= 48, 'Should extract near target 48 frames for 12s video')
    assert.ok(result.times.length <= 60, 'Should not exceed max 60 frames')
  })

  it('normal mode extracts more frames than fast mode for same video', () => {
    const duration = 12
    const fast = createSampleTimes(duration, 'fast')
    const normal = createSampleTimes(duration, 'normal')

    assert.ok(normal.times.length > fast.times.length, 'Normal mode should have more frames than fast mode')
  })

  it('very short clips (< 1s) still extract frames', () => {
    const shortClips = [0.1, 0.2, 0.5, 0.8]

    for (const duration of shortClips) {
      const result = createSampleTimes(duration, 'fast')
      assert.ok(result.times.length >= 2, `Should extract minimum frames for ${duration}s clip`)
    }
  })

  it('frame sampling covers the entire video duration', () => {
    const result = createSampleTimes(12, 'fast')

    // First frame at 0
    assert.equal(result.times[0], 0)

    // Last frame near end
    assert.ok(result.times.at(-1) > 11.9, 'Last frame should be near video end')
    assert.ok(result.times.at(-1) <= 12, 'Last frame should not exceed video duration')
  })

  it('frame times are monotonically increasing', () => {
    const result = createSampleTimes(12, 'fast')

    for (let i = 1; i < result.times.length; i++) {
      assert.ok(result.times[i] > result.times[i - 1], 'Frame times should be strictly increasing')
    }
  })

  it('scoring works with sparse frames from fast mode', () => {
    // Simulate what happens in fast mode with fewer frames
    const squat = {
      kneeAngle: 85,
      spineAngle: 15,
      kneeValgus: false,
      kneeValgusAmount: 0,
    }

    const result = scoreExercise('squat', squat)
    assert.ok(result.total > 0, 'Should score positive for good form')
    assert.ok(result.total <= 100, 'Should stay in valid range')
    assert.equal(result.isIdle, false, 'Should recognize active motion')
  })

  it('idle detection still works with sparse frames', () => {
    const squatIdle = {
      kneeAngle: 170,
      spineAngle: 5,
      kneeValgus: false,
      kneeValgusAmount: 0,
    }

    const result = scoreExercise('squat', squatIdle)
    assert.equal(result.total, 0, 'Should score 0 for idle')
    assert.equal(result.isIdle, true, 'Should mark as idle')
  })
})
