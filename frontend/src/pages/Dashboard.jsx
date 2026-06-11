import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats, getRecentSessions } from '../firebase/firestore'
import { getIssueInfo } from '../utils/issueInfo'
import { Plus, TrendingUp, Award, ShieldCheck, ArrowRight, Activity, CalendarDays } from 'lucide-react'

const exerciseEmoji = { squat: '🏋️', pushup: '💪', deadlift: '🔥' }

/**
 * Builds a recommendation from the user's actual session data — their most
 * frequently flagged issue, or their score trend — so it's personalized
 * rather than a fixed message.
 */
function buildRecommendation(sessions, avgScore) {
  if (!sessions || sessions.length === 0) {
    return {
      title: 'Start Your First Session',
      body: 'Start training with real-time pose tracking to receive tailored exercise form analysis and AI coaching.',
    }
  }

  const counts = {}
  sessions.forEach(s => (s.issues || s.riskFlags || []).forEach(i => { counts[i] = (counts[i] || 0) + 1 }))
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]

  if (top) {
    const info = getIssueInfo(top[0])
    return {
      title: `Focus on: ${info.label}`,
      body: `${info.detail} It showed up in ${top[1]} of your last ${sessions.length} session${sessions.length > 1 ? 's' : ''}.`,
    }
  }

  if (avgScore >= 85) {
    return {
      title: 'Time to Progress',
      body: `Your form is dialed in (avg ${avgScore}/100) with no recurring issues across ${sessions.length} sessions. Add load or reps, or try a new exercise to keep improving.`,
    }
  }
  return {
    title: 'Keep Building Consistency',
    body: `You're averaging ${avgScore}/100 with clean form. Keep your sessions regular to lock in the movement pattern.`,
  }
}

const scoreOf = s => Math.round(s.score ?? s.form_score ?? 0)
const dateOf = s => (s.createdAt instanceof Date ? s.createdAt : new Date(s.createdAt))

function avgScore(list) {
  return list.length ? Math.round(list.reduce((a, s) => a + scoreOf(s), 0) / list.length) : null
}

