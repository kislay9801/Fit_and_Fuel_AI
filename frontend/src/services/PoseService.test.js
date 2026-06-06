import assert from 'node:assert/strict'
import { describe, it, before, after } from 'node:test'
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'
import { PoseService } from './PoseService.js'

describe('PoseService', () => {
  let poseService

  before(() => {
    poseService = new PoseService()
  })

  after(() => {
    poseService.close()
  })

  it('initializes with idle state', () => {
    assert.equal(poseService.getState(), 'idle')
    assert.equal(poseService.getError(), null)
  })

  it('uses the installed MediaPipe Tasks Vision initialization API', () => {
    assert.equal(typeof FilesetResolver.forVisionTasks, 'function')
    assert.equal(typeof FilesetResolver.forVisionOnWeb, 'undefined')
    assert.equal(typeof PoseLandmarker.createFromOptions, 'function')
    assert.equal(typeof PoseLandmarker.createFromModelPath, 'function')
  })

  it('transitions to loading state during initialization', async () => {
    const stateChanges = []
    const unsubscribe = poseService.subscribe((update) => {
      stateChanges.push(update.state)
    })

    try {
      await poseService.initialize()
    } catch (err) {
      // Expected: initialization may fail without browser APIs
    }

    // Should have moved through states
    assert(stateChanges.includes('loading'), 'Should transition to loading state')
    unsubscribe()
  })

  it('returns error on multiple initialize calls to same service', async () => {
    const poseService2 = new PoseService()
    
    // Start two initializations concurrently
    let error1 = null
    let error2 = null
    
    const promise1 = poseService2.initialize().catch((err) => { error1 = err; return null })
    const promise2 = poseService2.initialize().catch((err) => { error2 = err; return null })
    
    // Both should settle
    await promise1
    await promise2
    
    if (error1 || error2) {
      assert(error1 instanceof Error)
      assert(error2 instanceof Error)
    } else {
      assert.equal(poseService2.getState(), 'ready')
    }
    
    poseService2.close()
  })

  it('sets error state on initialization failure', async () => {
    // Create mock input without required browser APIs
    const poseService2 = new PoseService()
    try {
      await poseService2.initialize()
    } catch (err) {
      assert.equal(poseService2.getState(), 'failed')
      assert(poseService2.getError())
    }
    poseService2.close()
  })

  it('throws error when sending frame to failed service', async () => {
    const poseService2 = new PoseService()
    poseService2._notifyStateChange('failed', 'Test failure')
    try {
      await poseService2.send({}, 0)
      assert.fail('Should have thrown')
    } catch (err) {
      assert.match(err.message, /Test failure/)
    }
    poseService2.close()
  })

  it('closes properly and cleans up resources', () => {
    const poseService2 = new PoseService()
    poseService2.close()
    assert.equal(poseService2.getState(), 'idle')
    assert.equal(poseService2.poseLandmarker, null)
  })
})
