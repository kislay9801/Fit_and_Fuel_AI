import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Play, Lock, Dumbbell, ShieldCheck, Activity } from 'lucide-react'

const exercises = [
  {
    id: 'squat',
    title: 'Standard Squat',
    tag: 'Strength',
    icon: Dumbbell,
    level: 'Intermediate',
    levelColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    desc: 'Precision analysis of posterior chain activation and knee tracking alignment for optimal power output.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuoCSo5dUlnnmjZxOhAQTTqZ5oy5sngpveXcZ6RU86FUmvaVMXvBijvZomM6_El-Nd8DiyunAfWGvTTnQtlwAHCTomC4z4eWI3uatC6Kw7cq8XRdWbMDlehL0nDUe3xs3flv_tLehACwFxJRekmV1x9N3w15VU_oEAEUjz-hFzOIe7DSu69XXfrqGMF2sDtZB8r0AhzBSLLgQ0lCggbsLv2n4QbptD7w0iF3zZrHTxQg5kc2_Si_XtsqEfFS1KkjkWm2xY-FVYhe4',
  },
  {
    id: 'pushup',
    title: 'Push-up',
    tag: 'Mobility',
    icon: Activity,
    level: 'Beginner',
    levelColor: 'text-blue-700 bg-blue-100 border-blue-200',
    desc: 'Scapular stability and core rigidity monitoring. Calibrated for medical-grade push-off symmetry.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDel65_SDbm4VytMUdhUFwhlSw5Kjwl34nuli9Iok5s2vifFBreAI4pctQiJIxwNdMitia60D-um8K_lWT9phnJkamhDT-Hq4VDtCCTZxMxWlqztNy8gsC6Ja3Hgg2dYV8VQldD89sEbQEdmsnqOBnoVc6wdZ9kkzmMy1rbS4yQXUNQg7hkWRECvLD6Vo453MGss5zFDmPyUoauancmzovP_L1ejRLG9OdPYUfipcokw8mUyKukplc15PlkMty4SZ0cxcelp8LIPNw',
  },
  {
    id: 'deadlift',
    title: 'Deadlift',
    tag: 'Strength',
    icon: Dumbbell,
    level: 'Advanced',
    levelColor: 'text-amber-700 bg-amber-100 border-amber-200',
    desc: 'Spinal neutrality and hip-hinge mechanics analysis for safe and powerful deadlift technique.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCELdcUuU5btONMTHLmUm9FlcdkqDRS7Yg5Ev3zmUGaQp8QKomOHeQL0QMS2JWgE3FcvCY9ZJH5nBB1y1vAQIKfcN-oZ9EZ0KgsoBsx-AzreX4AXRfsybLG5TOYxk67RZ66C3oyBnk0Bd3NWSfJu4DrwHMY-y3-5AeChP-7q_WzwrVozR2YaJTv9ICfLDPC_nXjYPYy7330ZSNvyU0NUGwLlHZniGQgh7LPGcu029xx-bqA29gHmooO5do3IwF1dLWF8xD097iGDoo',
  },
  {
    id: null,
    title: 'Forward Lunge',
    tag: 'Injury Prevention',
    icon: ShieldCheck,
    level: 'Advanced',
    levelColor: 'text-amber-700 bg-amber-100 border-amber-200',
    desc: 'Dynamic balance assessment and knee-over-toe depth monitoring for ACL injury mitigation.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb3Son-hBo3M8j4WtE5lJBLwzuhMhPELdpE9fB__FrngJFSLHJVdrPhQ6PqMOUlVTud8ui09pSirVKXzfAh7cAv0EEHd4z6JYnDHsBax3RA0fYhskNtojN6LT4kPyAuF4YwJgbJoaJB_jbs6RoSCnVW_OeoCDR-Ru3gDEGjjGl1iLaiMHEusK5l0Y6mj-jzWkVHb7RcK7dOvSlAFxywyj4AMKkXJ8L2RITu2qkwSRsi0_pPioDOM_jxIIjXUrXI4x0_AbzReNO1Mw',
  },
  {
    id: null,
    title: 'Forearm Plank',
    tag: 'Strength',
    icon: Dumbbell,
    level: 'Beginner',
    levelColor: 'text-blue-700 bg-blue-100 border-blue-200',
    desc: 'Real-time spine neutrality and pelvic tilt detection. Designed for maximum core endurance calibration.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC08ZtJEpZVdAzS3g5TZMFMnpsUeTEeLqTgPNiaBk7MAUwtIO2TDoAseGFG_J1N7gX0qfUW5_48yy-hG19wKeJrC98aVwHANPOLSTodT-cxnM2eG6KFdFj919MmbKDkqQXele0MKk_gluPa2aJSB87y2ih5tYzpPc-JxmGhHLV-vHOssgawKcotIpSlmCV-I0j6CGtPuHI7NQmeTVjdbBStfvZ607M8_Ny41JWdV5hZfI6G7gvss16VeZHCOWqEEM6kXz30NFqxi0I',
  },
]

export default function ExerciseSelect() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.title.toLowerCase().includes(search.toLowerCase()) || ex.desc.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'All' || ex.tag === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md h-20 w-full flex justify-between items-center px-8 border-b border-slate-200 shadow-sm">
        <h2 className="font-bold text-2xl text-slate-900 tracking-tight">Exercise Library</h2>
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* ── Main canvas ── */}
      <main className="min-h-[calc(100vh-80px)] p-8">
        {/* Search + Filters */}
        <section className="max-w-7xl mx-auto mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-full lg:max-w-xl">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Search Exercises</label>
              <div className="relative">
                <input
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-sm text-slate-900 placeholder-slate-400"
                  placeholder="Type to search library..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Strength', 'Mobility', 'Injury Prevention'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors ${
                    activeFilter === f
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Exercise cards grid */}
        <section className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((ex, i) => (
              <div
                key={`${ex.id ?? ex.title}-${i}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img
                    alt={ex.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={ex.img}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-white shadow-sm flex items-center gap-1.5">
                      <ex.icon className="w-3 h-3" />
                      {ex.tag}
                    </span>
                  </div>
                  {ex.id === null && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center transition-opacity">
                      <Lock className="w-8 h-8 mb-3 text-slate-300" />
                      <span className="font-bold tracking-tight">Pro Module</span>
                      <span className="text-xs text-slate-200 mt-1">Upgrade to unlock this exercise</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight">{ex.title}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${ex.levelColor}`}>
                      {ex.level}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                    {ex.desc}
                  </p>
                  <button
                    disabled={ex.id === null}
                    onClick={() => navigate(`/session/${ex.id}`)}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      ex.id === null
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]'
                    }`}
                  >
                    {ex.id === null ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Locked
                      </>
                    ) : (
                      <>
                        Start Analysis
                        <Play className="w-4 h-4 fill-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="font-bold text-xl text-slate-900 mb-2">No exercises found</p>
              <p className="text-slate-500 text-sm">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}