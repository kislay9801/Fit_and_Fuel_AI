import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserSessions } from '../firebase/firestore'
import { Search, Filter, BarChart2, CalendarDays, Clock, ChevronDown, Activity, MessageSquare } from 'lucide-react'
import AICoachChat from '../components/AICoachChat'
import BackToDashboard from '../components/BackToDashboard'
import { getIssueInfo } from '../utils/issueInfo'

const exerciseEmoji = { squat: '🏋️', pushup: '💪', deadlift: '🔥' }

function scoreBadge(score) {
  if (score >= 90) return { label: 'Optimal',   cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
  if (score >= 75) return { label: 'Stable',    cls: 'bg-blue-100 text-blue-800 border-blue-200' }
  if (score >= 55) return { label: 'Deviation', cls: 'bg-amber-100 text-amber-800 border-amber-200' }
  return               { label: 'High Risk',    cls: 'bg-red-100 text-red-800 border-red-200'      }
}

function scoreColor(score) {
  if (score >= 90) return 'text-emerald-600'
  if (score >= 75) return 'text-blue-600'
  if (score >= 55) return 'text-amber-600'
  return 'text-red-600'
}

function formatDate(d) {
  if (!d) return { date: '—', time: '—' }
  const date = d instanceof Date ? d : d.toDate?.() ?? new Date(d)
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function History({ user }) {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  // Filters
  const [filterExercise, setFilterExercise] = useState('all')
  const [filterScore,    setFilterScore]    = useState('all')
  const [search,         setSearch]         = useState('')
  const [isChatOpen,     setIsChatOpen]     = useState(false)

  useEffect(() => {
    if (!user?.uid) return
    let cancelled = false

    async function load() {
      const { sessions: s, error: e } = await getUserSessions(user.uid, 100)
      if (!cancelled) {
        setSessions(s)
        setError(e)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.uid])

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const score = s.score ?? s.form_score ?? 0
      if (filterExercise !== 'all' && s.exercise !== filterExercise) return false
      if (filterScore === 'optimal'   && score < 90)              return false
      if (filterScore === 'stable'    && (score < 75 || score >= 90)) return false
      if (filterScore === 'deviation' && score >= 75)             return false
      if (search && !s.exercise?.includes(search.toLowerCase()))  return false
      return true
    })
  }, [sessions, filterExercise, filterScore, search])

  // Summary stats
  const totalSessions = sessions.length
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + (s.score ?? s.form_score ?? 0), 0) / sessions.length)
    : 0

  // Sparkline data from last 10 sessions
  const sparklineScores = sessions.slice(0, 10).reverse()

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen pb-24 md:pb-8">

      {/* ── Top App Bar ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md h-20 w-full flex justify-between items-center px-4 sm:px-8 border-b border-slate-200 shadow-sm gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <BackToDashboard />
          <span className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight truncate">History</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-slate-100 rounded-lg px-3 py-2 items-center gap-2 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              className="bg-transparent border-none outline-none text-sm w-48 text-slate-900 placeholder-slate-400"
              placeholder="Search sessions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ── AI Coach Floating Window ── */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AICoachChat sessions={sessions} onClose={() => setIsChatOpen(false)} />
        </div>
      )}

      {/* ── Page content ── */}
      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* ── Stats + Sparkline ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stats */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Sessions</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {loading ? '—' : totalSessions}
                </span>
                {!loading && totalSessions > 0 && (
                  <span className="text-emerald-600 font-semibold text-xs ml-1">+recent</span>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Form Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-blue-600">
                  {loading ? '—' : avgScore}
                </span>
                <span className="text-slate-400 font-medium text-sm">/100</span>
              </div>
            </div>
          </div>

          {/* Sparkline trend */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="flex-1 w-full relative z-10">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">Form Precision Trend</h3>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask AI Coach
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-6">Performance across last {sparklineScores.length || 10} sessions</p>
              <div className="flex items-end gap-1.5 h-24">
                {(sparklineScores.length > 0 ? sparklineScores : Array(10).fill(null)).map((s, i) => {
                  const pct = s ? Math.round(((s.score ?? s.form_score ?? 0) / 100) * 100) : (40 + i * 5)
                  const isLast = i === (sparklineScores.length || 10) - 1
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md hover:opacity-80 cursor-pointer transition-colors duration-300"
                      style={{
                        height: `${pct}%`,
                        background: isLast ? '#2563EB' : '#DBEAFE', // blue-600 : blue-100
                        minWidth: '12px',
                      }}
                      title={s ? `Score: ${s.score ?? s.form_score}` : ''}
                    />
                  )
                })}
              </div>
            </div>
            <div className="hidden md:block w-px h-full bg-slate-200" />
            <div className="flex flex-col gap-3 min-w-[140px]">
              {[
                { dot: 'bg-emerald-400', label: '90+ Optimal'  },
                { dot: 'bg-blue-200',    label: '75-89 Stable' },
                { dot: 'bg-amber-200',   label: '<75 Deviation' },
              ].map(({ dot, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${dot}`} />
                  <span className="text-sm font-medium text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <section className="bg-slate-100 p-4 rounded-xl flex flex-wrap gap-4 items-center border border-slate-200 shadow-inner">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 cursor-pointer w-32"
              value={filterExercise}
              onChange={e => setFilterExercise(e.target.value)}
            >
              <option value="all">All Exercises</option>
              <option value="squat">Squat</option>
              <option value="pushup">Push-up</option>
              <option value="deadlift">Deadlift</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            <BarChart2 className="w-4 h-4 text-slate-400" />
            <select
              className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 cursor-pointer w-32"
              value={filterScore}
              onChange={e => setFilterScore(e.target.value)}
            >
              <option value="all">All Scores</option>
              <option value="optimal">Optimal (90+)</option>
              <option value="stable">Stable (75-89)</option>
              <option value="deviation">Deviation (&lt;75)</option>
            </select>
          </div>
          <div className="flex-1" />
        </section>

        {/* ── Session list ── */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium flex items-center gap-2 shadow-sm">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Loading your sessions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="text-6xl mb-6">{sessions.length === 0 ? '🏋️' : '🔍'}</div>
            <p className="font-bold text-xl text-slate-900 mb-2">
              {sessions.length === 0 ? 'No sessions yet' : 'No sessions match your filters'}
            </p>
            <p className="text-slate-500">
              {sessions.length === 0
                ? 'Complete a workout and your history will appear here.'
                : 'Try changing or clearing your filters.'}
            </p>
            {sessions.length === 0 && (
              <button
                onClick={() => navigate('/exercises')}
                className="mt-8 bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
              >
                Start Training
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((s) => {
              const score = s.score ?? s.form_score ?? 0
              const badge = scoreBadge(score)
              const { date, time } = formatDate(s.createdAt)
              return (
                <div
                  key={s.id}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Exercise icon + name */}
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-3xl shadow-sm">
                        {exerciseEmoji[s.exercise] || '💪'}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 capitalize tracking-tight mb-1">
                          {s.exercise}
                        </h4>
                        <div className="flex items-center gap-5 text-sm font-medium text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4 text-slate-400" />
                            {date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-8 md:gap-12 flex-shrink-0">
                      {/* Score */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Form Score</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-3xl ${scoreColor(score)}`}>{score}</span>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Reps */}
                      {(s.reps != null && s.reps > 0) && (
                        <div className="hidden sm:flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reps</span>
                          <span className="font-extrabold text-2xl text-slate-900">{s.reps}</span>
                        </div>
                      )}

                      {/* AI Coaching snippet */}
                      {s.coachingSummary && (
                        <div className="hidden lg:block max-w-xs border-l border-slate-200 pl-8">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            AI Coach
                          </span>
                          <p className="text-sm font-medium italic text-slate-700 leading-snug line-clamp-2">
                            "{s.coachingSummary.split('\n\n')[0]}"
                          </p>
                        </div>
                      )}

                      {/* Risk flags */}
                      {s.issues?.length > 0 && (
                        <div className="hidden xl:flex flex-col gap-2 min-w-[120px]">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Issues detected</span>
                          <div className="flex flex-wrap gap-1.5">
                            {s.issues.slice(0, 2).map(issue => {
                              const info = getIssueInfo(issue)
                              return (
                                <span
                                  key={issue}
                                  title={info.detail}
                                  className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-bold uppercase tracking-wide cursor-help"
                                >
                                  {info.label}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Load more */}
            {filtered.length >= 10 && (
              <div className="flex justify-center py-8">
                <button className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-300 rounded-full text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm">
                  <ChevronDown className="w-4 h-4" />
                  Load More Sessions
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}