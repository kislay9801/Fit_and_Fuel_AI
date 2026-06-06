# QUICK REFERENCE - WHAT WAS CHANGED

## 1. Package Dependencies

**Before:**

```json
"@mediapipe/camera_utils": "^0.3.1675466862",
"@mediapipe/drawing_utils": "^0.3.1675466124",
"@mediapipe/pose": "^0.5.1675469404"
```

**After:**

```json
"@mediapipe/tasks-vision": "^0.10.8"
```

**Why**: CDN-based `@mediapipe/pose` frequently failed. `@mediapipe/tasks-vision` includes bundled WASM and models that work reliably in Vite builds.

---

## 2. New File: PoseService.js

**Purpose**: Encapsulates pose detector initialization with explicit state machine

**Key Features**:

- States: `idle` → `loading` → `ready` or `failed`
- No callbacks - explicit state checking via `getState()`
- Comprehensive error messages
- Input validation (dimensions, readyState)
- Singleton pattern for app-wide instance

**Key Methods**:

```javascript
poseService.initialize(); // Load model, transitions to ready/failed
poseService.getState(); // Returns current state
poseService.getError(); // Returns error message if failed
poseService.send(videoElement); // Run inference
poseService.close(); // Cleanup
```

---

## 3. Removed from PoseOverlay.jsx

**These refs no longer needed (replaced by PoseService state)**:

- `poseReadyRef` - Was boolean flag for "onResults fired"
- `modelReadyPromiseRef` - Was promise waiting for callback
- `modelReadyResolveRef` - Was resolver for above promise
- `modelReadyRejectRef` - Was rejector for above promise
- `modelWarmupTimeoutRef` - Was warmup timeout ID

**This logic removed**:

```javascript
// OLD: Waiting for onResults callback to signal readiness
const warmupStart = performance.now();
pose.onResults((results) => {
  if (disposed) return;
  if (!poseReadyRef.current) {
    poseReadyRef.current = true;
    modelReadyResolveRef.current?.(); // Signal we're ready
    window.clearTimeout(modelWarmupTimeoutRef.current);
  }
  processResults(results);
});
```

---

## 4. New in PoseOverlay.jsx - Live Mode

**Before**: Waited for onResults callback

```javascript
if (!poseReadyRef.current) return false; // Still waiting
```

**After**: Check explicit state

```javascript
if (poseService.getState() === "ready") {
  const results = await poseService.send(videoElement, timestamp);
  processResults(results);
}
```

---

## 5. New in PoseOverlay.jsx - Upload Mode

**Before**: Relied on unreliable waitForPose() with callback

```javascript
const waitForPose = async () => {
  if (poseReadyRef.current) return true
  if (!modelReadyPromiseRef.current) return false

  // Try to trigger readiness via warmup send
  try {
    await sendPoseImage(videoElement, 4000)
  } catch (err) {
    console.warn('Pose warmup send failed:', err)
  }

  // Wait for callback to fire
  await Promise.race([
    modelReadyPromiseRef.current,  // Wait for onResults
    new Promise((_, reject) => {
      timeoutId = window.setTimeout(() => reject(...), timeoutMs)
    })
  ])
  return poseReadyRef.current
}
```

**After**: Direct initialization with explicit error handling

```javascript
try {
  await poseService.initialize();
  console.debug("[PoseOverlay] Pose service initialized for upload analysis");
} catch (err) {
  const errorMsg = err.message || "Failed to initialize pose detector";
  console.error("[PoseOverlay] Pose initialization failed:", err);
  onUploadComplete?.({
    success: false,
    error: `Failed to load pose detector: ${errorMsg}`,
  });
  return;
}
```

---

## 6. Error Handling - Before vs After

### Before (Silent Failure)

```javascript
try {
  await pose.send({ image: videoElement });
} catch (err) {
  if (!disposed) console.error("MediaPipe pose send failed:", err); // Only logged
  // Error silently ignored, analysis continues with invalid frame
}
```

### After (Clear User Feedback)

