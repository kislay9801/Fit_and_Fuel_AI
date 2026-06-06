import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { RepCounter } from './repCounting.js'

describe('RepCounter', () => {
  it('counts one squat rep only after a down-up cycle', () => {
    const counter = new RepCounter('squat')

    assert.equal(counter.update({ kneeAngle: 160 }), 0)
    assert.equal(counter.update({ kneeAngle: 100 }), 0)
    assert.equal(counter.getPhase(), 'down')
    assert.equal(counter.update({ kneeAngle: 155 }), 1)
    assert.equal(counter.getPhase(), 'up')
  })

  it('does not double count while staying below or above thresholds', () => {
    const counter = new RepCounter('pushup')

    counter.update({ elbowAngle: 80 })
    counter.update({ elbowAngle: 75 })
    assert.equal(counter.getCount(), 0)

    counter.update({ elbowAngle: 150 })
    counter.update({ elbowAngle: 155 })
    assert.equal(counter.getCount(), 1)
  })
})
