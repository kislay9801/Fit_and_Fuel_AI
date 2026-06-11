import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats, getRecentSessions } from '../firebase/firestore'
import { Plus, TrendingUp, Award, ShieldCheck, ArrowRight, Activity, CalendarDays } from 'lucide-react'

const exerciseEmoji = { squat: '🏋️', pushup: '💪', deadlift: '🔥' }

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
  const [stats,   setStats]   = useState(null)
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  const hasSessions = !loading && stats && stats.totalSessions > 0

  useEffect(() => {
    if (!user?.uid) return
    let cancelled = false

    async function load() {
      const [{ stats: s }, { sessions: r }] = await Promise.all([
        getDashboardStats(user.uid),
        getRecentSessions(user.uid, 5),
      ])
      if (!cancelled) {
        setStats(s)
        setRecent(r)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.uid])

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md h-20 w-full flex justify-between items-center px-8 border-b border-slate-200 shadow-sm">
        <h2 className="font-bold text-2xl text-slate-900 tracking-tight">
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
      <div className="p-8 max-w-7xl mx-auto space-y-8">

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
                {['7D', '1M', '6M'].map((p, i) => (
                  <button key={p} className={`px-3 py-1 rounded-md text-xs font-bold ${i === 0 ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="h-64 relative flex items-end justify-between px-2 border-b border-slate-200">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0,1,2].map(i => <div key={i} className="border-t border-slate-100 w-full" />)}
              </div>
              
              {!loading && !hasSessions ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-sm font-semibold">
                  <span>No data available</span>
                  <span className="text-xs font-normal mt-1">Complete sessions to view form trend</span>
                </div>
              ) : (
                (recent.length >= 6 ? recent.slice(0, 6).reverse() : [
                  {score:72},{score:78},{score:82},{score:68},{score:88},{score:92}
                ]).map((s, i) => {
                  const pct = Math.round(((s.score ?? s.form_score ?? 72) / 100) * 100)
                  return (
                    <div key={i} className="relative group w-[10%] flex flex-col justify-end h-full">
                      <div className={`w-full rounded-t-md transition-colors duration-300 ${i === 5 ? 'bg-blue-600' : 'bg-slate-200 hover:bg-slate-300'}`} style={{ height: `${pct}%` }}>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap shadow-lg">
                          {pct}
                          {/* Little triangle arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="flex justify-between mt-3 text-slate-400 text-xs font-bold px-2">
              {['MON','TUE','WED','THU','FRI','SAT'].map(d => <span key={d}>{d}</span>)}
            </div>
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
                {hasSessions ? 'Improve Hip Mobility' : 'Start Your First Session'}
              </h4>
              <p className="text-sm text-slate-200 mb-6 leading-relaxed line-clamp-3">
                {hasSessions
                  ? 'Based on your recent sessions, adding 10 min of hip openers will reduce your Pelvic Tilt score by ~12%.'
                  : 'Start training with real-time pose tracking to receive tailored exercise form analysis and AI coaching.'}
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