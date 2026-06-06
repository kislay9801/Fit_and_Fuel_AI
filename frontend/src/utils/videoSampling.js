export const ANALYSIS_PRESETS = {
  normal: {
    label: 'Normal',
    targetFps: 8,
    maxFrames: 120,
  },
  fast: {
    label: 'Fast',
    targetFps: 4,
    maxFrames: 60,
  },
  safe: {
    label: 'Safe',
    targetFps: 2,
    maxFrames: 30,
  },
}

/**
 * Create sample times for video analysis.
 * Ensures minimum frame count and handles edge cases.
 * Returns { times, warning, targetFps, fallback }
 */
export function createSampleTimes(duration, presetName = 'fast') {
  const preset = ANALYSIS_PRESETS[presetName] || ANALYSIS_PRESETS.fast
  const numericDuration = Number(duration)

  if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
    return {
      times: [],
      warning: 'Video duration is unavailable. The video may not be fully loaded.',
      targetFps: preset.targetFps,
      fallback: false,
    }
  }

  const safeDuration = Math.max(0.001, numericDuration)
  let requestedFrames = Math.ceil(safeDuration * preset.targetFps) + 1
  let frameCount = Math.max(2, Math.min(preset.maxFrames, requestedFrames))
  
  // If we're stripping too many frames (>2/3 reduction), warn and fall back
  let fallback = false
  let warning = null
  if (requestedFrames > preset.maxFrames) {
    warning = `Sampling capped at ${preset.maxFrames} frames to keep analysis responsive.`
    // Check if fallback to safer preset would give significantly more frames
    const safeFallback = ANALYSIS_PRESETS.safe
    const safeRequestedFrames = Math.ceil(safeDuration * safeFallback.targetFps) + 1
    if (safeRequestedFrames > frameCount + 10 && presetName === 'fast') {
      // Auto-fallback to safe mode for very long videos in fast mode
      frameCount = Math.max(2, Math.min(safeFallback.maxFrames, safeRequestedFrames))
      fallback = true
      warning = `Auto-fallback to safe mode for better frame coverage (${frameCount} frames).`
    }
  }

  const interval = safeDuration / (frameCount - 1)
  const epsilon = Math.min(0.05, safeDuration / 1000)
  const times = []

  for (let i = 0; i < frameCount; i += 1) {
    const rawTime = i === frameCount - 1 ? safeDuration - epsilon : i * interval
    const time = Math.max(0, Math.min(safeDuration - epsilon, rawTime))
    times.push(Number(time.toFixed(3)))
  }

  // Ensure we have unique times and minimum 2 frames
  const uniqueTimes = Array.from(new Set(times))
  if (uniqueTimes.length < 2) {
    // Fallback: always include first and last frame
    return {
      times: [0, Number((safeDuration - epsilon).toFixed(3))],
      warning: 'Frame sampling generated insufficient unique times; using first and last frame only.',
      targetFps: 1,
      fallback: true,
    }
  }

  return {
    times: uniqueTimes,
    warning,
    targetFps: preset.targetFps,
    fallback,
  }
}

export function estimateSourceFps(video) {
  if (!video?.duration || !video?.webkitDecodedFrameCount) return null
  const fps = video.webkitDecodedFrameCount / video.duration
  return Number.isFinite(fps) && fps > 0 ? Math.round(fps) : null
}
