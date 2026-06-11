import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { RepCounter } from './repCounting.js'

describe('RepCounter', () => {
  it('counts one squat rep only after a down-up cycle', () => {
    const counter = new RepCounter('squat')

    assert.equal(counter.update({ kneeAngle: 170 }), 0)
    assert.equal(counter.update({ kneeAngle: 100 }), 0)
    assert.equal(counter.getPhase(), 'down')
    assert.equal(counter.update({ kneeAngle: 165 }), 1)
    assert.equal(counter.getPhase(), 'up')
  })

  it('does not double count while staying below or above thresholds', () => {
    const counter = new RepCounter('pushup')

    counter.update({ elbowAngle: 80 })
    counter.update({ elbowAngle: 75 })
    assert.equal(counter.getCount(), 0)

    counter.update({ elbowAngle: 150 })
    counter.update({ elbowAngle: 160 })
    assert.equal(counter.getCount(), 1)
  })

  it('captures the deepest frame of each rep as the peak', () => {
    const counter = new RepCounter('squat')

    counter.update({ kneeAngle: 170 })           // standing
    counter.update({ kneeAngle: 120, depth: 'a' }) // descending
    counter.update({ kneeAngle: 85, depth: 'b' })  // deepest
    counter.update({ kneeAngle: 110, depth: 'c' }) // ascending
    counter.update({ kneeAngle: 165, depth: 'd' }) // completes rep

    const peak = counter.popCompletedRep()
    assert.ok(peak, 'a completed rep peak should be available')
    assert.equal(peak.kneeAngle, 85)             // the deepest frame
    assert.equal(peak.depth, 'b')
    // peak is consumed once
    assert.equal(counter.popCompletedRep(), null)
  })

  it('counts each leg independently for alternating exercises (butt kicks)', () => {
    const counter = new RepCounter('buttKicks')

    // Left kicks up and down (right stays straight) -> 1 rep
    counter.update({ leftKneeAngle: 170, rightKneeAngle: 170 })
    counter.update({ leftKneeAngle: 50,  rightKneeAngle: 170 })
    counter.update({ leftKneeAngle: 165, rightKneeAngle: 170 })
    assert.equal(counter.getCount(), 1)

    // Now right kicks up and down -> 2 reps total
    counter.update({ leftKneeAngle: 170, rightKneeAngle: 50 })
    counter.update({ leftKneeAngle: 170, rightKneeAngle: 165 })
    assert.equal(counter.getCount(), 2)
  })

  it('counts pogo jumps from vertical bounce, not knee angle', () => {
    const counter = new RepCounter('pogoJump')
    // Knee stays nearly straight throughout (pogo) — only hipY oscillates.
    // One full hop: ground (high y) -> apex (low y) -> ground (high y).
    const hop = [0.60, 0.55, 0.50, 0.55, 0.60]
    for (const hipY of hop) counter.update({ hipY, kneeAngle: 168 })
    assert.equal(counter.getCount(), 1)

    for (const hipY of hop) counter.update({ hipY, kneeAngle: 168 })
    assert.equal(counter.getCount(), 2)
  })

  it('ignores vertical jitter below the amplitude threshold', () => {
    const counter = new RepCounter('pogoJump')
    // Tiny noise (< minAmplitude 0.008) should not count as a hop
    const jitter = [0.600, 0.598, 0.600, 0.598, 0.600]
    for (const hipY of jitter) counter.update({ hipY, kneeAngle: 170 })
    assert.equal(counter.getCount(), 0)
  })

  it('reports no reps for an isometric plank', () => {
    const counter = new RepCounter('plank')
    counter.update({ hipSagAmount: 0.02 })
    counter.update({ hipSagAmount: 0.03 })
    assert.equal(counter.getCount(), 0)
  })
})
