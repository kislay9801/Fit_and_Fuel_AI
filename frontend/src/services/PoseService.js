/**
 * PoseService - Manages MediaPipe Pose initialization and inference with explicit state tracking.
 * 
 * States:
 *   - idle: Not initialized
 *   - loading: Initializing pose detector and loading assets
 *   - ready: Pose detector ready for inference
 *   - failed: Initialization failed with error
 */

import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

export const TASKS_VISION_VERSION = '0.10.35'
export const MEDIAPIPE_POSE_VERSION = 'not installed'
export const VISION_WASM_BASE_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`
export const POSE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task'

export class PoseService {
  constructor() {
    this.state = 'idle'
    this.poseLandmarker = null
    this.errorMessage = null
    this.initPromise = null
    this.lastResults = null
    this.callbacks = new Set()
  }

  /**
   * Get current initialization state
   */
  getState() {
    return this.state
  }

  /**
   * Get error message if state is 'failed'
   */
  getError() {
    return this.errorMessage
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback) {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  /**
   * Notify all subscribers of state change
   */
  _notifyStateChange(newState, error = null) {
    this.state = newState
    this.errorMessage = error
    this.callbacks.forEach(cb => {
      try {
        cb({ state: newState, error })
      } catch (err) {
        console.error('PoseService callback error:', err)
      }
    })
  }

  /**
   * Initialize pose detector with @mediapipe/tasks-vision.
   */
  async initialize() {
    // Return existing promise if already initializing or initialized
    if (this.initPromise) return this.initPromise
    if (this.state === 'ready') return Promise.resolve()
    if (this.state === 'failed') return Promise.reject(new Error(this.errorMessage))

    this._notifyStateChange('loading')

    this.initPromise = (async () => {
      try {
        const startTime = performance.now()

        // Verify FilesetResolver is available
        if (!FilesetResolver) {
          throw new Error('FilesetResolver not available from @mediapipe/tasks-vision')
        }

        console.info(`[PoseService] MediaPipe package version: @mediapipe/pose ${MEDIAPIPE_POSE_VERSION}`)
        console.info(`[PoseService] Tasks Vision version: ${TASKS_VISION_VERSION}`)
        console.info('[PoseService] Detector initialization started')

        if (typeof FilesetResolver.forVisionTasks !== 'function') {
          throw new Error('FilesetResolver.forVisionTasks is not available from @mediapipe/tasks-vision')
        }

        // @mediapipe/tasks-vision 0.10.x exposes forVisionTasks(), not forVisionOnWeb().
        const vision = await FilesetResolver.forVisionTasks(VISION_WASM_BASE_PATH)
        console.debug('[PoseService] Vision filesets loaded successfully')

        // Create pose landmarker instance
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: POSE_MODEL_URL,
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })

        const loadTime = Math.round(performance.now() - startTime)
        console.info(`[PoseService] Detector initialization succeeded (${loadTime}ms)`)

        this._notifyStateChange('ready')
        return this.poseLandmarker
      } catch (err) {
        const errorMsg = `Failed to initialize pose detector: ${err.message}`
        console.error('[PoseService] Detector initialization failed', err)
        console.error(`[PoseService] ${errorMsg}`)
        this._notifyStateChange('failed', errorMsg)
        throw err
      }
    })()

    return this.initPromise
  }

  /**
   * Send a frame to the pose detector for inference
   * Returns true on success, false if pose detector not ready
   * 
   * @param {HTMLVideoElement | HTMLImageElement | HTMLCanvasElement} input
   * @param {number} timestamp - Frame timestamp in milliseconds
   * @throws {Error} If pose detector initialization failed or inference fails
   */
  async send(input, timestamp = 0) {
    // Ensure pose detector is initialized
    if (this.state !== 'ready') {
      if (this.state === 'idle' || this.state === 'loading') {
        await this.initialize()
      } else if (this.state === 'failed') {
        throw new Error(`Cannot send frame: ${this.errorMessage}`)
      }
    }

    if (!this.poseLandmarker) {
      throw new Error('Pose landmarker not available')
    }

    // Validate input
    if (!input) {
      throw new Error('Invalid input: input is null or undefined')
    }

    // Get frame dimensions from input
    const width = input.width || input.videoWidth || 0
    const height = input.height || input.videoHeight || 0

    if (width <= 0 || height <= 0) {
      throw new Error(`Invalid frame dimensions: ${width}x${height}`)
    }

    if (input.readyState !== undefined && input.readyState < 2) {
      throw new Error(`Input not ready: readyState=${input.readyState}`)
    }

    const startTime = performance.now()
    console.debug(`[PoseService] Sending frame ${width}x${height} at timestamp ${timestamp}ms`)

    try {
      const results = await this.poseLandmarker.detectForVideo(input, timestamp)
      const inferenceMs = Math.round(performance.now() - startTime)

      this.lastResults = {
        ...results,
        inferenceMs,
      }

      const landmarkCount = results.landmarks?.[0]?.length ?? 0
      console.debug(`[PoseService] Inference successful (${inferenceMs}ms, ${landmarkCount} landmarks detected)`)

      return results
    } catch (err) {
      const inferenceMs = Math.round(performance.now() - startTime)
      const errorMsg = `Pose inference failed after ${inferenceMs}ms: ${err.message}`
      console.error(`[PoseService] ${errorMsg}`, err)
      throw new Error(errorMsg)
    }
  }

  /**
   * Get last inference results
   */
  getLastResults() {
    return this.lastResults
  }

  /**
   * Close and cleanup resources
   */
  close() {
    if (this.poseLandmarker) {
      try {
        this.poseLandmarker.close?.()
      } catch (err) {
        console.error('[PoseService] Error closing pose landmarker:', err)
      }
      this.poseLandmarker = null
    }
    this.state = 'idle'
    this.lastResults = null
    this.initPromise = null
  }
}

// Create singleton instance
let poseServiceInstance = null

export function getPoseService() {
  if (!poseServiceInstance) {
    poseServiceInstance = new PoseService()
  }
  return poseServiceInstance
}

export function resetPoseService() {
  poseServiceInstance?.close?.()
  poseServiceInstance = null
}
