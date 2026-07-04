import { useState, useCallback, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { saveSessionToFirestore } from '../firebase/firestore'
import Camera from '../components/Camera'
import VideoUpload from '../components/VideoUpload'
import PoseOverlay from '../components/PoseOverlay'
import ScoreRing from '../components/ScoreRing'
import FeedbackPanel from '../components/FeedbackPanel'
import RiskAlerts from '../components/RiskAlerts'
import CoachingSummary from '../components/CoachingSummary'
import RepCounter from '../components/RepCounter'
import { scoreExercise, isRepBased } from '../utils/formScoring'
import { detectRisks } from '../utils/riskDetection'
import { getRecordingAngle } from '../utils/recordingAngle'
import { Camera as CameraIcon, Upload, Square, ChevronLeft, AlertCircle, Dumbbell, Activity, ShieldCheck, Flame, Loader2 } from 'lucide-react'

const exerciseNames = {
  squat: 'Squat', pushup: 'Push-up', deadlift: 'Deadlift', lunge: 'Forward Lunge', plank: 'Forearm Plank',
  jumpLanding: 'Jump Landing', highKnees: 'High Knees', sumoSquat: 'Sumo Squat to Stand',
  buttKicks: 'Butt Kicks', pogoJump: 'Pogo Jumps',
}
const exerciseIcons = {
  squat: Dumbbell, pushup: Activity, deadlift: Flame, lunge: ShieldCheck, plank: Dumbbell,
  jumpLanding: ShieldCheck, highKnees: Activity, sumoSquat: Dumbbell,
  buttKicks: Activity, pogoJump: Activity,
}

export default function Session({ user }) {
  const { exercise } = useParams()
  const navigate = useNavigate()

  const [mode, setMode] = useState(null)           // null | 'camera' | 'upload'
  const [isActive, setIsActive] = useState(false)
  const [videoElement, setVideoElement] = useState(null)
  const [sessionState, setSessionState] = useState('idle')

  // Live session state
  const [currentScore, setCurrentScore] = useState(0)
  const [scoreBreakdown, setScoreBreakdown] = useState({})
  const [feedback, setFeedback] = useState([])
  const [risks, setRisks] = useState([])
  const [repCount, setRepCount] = useState(0)
  const [repPhase, setRepPhase] = useState('up')
  const [analyzedFrames, setAnalyzedFrames] = useState(0)
  const [analysisMessage, setAnalysisMessage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadFinished, setUploadFinished] = useState(false)
  const [uploadAnalysis, setUploadAnalysis] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [debugMetrics, setDebugMetrics] = useState({})
  const scoringTimesRef = useRef([])

  // Session history refs
  const scoresRef = useRef([])        // every non-idle frame score (fallback aggregate)
  const repScoresRef = useRef([])     // one score per completed rep, taken at the rep's peak
  const issuesRef = useRef(new Set())
  const lastFeedbackTime = useRef(0)
  const FEEDBACK_DEBOUNCE_MS = 1000

  // Post-session
  const [sessionEnded, setSessionEnded] = useState(false)
  const [sessionData, setSessionData] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const confirmLeaveSession = useCallback(() => {
    if (!isActive || sessionEnded) return true
    return window.confirm('Your analysis is still running. Leaving now will discard the current session. Continue?')
  }, [isActive, sessionEnded])

  // ── Angle processing callback ──────────────────────────────────────────────
  const handleAngles = useCallback((angles) => {
    const scoringStart = performance.now()
    const result = scoreExercise(exercise, angles)
    const detectedRisks = detectRisks(angles, exercise)
    scoringTimesRef.current.push(performance.now() - scoringStart)
    if (scoringTimesRef.current.length > 120) scoringTimesRef.current.shift()

    setCurrentScore(result.isIdle ? 0 : result.total)
    setScoreBreakdown(result.breakdown)
    setRisks(detectedRisks)

    if (!result.isIdle) {
      scoresRef.current.push(result.total)
      setAnalyzedFrames(scoresRef.current.length)
      if (scoresRef.current.length % 10 === 0) {
        const avgScoringMs = scoringTimesRef.current.reduce((sum, value) => sum + value, 0) / scoringTimesRef.current.length
        setDebugMetrics(metrics => ({ ...metrics, avgScoringMs: Number(avgScoringMs.toFixed(2)) }))
      }
      detectedRisks.forEach(r => issuesRef.current.add(r.id))
    }

    const now = Date.now()
    if (now - lastFeedbackTime.current > FEEDBACK_DEBOUNCE_MS) {
      lastFeedbackTime.current = now
      setFeedback(result.feedback)
    }
  }, [exercise])

  const handleReps = useCallback((count, phase) => {
    setRepCount(count)
    if (phase) setRepPhase(phase)
  }, [])

  // Each completed rep is scored at its PEAK (deepest) frame — this is the
  // accurate per-rep grade. Averaging these gives the real session score,
  // instead of averaging every transitional frame (which produces noise).
  const handleRepComplete = useCallback((peakAngles) => {
    const result = scoreExercise(exercise, peakAngles)
    if (!result.isIdle) {
      repScoresRef.current.push(result.total)
    }
  }, [exercise])

  const handleVideoReady = useCallback((el) => {
    setVideoElement(el)
    setIsActive(true)
    setSessionState('analyzing')
  }, [])

  const handleUploadReady = useCallback((el) => {
    setVideoElement(el)
    setIsActive(true)
    setSessionState('ready')
    const quality = el.getVideoPlaybackQuality?.()
    const sourceFrames = quality?.totalVideoFrames || el.webkitDecodedFrameCount
    const originalFps = sourceFrames && el.duration
      ? Math.round(sourceFrames / el.duration)
      : null
    setDebugMetrics(metrics => ({
      ...metrics,
      videoLoadMs: metrics.videoLoadMs ?? 0,
      duration: el.duration,
      width: el.videoWidth,
      height: el.videoHeight,
      originalFps,
    }))
  }, [])

  const startUploadAnalysis = useCallback((preset) => {
    setAnalyzedFrames(0)
    setAnalysisMessage(null)
    setUploadFinished(false)
    setUploadStatus('loading_model')
    setUploadProgress(0)
    setSessionState('loading_model')
    scoresRef.current = []
    repScoresRef.current = []
    issuesRef.current = new Set()
    scoringTimesRef.current = []
    setUploadAnalysis({ runId: Date.now(), preset })
  }, [])

  const handleUploadProgress = useCallback((event) => {
    const status = event.status || 'analyzing'
    setUploadStatus(status)
    setUploadProgress(event.progress ?? 0)
    if (status === 'loading_model') setSessionState('loading_model')
    else setSessionState('analyzing')
    if (event.message) setAnalysisMessage(event.message)
    if (event.debug) {
      setDebugMetrics(metrics => ({ ...metrics, ...event.debug, sessionState: status }))
    }
  }, [])

  const handleDebugUpdate = useCallback((metrics) => {
    setDebugMetrics(current => ({ ...current, ...metrics }))
  }, [])

  const handleUploadComplete = useCallback((result) => {
    setUploadStatus(result?.success ? 'done' : 'error')
    setUploadProgress(100)
    setUploadFinished(Boolean(result?.success))
    if (result?.debug) setDebugMetrics(metrics => ({ ...metrics, ...result.debug, sessionState: result?.success ? 'processing_results' : 'failed' }))
    if (result?.warning) setAnalysisMessage(result.warning)
    if (result?.error) setAnalysisMessage(result.error)
    if (result?.success) {
      setSessionState('processing_results')
      setAnalysisMessage('Video analysis complete. Saving session and generating coaching summary...')
    } else {
      setSessionState('failed')
    }
  }, [])

  const endSession = async () => {
    if (isSaving) return
    setIsActive(false)

    const frameScores = scoresRef.current
    if (frameScores.length === 0) {
      setAnalysisMessage('No usable pose frames were detected. Try a clearer clip with your full body visible.')
      if (mode === 'camera') {
        setSessionState('analyzing')
        setIsActive(true)
      } else {
        setSessionState('failed')
        setIsActive(false)
      }
      return
    }

    // Prefer per-rep peak scores (accurate): each rep is graded at its deepest
    // position. Fall back to per-frame averaging for isometric holds (plank) or
    // when no full rep was detected.
    const repScores = repScoresRef.current
    const scores = (isRepBased(exercise) && repScores.length > 0) ? repScores : frameScores

    const avgScore   = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const bestScore  = Math.round(Math.max(...scores))
    const worstScore = Math.round(Math.min(...scores))
    const issues     = Array.from(issuesRef.current)

    const data = {
      exercise,
      avg_form_score: avgScore,
      reps_detected:  repCount,
      issues_detected: issues,
      best_score:  bestScore,
      worst_score: worstScore,
    }

    setSessionData(data)
    setSessionEnded(true)
    setSessionState('completed')
    setIsSaving(true)

    // Fetch coaching summary from FastAPI backend
    let coachingSummary = ''
    try {
      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8000')
      const res = await fetch(`${apiBase}/api/coaching/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const json = await res.json()
        coachingSummary = json.summary || ''
      }
    } catch (_) {
      // Backend offline
    }

    // Save to Firestore
    const uid = user?.uid || user?.id
    if (uid) {
      try {
        await saveSessionToFirestore(uid, {
          exercise,
          score:          avgScore,
          reps:           repCount,
          issues,
          riskFlags:      issues,
          coachingSummary,
          bestScore,
          worstScore,
        })
      } catch (err) {
        setSaveError('Session complete! Note: could not save to Firestore. Check Firebase config in .env')
      }
    }

    setIsSaving(false)
  }

  const startNew = () => {
    setMode(null)
    setIsActive(false)
    setVideoElement(null)
    setSessionState('idle')
    setCurrentScore(0)
    setScoreBreakdown({})
    setFeedback([])
    setRisks([])
    setRepCount(0)
    setRepPhase('up')
    setAnalyzedFrames(0)
    setAnalysisMessage(null)
    setIsSaving(false)
    setUploadFinished(false)
    setUploadAnalysis(null)
    setUploadStatus('idle')
    setUploadProgress(0)
    setDebugMetrics({})
    scoringTimesRef.current = []
    scoresRef.current = []
    repScoresRef.current = []
    issuesRef.current = new Set()
    setSessionEnded(false)
    setSessionData(null)
    setSaveError(null)
  }

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (isActive && !sessionEnded) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isActive, sessionEnded])

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!isActive || sessionEnded) return
      const link = event.target.closest?.('a[href]')
      if (!link) return
      const href = link.getAttribute('href') || ''
      if (!href.startsWith('/')) return
      if (!window.confirm('Your analysis is still running. Leaving now will discard the current session. Continue?')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener('click', onDocumentClick, true)
    return () => document.removeEventListener('click', onDocumentClick, true)
  }, [isActive, sessionEnded])

  useEffect(() => {
    if (!uploadFinished || sessionEnded || isSaving) return
    if (scoresRef.current.length === 0) {
      setAnalysisMessage('Video finished, but no usable pose frames were detected. Try a clearer full-body clip.')
      setSessionState('failed')
      return
    }

    const timer = setTimeout(() => {
      endSession()
    }, 350)

    return () => clearTimeout(timer)
  }, [uploadFinished, sessionEnded, isSaving])

  if (!exerciseNames[exercise]) {
    navigate('/exercises')
    return null
  }

  const ExIcon = exerciseIcons[exercise] || Dumbbell

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 fade-in pb-12">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md h-20 w-full flex items-center px-4 sm:px-8 border-b border-slate-200 shadow-sm">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <button
              onClick={() => {
                if (confirmLeaveSession()) navigate('/exercises')
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-sm font-semibold transition-colors border border-slate-200 flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
            </button>
            <div className="hidden sm:block h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <ExIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
                {exerciseNames[exercise]} Analysis
              </h1>
            </div>
          </div>

          {(sessionState === 'analyzing' || sessionState === 'loading_model') && !sessionEnded && (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs sm:text-sm font-bold tracking-wide shadow-sm flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Analyzing Live</span>
              <span className="sm:hidden">Live</span>
            </div>
          )}
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-[1440px] mx-auto w-full">
        {/* ── POST-SESSION VIEW ── */}
        {sessionEnded && sessionData && (
          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {saveError && (
              <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-bold shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                {saveError}
              </div>
            )}

            <CoachingSummary sessionData={sessionData} />

            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={startNew} className="px-6 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm">
                New Session
              </button>
              <button onClick={() => navigate('/history')} className="px-6 py-3.5 bg-blue-600 border border-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 transition-colors shadow-sm">
                View History →
              </button>
            </div>
          </div>
        )}

        {/* ── MODE SELECTION ── */}
        {!mode && !sessionEnded && (
          <div className="flex flex-col items-center justify-center py-20 fade-in">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Record Your Session</h2>
            <p className="text-slate-500 font-medium mb-8">Choose how you would like to analyze your form.</p>

            {/* Recommended camera angle for this exercise */}
            <div className="mb-10 w-full max-w-2xl bg-blue-600 text-white rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <CameraIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-0.5">
                  Recommended angle · {getRecordingAngle(exercise).angle}
                </div>
                <p className="text-sm font-medium leading-snug">{getRecordingAngle(exercise).tip}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              {[
                { id: 'camera', icon: CameraIcon, title: 'Live Camera', desc: 'Real-time analysis via webcam', color: 'blue' },
                { id: 'upload', icon: Upload, title: 'Upload Video', desc: 'Fast-seek analysis — 30s video in ~5s', color: 'emerald' },
              ].map(({ id, icon: Icon, title, desc, color }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`flex flex-col items-center text-center p-8 bg-white border border-slate-200 rounded-3xl hover:border-${color}-300 hover:shadow-xl hover:-translate-y-1 transition-all group`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-${color}-50 border border-${color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon className={`w-8 h-8 text-${color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-12 max-w-2xl bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex gap-4 text-left shadow-sm">
              <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                <strong className="text-slate-900">For best results:</strong> Stand 2–3 meters from the camera so your full body is visible.
                Good lighting and form-fitting clothes help the AI track your joints with clinical precision.
              </p>
            </div>
          </div>
        )}

        {/* ── ACTIVE SESSION VIEW (2-COLUMN) ── */}
        {mode && !sessionEnded && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start fade-in">
            {/* LEFT: Video Feed */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="relative rounded-2xl bg-slate-900 shadow-lg ring-4 ring-slate-900/5">
                {mode === 'camera' && (
                  <Camera onFrame={handleVideoReady} isActive={true}>
                    {videoElement && isActive && (
                      <PoseOverlay
                        videoElement={videoElement}
                        exercise={exercise}
                        onAngles={handleAngles}
                        onReps={handleReps}
                        onRepComplete={handleRepComplete}
                        isActive={isActive}
                        fps={15}
                        analysisMode="live"
                      />
                    )}
                  </Camera>
                )}
                {mode === 'upload' && (
                  <VideoUpload
                    onFrame={handleUploadReady}
                    onStartAnalysis={startUploadAnalysis}
                    isSessionActive={sessionState === 'analyzing' || sessionState === 'loading_model'}
                    analysisStatus={sessionState === 'loading_model' ? 'loading_model' : sessionState === 'analyzing' ? 'analyzing' : sessionState === 'completed' ? 'done' : sessionState === 'failed' ? 'error' : 'idle'}
                    analysisProgress={uploadProgress}
                    analysisMessage={analysisMessage}
                  >
                    {videoElement && isActive && (
                      <PoseOverlay
                        videoElement={videoElement}
                        exercise={exercise}
                        onAngles={handleAngles}
                        onReps={handleReps}
                        onRepComplete={handleRepComplete}
                        isActive={isActive}
                        fps={12}
                        analysisMode="upload"
                        uploadAnalysis={uploadAnalysis}
                        onUploadProgress={handleUploadProgress}
                        onUploadComplete={handleUploadComplete}
                        onDebugUpdate={handleDebugUpdate}
                      />
                    )}
                  </VideoUpload>
                )}

                <RiskAlerts risks={risks} />
              </div>

              {/* Action / Status bar */}
              <div className="flex flex-col gap-3">
                {/* Live camera: a Stop control is always available while the camera runs */}
                {mode === 'camera' && !sessionEnded && (
                  <button
                    onClick={analyzedFrames > 0 ? endSession : startNew}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-extrabold hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm disabled:opacity-60"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    {isSaving
                      ? 'Saving Session...'
                      : analyzedFrames > 0
                        ? 'Stop & Get Coaching Summary'
                        : 'Stop Camera'}
                  </button>
                )}

                {/* Upload: allow ending early once frames have been analyzed */}
                {mode === 'upload' && isActive && analyzedFrames > 0 && (
                  <button
                    onClick={endSession}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-extrabold hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    {isSaving ? 'Saving Session...' : 'End Session & Get Coaching Summary'}
                  </button>
                )}

                {sessionState === 'analyzing' && mode === 'camera' && analyzedFrames === 0 && (
                  <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm font-bold shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    Waiting for pose detection... make sure your full body is visible
                  </div>
                )}

                {analysisMessage && !sessionEnded && (
                  <div className={`px-5 py-4 rounded-xl border text-sm font-bold shadow-sm flex items-center gap-2 ${
                    analyzedFrames > 0 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {analysisMessage}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Real-time Analytics Dashboard */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Score Ring Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                  Form Score
                </div>
                <ScoreRing score={currentScore} size={200} />
                {analyzedFrames > 0 && (
                  <div className="mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {analyzedFrames} frames analyzed
                  </div>
                )}
              </div>

              {/* Rep Counter — hidden for isometric holds (e.g. plank) */}
              {isRepBased(exercise) && (
                <RepCounter count={repCount} phase={repPhase} exercise={exercise} />
              )}

              {/* Feedback Panel */}
              <FeedbackPanel feedback={feedback} isVisible={feedback.length > 0} />

              {/* Score Breakdown Bars */}
              {currentScore > 0 && Object.keys(scoreBreakdown).length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                    Real-time Breakdown
                  </div>
                  <div className="flex flex-col gap-4">
                    {Object.entries(scoreBreakdown).map(([key, val]) => {
                      const label = key.replace(/Score$/, '').replace(/([A-Z])/g, ' $1').trim()
                      const barColorClass = val >= 75 ? 'bg-emerald-500' : val >= 55 ? 'bg-amber-500' : 'bg-red-500'
                      const textColorClass = val >= 75 ? 'text-emerald-700' : val >= 55 ? 'text-amber-700' : 'text-red-700'
                      return (
                        <div key={key}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm font-bold text-slate-600 capitalize">{label}</span>
                            <span className={`text-sm font-extrabold ${textColorClass}`}>{val}</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                            <div className={`h-full rounded-full transition-all duration-300 ${barColorClass}`} style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Developer Debug Panel */}
              {mode === 'upload' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-12">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Developer Debug
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[
                      ['Session State', sessionState],
                      ['Duration', debugMetrics.duration ? `${debugMetrics.duration.toFixed(1)}s` : '-'],
                      ['Video Size', debugMetrics.width && debugMetrics.height ? `${debugMetrics.width}x${debugMetrics.height}` : '-'],
                      ['Original FPS', debugMetrics.originalFps ?? '-'],
                      ['Target FPS', debugMetrics.targetFps ?? '-'],
                      ['Frames Extracted', debugMetrics.framesExtracted ?? 0],
                      ['Frames Analyzed', debugMetrics.framesAnalyzed ?? analyzedFrames],
                      ['Frames Accepted', debugMetrics.framesAccepted ?? analyzedFrames],
                      ['Landmarks Found', `${debugMetrics.landmarksDetected ?? 0} (${debugMetrics.landmarksDetectedPct ?? 0}%)`],
                      ['Accepted Rate', debugMetrics.acceptedFramePct ? `${debugMetrics.acceptedFramePct}%` : '-'],
                      ['Avg Extraction', debugMetrics.avgFrameExtractionMs ? `${debugMetrics.avgFrameExtractionMs}ms` : '-'],
                      ['Avg Inference', debugMetrics.avgInferenceMs ? `${debugMetrics.avgInferenceMs}ms` : '-'],
                      ['Avg Angle Calc', debugMetrics.avgAngleMs ? `${debugMetrics.avgAngleMs}ms` : '-'],
                      ['Avg Scoring', debugMetrics.avgScoringMs ? `${debugMetrics.avgScoringMs}ms` : '-'],
                      ['Total Time', debugMetrics.totalProcessingMs ? `${(debugMetrics.totalProcessingMs / 1000).toFixed(1)}s` : '-'],
                      ['Failed Seeks', debugMetrics.failedSeeks ?? 0],
                      ['Frame Ready Errors', debugMetrics.frameReadyFailures ?? 0],
                      ['Reps Detected', repCount],
                      ['Current Score', currentScore],
                      ['Final Score', sessionData?.avg_form_score ?? '-'],
                    ].map(([label, value]) => {
                      const isError = typeof value === 'string' && value !== '-' && (value.includes('0 (0%)') || value.startsWith('0 frames'))
                      return (
                        <div key={label} className="flex justify-between gap-2">
                          <span className="text-xs text-slate-500 font-medium">{label}</span>
                          <span className={`text-xs font-mono font-bold ${isError ? 'text-red-500' : 'text-slate-700'}`}>{value}</span>
                        </div>
                      )
                    })}
                  </div>
                  {(debugMetrics.warning || debugMetrics.fallback) && (
                    <div className={`mt-4 p-3 rounded-xl border text-xs font-bold leading-relaxed shadow-sm ${
                      debugMetrics.fallback ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {debugMetrics.fallback && '⚠️ Fallback mode: Frames were adjusted for better coverage.\n'}
                      {debugMetrics.warning}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  )
}