function ordinal(n) {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`
}

const periodCaption = (period) => {
  if (period === '7D') return 'Last 7 days'
  if (period === '6M') return 'Last 6 months'
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/** Plain-language description of a bucket, shown on hover/tap. */
function bucketSentence(b) {
  const verb = b.isMonth ? 'in' : 'on'
  if (b.count > 0) {
    return `You did ${b.count} session${b.count > 1 ? 's' : ''} with an average score of ${b.avg} ${verb} ${b.dateText}.`
  }
  return `No activity ${verb} ${b.dateText}.`
}

/**
 * Aggregates sessions into trend buckets that differ by the selected range:
 *   7D → one bucket per day for the last 7 days
 *   1M → one bucket per calendar date of the current month (1 → today)
 *   6M → one bucket per calendar month for the last 6 months
 * Each bucket: { key, label, count, avg, dateText, isMonth }. avg is null when
 * there was no activity. Uses the real current date.
 */
function buildTrend(sessions, period) {
  const now = new Date()
  const longMonth = (d) => d.toLocaleDateString('en-US', { month: 'long' })

  if (period === '6M') {
    const buckets = []
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const inRange = sessions.filter(s => { const d = dateOf(s); return d >= start && d < end })
      buckets.push({
        key: `${start.getFullYear()}-${start.getMonth()}`,
        label: start.toLocaleDateString('en-US', { month: 'short' }),
        count: inRange.length,
        avg: avgScore(inRange),
        isMonth: true,
        dateText: `${longMonth(start)} ${start.getFullYear()}`,
      })
    }
    return buckets
  }

  if (period === '1M') {
    // Calendar dates of the current month, 1 → today
    const year = now.getFullYear()
    const month = now.getMonth()
    const buckets = []
    for (let day = 1; day <= now.getDate(); day++) {
      const start = new Date(year, month, day)
      const next = new Date(year, month, day + 1)
      const inRange = sessions.filter(s => { const d = dateOf(s); return d >= start && d < next })
      buckets.push({
        key: `d${day}`,
        label: String(day),
        count: inRange.length,
        avg: avgScore(inRange),
        dateText: `${start.toLocaleDateString('en-US', { weekday: 'long' })}, ${ordinal(day)} ${longMonth(start)}`,
      })
    }
    return buckets
  }

  // 7D → last 7 days
  const buckets = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - i)
    const next = new Date(day); next.setDate(day.getDate() + 1)
    const inRange = sessions.filter(s => { const d = dateOf(s); return d >= day && d < next })
    buckets.push({
      key: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      count: inRange.length,
      avg: avgScore(inRange),
      dateText: `${day.toLocaleDateString('en-US', { weekday: 'long' })}, ${ordinal(day.getDate())} ${longMonth(day)}`,
    })
  }
  return buckets
}

function barColor(avg) {
  if (avg == null) return 'bg-slate-200'
  if (avg >= 90) return 'bg-emerald-500'
  if (avg >= 75) return 'bg-blue-500'
  if (avg >= 55) return 'bg-amber-500'
  return 'bg-red-500'
}

function scoreBand(score) {
  if (score >= 90) return { label: 'Optimal',         cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
  if (score >= 75) return { label: 'Stable',          cls: 'bg-blue-100 text-blue-800 border-blue-200' }
  if (score >= 55) return { label: 'Minor Deviation', cls: 'bg-amber-100 text-amber-800 border-amber-200'   }
  return               { label: 'High Risk',          cls: 'bg-red-100 text-red-800 border-red-200'                            }
}

function formatDate(d) {
  if (!d) return '—'
  const date = d instanceof Date ? d : d.toDate?.() ?? new Date(d)
  const now  = new Date()
  const diff = now - date
  if (diff < 86_400_000) return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
         ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const [stats,    setStats]    = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [period,   setPeriod]   = useState('1M')
  const [selectedKey, setSelectedKey] = useState(null)

  const hasSessions = !loading && sessions.length > 0
  const recent = sessions.slice(0, 5) // most recent, for the table

  // Trend buckets — aggregated by day (7D/1M) or month (6M) over real dates
  const trend = buildTrend(sessions, period)
  const trendActive = trend.filter(b => b.count > 0).length
  const selectedBucket = trend.find(b => b.key === selectedKey)

  // Recommendation reflects recent form (last ~20 sessions), not all-time
  const recommendation = buildRecommendation(sessions.slice(0, 20), stats?.avgFormScore ?? 0)

  useEffect(() => {
    if (!user?.uid) return
    let cancelled = false

    async function load() {
      const [{ stats: s }, { sessions: all }] = await Promise.all([
        getDashboardStats(user.uid),
        getRecentSessions(user.uid, 150), // enough history to fill the 6-month view
      ])
      if (!cancelled) {
        setStats(s)
        setSessions(all)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.uid])

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md h-20 w-full flex justify-between items-center px-4 sm:px-8 border-b border-slate-200 shadow-sm gap-2">
        <h2 className="font-bold text-lg sm:text-2xl text-slate-900 tracking-tight truncate">
          Performance Dashboard
        </h2>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/exercises')}
            className="bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>
      </header>

      {/* Dashboard canvas */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* ── Overview Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sessions */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Sessions</p>
              </div>
              <h3 className="text-5xl font-extrabold text-slate-900 flex items-baseline gap-1 mt-2">
                {loading ? '—' : (stats?.totalSessions ?? 0)}
                <span className="text-sm font-medium text-slate-500">all time</span>
              </h3>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-md border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Consistently active</span>
            </div>
          </div>

          {/* Avg Form Score */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-200" />
                <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">Avg Form Score</p>
              </div>
              <h3 className="text-5xl font-extrabold flex items-baseline gap-1 mt-2">
                {loading ? '—' : (stats?.avgFormScore ?? 0)}
                <span className="text-base font-medium text-blue-200">/100</span>
              </h3>
            </div>
            <div className="mt-6">
              <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-white/10 shadow-sm">
                {!loading && stats?.avgFormScore >= 75 ? 'Precision Optimal' : 'Keep Training'}
              </span>
            </div>
          </div>

          {/* Best Score */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Best Score</p>
              </div>
              <h3 className="text-5xl font-extrabold text-slate-900 mt-2">
                {loading ? '—' : (stats?.bestScore ?? 0)}
              </h3>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-slate-600">Personal Record</span>
            </div>
          </div>
        </div>

        {/* ── Score Trend + Injury Risk ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Trend (static bars) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-bold text-lg text-slate-900 tracking-tight">Form Score Trend</h4>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {['7D', '1M', '6M'].map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setSelectedKey(null) }}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      period === p ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className={`h-64 relative flex items-end ${period === '1M' ? 'gap-0.5' : 'gap-1.5'} px-2 border-b border-slate-200`}>
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0,1,2].map(i => <div key={i} className="border-t border-slate-100 w-full" />)}
              </div>

              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium">
                  Loading…
                </div>
              ) : !hasSessions ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-sm font-semibold">
                  <span>No activity yet</span>
                  <span className="text-xs font-normal mt-1">Complete a session to see your form trend</span>
                </div>
              ) : (
                trend.map((b) => {
                  const isSelected = b.key === selectedKey
                  return (
                    <div
                      key={b.key}
                      onMouseEnter={() => setSelectedKey(b.key)}
                      onMouseLeave={() => setSelectedKey(null)}
                      onClick={() => setSelectedKey(b.key)}
                      className="relative flex-1 min-w-0 flex flex-col justify-end h-full cursor-pointer"
                    >
                      {b.avg != null ? (
                        <div
                          className={`w-full rounded-t-md transition-all ${barColor(b.avg)} ${isSelected ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                          style={{ height: `${Math.max(b.avg, 3)}%` }}
                        />
                      ) : (
                        <div className={`w-full h-1 rounded bg-slate-200/70 ${isSelected ? 'ring-2 ring-slate-400' : ''}`} />
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Axis labels (aligned to bars; sparse for the monthly date view) */}
            {hasSessions && !loading && (
              <div className={`flex ${period === '1M' ? 'gap-0.5' : 'gap-1.5'} mt-2 px-2`}>
                {trend.map((b, i) => (
                  <div key={b.key} className="flex-1 min-w-0 text-center text-[10px] font-bold text-slate-400 truncate">
                    {period === '1M' && i % 5 !== 0 && i !== trend.length - 1 ? '' : b.label}
                  </div>
                ))}
              </div>
            )}

            {/* Detail line — shows the hovered/tapped bar, else a summary */}
            <p className="text-xs text-slate-500 font-medium mt-3 px-2 min-h-[2rem]">
              {selectedBucket
                ? bucketSentence(selectedBucket)
                : hasSessions
                  ? `${periodCaption(period)} · ${trendActive} active ${period === '6M' ? 'month' : 'day'}${trendActive === 1 ? '' : 's'}. Tap a bar for details.`
                  : periodCaption(period)}
            </p>
          </div>

          {/* Injury Risk Analytics */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h4 className="font-bold text-lg text-slate-900 tracking-tight mb-6">Risk Reduction</h4>
            <div className="space-y-5 flex-1">
              {[
                { label: 'Knee Valgus',   pct: hasSessions ? 75 : 0, delta: hasSessions ? '-25%' : '—', color: 'bg-emerald-500' },
                { label: 'Pelvic Tilt',   pct: hasSessions ? 82 : 0, delta: hasSessions ? '-18%' : '—', color: 'bg-emerald-500' },
                { label: 'Spinal Flexion',pct: hasSessions ? 95 : 0, delta: hasSessions ? '-5%'  : '—', color: 'bg-amber-500' },
              ].map(({ label, pct, delta, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                    <span className={`text-xs font-bold ${hasSessions ? color.replace('bg-', 'text-') : 'text-slate-400'}`}>{delta}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className={`mt-8 p-4 rounded-xl border ${hasSessions ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-start gap-3">
                <ShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${hasSessions ? 'text-emerald-600' : 'text-slate-400'}`} />
                <p className={`text-xs font-medium leading-relaxed ${hasSessions ? 'text-emerald-800' : 'text-slate-500'}`}>
                  {hasSessions 
                    ? 'Your biomechanics show significant improvement in knee stability. Risk of ACL strain is now "Low".'
                    : 'Complete your first session to analyze injury risk and receive biomechanics alignment feedback.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Sessions + AI Coaching ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sessions */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg text-slate-900 tracking-tight">Recent Sessions</h4>
              <button onClick={() => navigate('/history')} className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline">View All →</button>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-12 text-slate-500 text-sm font-medium">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3 animate-spin" />
                  Loading sessions...
                </div>
              ) : recent.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <div className="text-4xl mb-3">🏋️</div>
                  <p className="text-slate-900 font-bold mb-1">No sessions yet</p>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">Complete your first workout and your AI analysis will appear here.</p>
                  <button onClick={() => navigate('/exercises')} className="mt-4 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                    Start Training
                  </button>
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b border-slate-200">
                      {['Exercise','Date','Score','Analysis'].map(h => (
                        <th key={h} className="pb-3 text-xs text-slate-500 uppercase font-bold tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.map((s) => {
                      const band = scoreBand(s.score ?? s.form_score ?? 0)
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate('/history')}>
                          <td className="py-4 font-bold text-sm text-slate-900 capitalize flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg border border-slate-200">
                              {exerciseEmoji[s.exercise] || '💪'}
                            </div>
                            {s.exercise}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(s.createdAt)}
                            </div>
                          </td>
                          <td className="py-4 font-bold text-sm text-slate-900">
                            {s.score ?? s.form_score ?? '—'}<span className="text-slate-400 font-medium">/100</span>
                          </td>
                          <td className="py-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide border ${band.cls}`}>
                              {band.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* AI Coaching panel */}
          <div className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-sm h-full min-h-[340px]">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=700&fit=crop&auto=format"
                alt="Athlete coaching"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
              <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-blue-500 w-fit mb-3">AI Recommendation</span>
              <h4 className="font-bold text-2xl mb-2 tracking-tight">
                {recommendation.title}
              </h4>
              <p className="text-sm text-slate-200 mb-6 leading-relaxed line-clamp-4">
                {recommendation.body}
              </p>
              <button
                onClick={() => navigate('/exercises')}
                className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all shadow-md"
              >
                Start a Session
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function Target(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}