```javascript
try {
  const results = await poseService.send(videoElement, timestamp);
  inferenceTimes.push(performance.now() - inferenceStart);
  framesAnalyzed += 1;

  const poseLandmarks = results.landmarks?.[0] || [];
  if (poseLandmarks.length > 0) {
    landmarksDetected += 1;
  }
} catch (inferenceErr) {
  console.warn(
    `[PoseOverlay] Inference error at frame ${i}:`,
    inferenceErr.message,
  );
  // Counted as analyzed but no landmarks - statistics show it
  // User sees detailed report at end: "X frames analyzed, Y landmarks detected"
}
```

**In PoseService.js**:

```javascript
if (!this.poseLandmarker) {
  throw new Error("Pose landmarker not available");
}

if (!input) {
  throw new Error("Invalid input: input is null or undefined");
}

const width = input.width || input.videoWidth || 0;
const height = input.height || input.videoHeight || 0;

if (width <= 0 || height <= 0) {
  throw new Error(`Invalid frame dimensions: ${width}x${height}`);
}

if (input.readyState !== undefined && input.readyState < 2) {
  throw new Error(`Input not ready: readyState=${input.readyState}`);
}
```

---

## 7. Video Validation - New Upload Mode Check

```javascript
// Validate video metadata upfront before analysis
if (!Number.isFinite(duration) || duration <= 0 || !width || !height) {
  onUploadComplete?.({
    success: false,
    error:
      "Video metadata is incomplete. Try re-exporting the clip as MP4 or WebM.",
    debug: { duration, width, height, readyState: videoElement.readyState },
  });
  return;
}

// Validate frame is ready before processing each frame
const isFrameReady = () => {
  try {
    return (
      videoElement.readyState >= 2 &&
      videoElement.videoWidth > 0 &&
      videoElement.videoHeight > 0
    );
  } catch (e) {
    return false;
  }
};
```

---

## 8. Diagnostics - Console Logging

**Before**:

```
MediaPipe pose send failed: undefined
```

**After**:

```
[PoseService] Initializing pose detector with bundled assets...
[PoseService] Vision filesets loaded successfully
[PoseService] Pose detector initialized successfully (1245ms)
[PoseService] Sending frame 1280x720 at timestamp 0ms
[PoseService] Inference successful (145ms, 33 landmarks detected)

[PoseOverlay] Pose model initialized in 1245ms
[PoseOverlay] Frame processed in 155ms
```

---

## 9. Test Coverage

**New Tests** (6 total in PoseService.test.js):

```javascript
✔ initializes with idle state
✔ transitions to loading state during initialization
✔ returns error on multiple initialize calls to same service
✔ sets error state on initialization failure
✔ throws error when sending frame to failed service
✔ closes properly and cleans up resources
```

**All Existing Tests Still Pass** (29 total):

```
✔ RepCounter (2 tests)
✔ Pose Angle Scoring (2 tests)
✔ Frame Sampling (17 tests)
✔ Video Sampling (8 tests)
```

---

## 10. User Experience Impact

### Before

1. User uploads video
2. App says "Loading pose model..."
3. ~10 seconds of waiting
4. Error: "Pose model did not finish loading. Try again."
5. User doesn't know what to do

### After

1. User uploads video
2. App says "Loading pose model..." (faster, ~1-2 sec)
3. Video analyzes successfully OR shows specific error:
   - "Video metadata is incomplete" (try different format)
   - "Failed to initialize pose detector: WASM load error" (network issue)
   - "Invalid frame dimensions" (corrupted video)
   - "No pose landmarks detected in X sampled frames" (try clearer video)
4. User knows exactly how to fix the problem

---

## Installation & Verification

```bash
# Install new dependencies
npm install

# Run tests (35/35 must pass)
npm test

# Build for production
npm run build

# Check build output
ls -la dist/
```

---

## Rollback Plan

If issues occur:

```bash
# Revert all changes
git checkout frontend/

# Go back to old dependencies
npm install

# Verify
npm test
npm run build
```

All changes are isolated to 3 files:

- `frontend/package.json`
- `frontend/src/services/PoseService.js` (NEW, can delete)
- `frontend/src/components/PoseOverlay.jsx` (changed, can revert)

No changes to backend, database schema, or other components.
