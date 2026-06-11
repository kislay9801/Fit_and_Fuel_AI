import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { RepCounter } from './repCounting.js'

describe('RepCounter (adaptive)', () => {
  it('counts one squat rep after a dip-and-recover cycle', () => {
    const counter = new RepCounter('squat')
    assert.equal(counter.update({ kneeAngle: 170 }), 0) // standing
    assert.equal(counter.update({ kneeAngle: 90 }), 0)  // bottom
    assert.equal(counter.getPhase(), 'down')
    assert.equal(counter.update({ kneeAngle: 165 }), 1) // back up → 1 rep
    assert.equal(counter.getPhase(), 'up')
  })

  it('counts reps even when the camera reads a "straight" leg well below 180', () => {
    // Foreshortened view: extended knee only reads ~150°. Old fixed-threshold
    // logic (needs >158°) would count ZERO here; adaptive logic still works.
    const counter = new RepCounter('squat')
    counter.update({ kneeAngle: 150 })
    counter.update({ kneeAngle: 95 })
    counter.update({ kneeAngle: 148 })
    assert.equal(counter.getCount(), 1)
  })

  it('does not double count while holding the bottom or top', () => {
    const counter = new RepCounter('squat')
    counter.update({ kneeAngle: 170 })
    counter.update({ kneeAngle: 90 })
    counter.update({ kneeAngle: 90 })
    counter.update({ kneeAngle: 90 })
    assert.equal(counter.getCount(), 0)
    counter.update({ kneeAngle: 168 })
    counter.update({ kneeAngle: 168 })
    assert.equal(counter.getCount(), 1)
  })

  it('counts several consecutive reps', () => {
    const counter = new RepCounter('squat')
    const frames = [175, 92, 170, 95, 168, 90, 172] // 3 dips
    frames.forEach(kneeAngle => counter.update({ kneeAngle }))
    assert.equal(counter.getCount(), 3)
  })

  it('ignores small bobs below the minimum amplitude', () => {
    const counter = new RepCounter('squat')
    // only a ~15° wobble — less than the 28° minAmp — is not a rep
    ;[172, 160, 158, 165, 172].forEach(kneeAngle => counter.update({ kneeAngle }))
    assert.equal(counter.getCount(), 0)
  })

  it('captures the deepest frame of each rep as the peak', () => {
    const counter = new RepCounter('squat')
    counter.update({ kneeAngle: 170 })
    counter.update({ kneeAngle: 120, depth: 'a' })
    counter.update({ kneeAngle: 85, depth: 'b' })  // deepest
    counter.update({ kneeAngle: 110, depth: 'c' })
    counter.update({ kneeAngle: 165, depth: 'd' }) // completes rep
    const peak = counter.popCompletedRep()
    assert.ok(peak)
    assert.equal(peak.kneeAngle, 85)
    assert.equal(peak.depth, 'b')
    assert.equal(counter.popCompletedRep(), null) // consumed once
  })

  it('counts each leg independently for alternating exercises (butt kicks)', () => {
    const counter = new RepCounter('buttKicks')
    counter.update({ leftKneeAngle: 170, rightKneeAngle: 170 })
    counter.update({ leftKneeAngle: 45,  rightKneeAngle: 170 }) // left kick down
    counter.update({ leftKneeAngle: 165, rightKneeAngle: 170 }) // left recover → 1
    assert.equal(counter.getCount(), 1)
    counter.update({ leftKneeAngle: 170, rightKneeAngle: 45 })  // right kick down
    counter.update({ leftKneeAngle: 170, rightKneeAngle: 165 }) // right recover → 2
    assert.equal(counter.getCount(), 2)
  })

  it('counts pogo jumps from vertical bounce, not knee angle', () => {
    const counter = new RepCounter('pogoJump')
    const hop = [0.60, 0.55, 0.50, 0.55, 0.60] // knees stay ~straight throughout
    for (const hipY of hop) counter.update({ hipY, kneeAngle: 168 })
    assert.equal(counter.getCount(), 1)
    for (const hipY of hop) counter.update({ hipY, kneeAngle: 168 })
    assert.equal(counter.getCount(), 2)
  })

  it('ignores vertical jitter below the amplitude threshold', () => {
    const counter = new RepCounter('pogoJump')
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
