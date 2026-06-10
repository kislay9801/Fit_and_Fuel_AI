import { useEffect, useRef, useCallback } from 'react'
import { getExerciseAngles } from '../utils/poseAngles'
import { AnglesSmoother } from '../utils/smoothing'
import { RepCounter } from '../utils/repCounting'
import { createSampleTimes } from '../utils/videoSampling'
import { getPoseService } from '../services/PoseService'

export default function PoseOverlay({
  videoElement,
  exercise,
  onAngles,
  onReps,
  onRepComplete,
  isActive,
  fps = 15,
  analysisMode = 'live',
  uploadAnalysis = null,
  onUploadProgress,
  onUploadComplete,
  onDebugUpdate,
}) {
  const canvasRef = useRef(null)
  const poseServiceRef = useRef(null)
  const animFrameRef = useRef(null)
  const smootherRef = useRef(null)
  const repCounterRef = useRef(null)
  const lastResultRef = useRef(null)
  const drawingUtilsRef = useRef(null)

  const getAngles = useCallback((landmarks) => {
    return getExerciseAngles(exercise, landmarks)
  }, [exercise])

  useEffect(() => {
    // Lighter smoothing window: a window of 5 flattens fast cyclic movements
    // (high knees, butt kicks, pogo) so reps never register. 3 keeps jitter
    // down while preserving the oscillation needed for rep detection.
    smootherRef.current = new AnglesSmoother(3)
    repCounterRef.current = new RepCounter(exercise)
    return () => {
      smootherRef.current?.reset()
      repCounterRef.current?.reset()
    }
  }, [exercise])

  useEffect(() => {
    if (!videoElement || !isActive) return

    let disposed = false
    let sending = false
    let drawConnectors = null
    let drawLandmarks = null
    let poseConnections = null
    const poseService = getPoseService()

    const processResults = (results) => {
      const frameStart = performance.now()
      const canvas = canvasRef.current
      if (!canvas) return { landmarksDetected: false, angleMs: 0, totalMs: 0 }

      const ctx = canvas.getContext('2d')
      const width = videoElement.videoWidth || videoElement.clientWidth || 640
      const height = videoElement.videoHeight || videoElement.clientHeight || 480
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Extract pose landmarks from MediaPipe Pose Landmarker format
      const poseLandmarks = results.landmarks?.[0] || []
      if (poseLandmarks.length === 0) {
        lastResultRef.current = {
          landmarksDetected: false,
          angleMs: 0,
          totalMs: performance.now() - frameStart,
        }
        return lastResultRef.current
      }

      // Draw landmarks and connectors using drawing utils
      if (drawConnectors && drawLandmarks && poseConnections) {
        try {
          drawConnectors(ctx, poseLandmarks, poseConnections, {
            color: 'rgba(59,130,246,0.7)',
            lineWidth: 2,
          })
          drawLandmarks(ctx, poseLandmarks, {
            color: '#10B981',
            fillColor: '#10B981',
            lineWidth: 1,
            radius: 4,
          })
        } catch (err) {
          console.debug('Drawing visualization skipped:', err.message)
        }
      }

      const angleStart = performance.now()
      const rawAngles = getAngles(poseLandmarks)
      const angleMs = performance.now() - angleStart
      const smoothedAngles = smootherRef.current?.smooth(rawAngles) ?? rawAngles

      if (smoothedAngles) {
        const reps = repCounterRef.current?.update(smoothedAngles) ?? 0
        onReps?.(reps, repCounterRef.current?.getPhase())
        const completedPeak = repCounterRef.current?.popCompletedRep()
        if (completedPeak) onRepComplete?.(completedPeak)
        onAngles?.(smoothedAngles)
      }

      lastResultRef.current = {
        landmarksDetected: Boolean(smoothedAngles),
        angleMs,
        totalMs: performance.now() - frameStart,
      }
      return lastResultRef.current
    }

    const initPose = async () => {
      const modelLoadStart = performance.now()
      try {
        // Load drawing utilities
        const { drawConnectors: drawConnectorsUtil, drawLandmarks: drawLandmarksUtil, POSE_CONNECTIONS } = await import('@mediapipe/tasks-vision')

        if (disposed) return

        drawConnectors = (ctx, landmarks, connections, style) => {
          for (const connection of connections) {
            const start = landmarks[connection.start]
            const end = landmarks[connection.end]
            if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
              ctx.strokeStyle = style.color
              ctx.lineWidth = style.lineWidth
              ctx.beginPath()
              ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height)
              ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height)
              ctx.stroke()
            }
          }
        }

        drawLandmarks = (ctx, landmarks, style) => {
          for (const landmark of landmarks) {
            if (landmark.visibility > 0.5) {
              ctx.fillStyle = style.color
              ctx.beginPath()
              ctx.arc(
                landmark.x * ctx.canvas.width,
                landmark.y * ctx.canvas.height,
                style.radius,
                0,
                2 * Math.PI
              )
              ctx.fill()
            }
          }
        }

        poseConnections = [
          { start: 0, end: 1 },
          { start: 1, end: 2 },
          { start: 2, end: 3 },
          { start: 3, end: 4 },
          { start: 0, end: 5 },
          { start: 5, end: 6 },
          { start: 6, end: 7 },
          { start: 7, end: 8 },
          { start: 5, end: 9 },
          { start: 9, end: 10 },
          { start: 10, end: 11 },
          { start: 11, end: 12 },
          { start: 11, end: 13 },
          { start: 13, end: 15 },
          { start: 12, end: 14 },
          { start: 14, end: 16 },
          { start: 15, end: 21 },
          { start: 16, end: 20 },
          { start: 18, end: 17 },
          { start: 24, end: 23 },
          { start: 25, end: 26 },
          { start: 27, end: 28 },
          { start: 29, end: 30 },
          { start: 31, end: 32 },
        ]
        drawingUtilsRef.current = { drawConnectors, drawLandmarks, poseConnections }

        // Initialize pose service
        const modelInitStart = performance.now()
        await poseService.initialize()
        const modelInitMs = Math.round(performance.now() - modelInitStart)
        console.debug(`[PoseOverlay] Pose model initialized in ${modelInitMs}ms`)

        const totalLoadMs = Math.round(performance.now() - modelLoadStart)
        onDebugUpdate?.({ modelLoadMs: totalLoadMs })

        poseServiceRef.current = poseService

        // For live mode, start the frame capture loop
        if (analysisMode !== 'live') return

        let lastTime = 0
        const detect = async (timestamp) => {
          if (!isActive || disposed) return
          if (timestamp - lastTime > 1000 / fps && !sending) {
            lastTime = timestamp
            if (videoElement.readyState >= 2 && poseService.getState() === 'ready') {
              sending = true
              try {
                const inferenceStart = performance.now()
                const results = await poseService.send(videoElement, timestamp)
                const inferenceMs = Math.round(performance.now() - inferenceStart)
                console.debug(`[PoseOverlay] Frame processed in ${inferenceMs}ms`)
                processResults(results)
              } catch (err) {
                if (!disposed) {
                  console.error('[PoseOverlay] Pose inference error:', err.message)
                }
              } finally {
                sending = false
              }
            }
          }
          if (!disposed) animFrameRef.current = requestAnimationFrame(detect)
        }

        animFrameRef.current = requestAnimationFrame(detect)
      } catch (err) {
        if (!disposed) {
          const errorMsg = err.message || 'Failed to initialize pose'
          console.error('[PoseOverlay] Initialization failed:', err)
          onUploadComplete?.({ success: false, error: `Failed to initialize pose detector: ${errorMsg}` })
        }
      }
    }

    initPose()

    return () => {
      disposed = true
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      poseServiceRef.current = null
    }
  }, [videoElement, isActive, exercise, getAngles, onAngles, onReps, onRepComplete, fps, analysisMode, onDebugUpdate, onUploadComplete])

  useEffect(() => {
    if (!videoElement || !isActive || analysisMode !== 'upload' || !uploadAnalysis?.runId) return

    let cancelled = false
    const poseService = getPoseService()

    /**
     * Seek to a specific time and wait for frame to be ready.
     * Includes retry logic for better reliability.
     */
    const seekTo = (time, maxRetries = 2) => new Promise((resolve, reject) => {
      let attempts = 0

      const attemptSeek = () => {
        attempts += 1
        const timeout = window.setTimeout(() => {
          cleanup()
          if (attempts < maxRetries) {
            attemptSeek()
          } else {
            reject(new Error(`Failed to seek to ${time}s after ${maxRetries} attempts`))
          }
        }, 3000)

        const cleanup = () => {
          window.clearTimeout(timeout)
          videoElement.removeEventListener('seeked', onSeeked)
          videoElement.removeEventListener('error', onError)
        }

        const onSeeked = () => {
          window.setTimeout(() => {
            cleanup()
            resolve()
          }, 50)
        }

        const onError = () => {
          cleanup()
          if (attempts < maxRetries) {
            attemptSeek()
          } else {
            reject(new Error('Video seek error'))
          }
        }

        videoElement.addEventListener('seeked', onSeeked, { once: true })
        videoElement.addEventListener('error', onError, { once: true })
        videoElement.currentTime = time
      }

      attemptSeek()
    })

    /**
     * Validate that video data is available after seeking.
     * Returns true if frame data is readable.
     */
    const isFrameReady = () => {
      try {
        return videoElement.readyState >= 2 && videoElement.videoWidth > 0 && videoElement.videoHeight > 0
      } catch (e) {
        return false
      }
    }

    /**
     * Calculate average of array, handling empty array.
     */
    const avg = (values) => values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0

    const run = async () => {
      const totalStart = performance.now()
      const duration = videoElement.duration
      const width = videoElement.videoWidth
      const height = videoElement.videoHeight

      // Validate video metadata upfront
      if (!Number.isFinite(duration) || duration <= 0 || !width || !height) {
        onUploadComplete?.({
          success: false,
          error: 'Video metadata is incomplete. Try re-exporting the clip as MP4 or WebM.',
          debug: { duration, width, height, readyState: videoElement.readyState },
        })
        return
      }

      onUploadProgress?.({ status: 'loading_model', progress: 0, message: 'Loading pose model...' })

      // Ensure pose service is initialized before processing
      try {
        await poseService.initialize()
        console.debug('[PoseOverlay] Pose service initialized for upload analysis')
      } catch (err) {
        const errorMsg = err.message || 'Failed to initialize pose detector'
        console.error('[PoseOverlay] Pose initialization failed:', err)
        onUploadComplete?.({ success: false, error: `Failed to load pose detector: ${errorMsg}` })
        return
      }

      if (cancelled) return

      const sample = createSampleTimes(duration, uploadAnalysis.preset || 'fast')
      if (sample.times.length === 0) {
        onUploadComplete?.({ success: false, error: sample.warning || 'No sample frames could be created.' })
        return
      }

      videoElement.pause()

      const inferenceTimes = []
      const extractionTimes = []
      const angleTimes = []
      const seekFailures = []
      const frameReadyFailures = []
      let framesExtracted = 0
      let framesAnalyzed = 0
      let framesAccepted = 0
      let landmarksDetected = 0
      let failedSeeks = 0

      for (let i = 0; i < sample.times.length; i += 1) {
        if (cancelled) return

        let seekSuccess = false
        const extractionStart = performance.now()

        try {
          await seekTo(sample.times[i])
          seekSuccess = true

          // Validate frame is ready before analysis
          if (!isFrameReady()) {
            frameReadyFailures.push(sample.times[i])
            extractionTimes.push(performance.now() - extractionStart)
            continue
          }

          extractionTimes.push(performance.now() - extractionStart)
          framesExtracted += 1

          const inferenceStart = performance.now()
          lastResultRef.current = null
          
          try {
            const results = await poseService.send(videoElement, extractionStart)
            inferenceTimes.push(performance.now() - inferenceStart)

            framesAnalyzed += 1
            
            // Extract landmarks and compute angles
            const poseLandmarks = results.landmarks?.[0] || []
            if (poseLandmarks.length > 0) {
              landmarksDetected += 1
              const rawAngles = getAngles(poseLandmarks)
              const angleStart = performance.now()
              const smoothedAngles = smootherRef.current?.smooth(rawAngles) ?? rawAngles
              angleTimes.push(Math.round(performance.now() - angleStart))

              if (smoothedAngles) {
                framesAccepted += 1
                const currentReps = repCounterRef.current?.update(smoothedAngles) ?? 0
                onReps?.(currentReps, repCounterRef.current?.getPhase())
                const completedPeak = repCounterRef.current?.popCompletedRep()
                if (completedPeak) onRepComplete?.(completedPeak)
                onAngles?.(smoothedAngles)
              }
            }
          } catch (inferenceErr) {
            console.warn(`[PoseOverlay] Inference error at frame ${i}:`, inferenceErr.message)
            inferenceTimes.push(performance.now() - inferenceStart)
            framesAnalyzed += 1
          }
        } catch (err) {
          if (seekSuccess) {
            frameReadyFailures.push(sample.times[i])
          } else {
            seekFailures.push({ time: sample.times[i], error: err.message })
            failedSeeks += 1
          }
          console.warn(`[PoseOverlay] Frame processing error at ${sample.times[i]}s:`, err.message)
        }

        const progress = Math.round(((i + 1) / sample.times.length) * 100)
        const debug = {
          duration,
          width,
          height,
          targetFps: sample.targetFps,
          framesExtracted,
          framesAnalyzed,
          landmarksDetected,
          landmarksDetectedPct: framesAnalyzed ? Math.round((landmarksDetected / framesAnalyzed) * 100) : 0,
          avgFrameExtractionMs: Math.round(avg(extractionTimes)),
          avgInferenceMs: Math.round(avg(inferenceTimes)),
          avgAngleMs: Number(avg(angleTimes).toFixed(2)),
          totalProcessingMs: Math.round(performance.now() - totalStart),
          failedSeeks,
          frameReadyFailures: frameReadyFailures.length,
          warning: sample.warning,
          fallback: sample.fallback,
        }
        onDebugUpdate?.(debug)
        onUploadProgress?.({
          status: 'analyzing',
          progress,
          message: `Analyzed ${i + 1}/${sample.times.length} frames...`,
          debug,
        })
      }

      const finalDebug = {
        duration,
        width,
        height,
        targetFps: sample.targetFps,
        framesExtracted,
        framesAnalyzed,
        framesAccepted,
        landmarksDetected,
        landmarksDetectedPct: framesAnalyzed ? Math.round((landmarksDetected / framesAnalyzed) * 100) : 0,
        acceptedFramePct: framesAnalyzed ? Math.round((framesAccepted / framesAnalyzed) * 100) : 0,
        avgFrameExtractionMs: Math.round(avg(extractionTimes)),
        avgInferenceMs: Math.round(avg(inferenceTimes)),
        avgAngleMs: Number(avg(angleTimes).toFixed(2)),
        totalProcessingMs: Math.round(performance.now() - totalStart),
        failedSeeks,
        frameReadyFailures: frameReadyFailures.length,
        warning: sample.warning,
        fallback: sample.fallback,
      }

      // Determine success based on accepted frames
      const success = framesAccepted > 0
      let error = null

      if (!success) {
        if (failedSeeks > 0 || frameReadyFailures.length > 0) {
          error = `Could not extract video frames properly. Failures: ${failedSeeks} seek errors, ${frameReadyFailures.length} frame ready errors. Try a different video or re-export it as MP4.`
        } else if (framesAnalyzed === 0) {
          error = 'No frames were analyzed. Video may not be fully loaded.'
        } else {
          error = `No pose landmarks detected in ${framesAnalyzed} sampled frames. Try a clearer full-body clip with the camera positioned to see your entire body.`
        }
      }

      onDebugUpdate?.(finalDebug)
      onUploadComplete?.({
        success,
        error,
        warning: sample.warning,
        debug: finalDebug,
      })
    }

    run().catch((err) => {
      if (!cancelled) {
        const errorMsg = err.message || 'Video analysis failed'
        console.error('[PoseOverlay] Upload analysis error:', err)
        onUploadComplete?.({
          success: false,
          error: `Analysis error: ${errorMsg}. Try re-exporting the video as MP4 and ensuring it's fully loaded.`,
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [videoElement, isActive, analysisMode, uploadAnalysis, onUploadProgress, onUploadComplete, onDebugUpdate, getAngles, onReps, onRepComplete, onAngles])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}
