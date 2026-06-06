import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { getCoachingSummary } from '../utils/api'

function localCoachingFallback(sessionData) {
  const exercise = sessionData.exercise || 'exercise'
  const score = sessionData.avg_form_score ?? 0
  const issues = sessionData.issues_detected || []
  const issueText = issues.length
    ? `Main issue detected: ${issues[0].replace(/_/g, ' ')}.`
    : 'No major issue was repeatedly flagged.'

  const bandText =
    score >= 90 ? 'Excellent session. Keep the same technique and slowly progress volume.' :
    score >= 75 ? 'Good session. Keep the load steady and focus on consistent reps.' :
    score >= 55 ? 'Needs work. Reduce speed or load and make each rep more controlled.' :
    'High risk. Treat this as technique practice, not a max-effort set.'

  const drill =
    issues.includes('knee_valgus') ? 'Drill: banded squats, 2 sets of 12, cue knees out.' :
    issues.includes('forward_lean') ? 'Drill: goblet squats, 3 sets of 8, chest tall.' :
    issues.includes('hip_sag') ? 'Drill: dead bugs and plank holds before push-ups.' :
    issues.includes('elbow_flare') ? 'Drill: close-grip push-ups, elbows around 45 degrees.' :
    issues.includes('lumbar_rounding') ? 'Drill: light Romanian deadlifts with a neutral spine.' :
    issues.includes('hyperextension') ? 'Drill: lock out by squeezing glutes, ribs down.' :
    `Drill: repeat ${exercise} with a side-view camera angle and controlled tempo.`

  return `${bandText}\n\nYou averaged ${score}/100 across ${sessionData.reps_detected || 0} detected reps. ${issueText}\n\n${drill}`
}

export default function CoachingSummary({ sessionData }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (sessionData) fetchSummary()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchSummary() {
    setLoading(true)
    setError(null)
    setSummary(null)
    try {
      const data = await getCoachingSummary(sessionData)
      setSummary(data.summary)
    } catch (err) {
      setSummary(localCoachingFallback(sessionData))
      setError('Backend coaching endpoint was unavailable, so this local fallback summary was generated in the browser.')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionData) return null

  let scoreColorClass = 'text-red-600'
  let scoreBgClass = 'bg-red-50 border-red-200 text-red-700'
  let scoreLabel = 'High Risk'
  let scoreEmoji = '🔴'

  if (sessionData.avg_form_score >= 90) {
    scoreColorClass = 'text-emerald-600'
    scoreBgClass = 'bg-emerald-50 border-emerald-200 text-emerald-700'
    scoreLabel = 'Excellent'
    scoreEmoji = '✅'
  } else if (sessionData.avg_form_score >= 75) {
    scoreColorClass = 'text-blue-600'
    scoreBgClass = 'bg-blue-50 border-blue-200 text-blue-700'
    scoreLabel = 'Good'
    scoreEmoji = '👍'
  } else if (sessionData.avg_form_score >= 55) {
    scoreColorClass = 'text-amber-600'
    scoreBgClass = 'bg-amber-50 border-amber-200 text-amber-700'
    scoreLabel = 'Needs Work'
    scoreEmoji = '⚠️'
  }

  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-emerald-50/50 border border-blue-100 rounded-3xl p-8 fade-in shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-md">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Session Complete! 🎉
          </h3>
          <p className="text-sm font-medium text-slate-500">
            Here's your performance breakdown
          </p>
        </div>
        <div className={`ml-auto px-4 py-2 border rounded-full text-sm font-bold shadow-sm flex items-center gap-1.5 ${scoreBgClass}`}>
          <span>{scoreEmoji}</span> {scoreLabel}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Avg Score', value: `${sessionData.avg_form_score}`, suffix: '/100', color: scoreColorClass },
          { label: 'Best Score', value: sessionData.best_score ?? '—', color: 'text-emerald-600' },
          { label: 'Reps', value: sessionData.reps_detected ?? 0, color: 'text-blue-600' },
          { label: 'Issues', value: sessionData.issues_detected?.length ?? 0, color: 'text-amber-600' },
        ].map(({ label, value, suffix, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 text-center border border-slate-200 shadow-sm">
            <div className={`text-3xl font-extrabold leading-none mb-2 tabular-nums ${color}`}>
              {value}<span className="text-sm font-bold opacity-60 ml-0.5">{suffix || ''}</span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {/* Issues list */}
      {sessionData.issues_detected?.length > 0 && (
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Issues Flagged
          </div>
          <div className="flex flex-wrap gap-2">
            {sessionData.issues_detected.map(issue => (
              <span key={issue} className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-700 uppercase tracking-wide">
                {issue.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Coaching Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">
              AI Coaching Summary
            </span>
          </div>
          {(error || summary) && !loading && (
            <button
              onClick={fetchSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs font-bold hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-slate-500 font-medium py-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            Generating coaching feedback...
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-2 text-amber-700 text-sm font-medium bg-amber-50 border border-amber-100 p-4 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {summary && !loading && (
          <div className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
            {summary}
          </div>
        )}
      </div>
    </div>
  )
}
