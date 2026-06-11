import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Play, Lock, Dumbbell, ShieldCheck, Activity } from 'lucide-react'

const exercises = [
  {
    id: 'squat',
    title: 'Standard Squat',
    tag: 'Strength',
    icon: Dumbbell,
    level: 'Intermediate',
    levelColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    desc: 'Precision analysis of posterior chain activation and knee tracking alignment for optimal power output.',
    img: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2019/02/1109-Barbell-Back-Squat-GettyImages-614107160.jpg?quality=86&strip=all',
  },
  {
    id: 'pushup',
    title: 'Push-up',
    tag: 'Mobility',
    icon: Activity,
    level: 'Beginner',
    levelColor: 'text-blue-700 bg-blue-100 border-blue-200',
    desc: 'Scapular stability and core rigidity monitoring. Calibrated for medical-grade push-off symmetry.',
    img: 'https://experiencelife.lifetime.life/wp-content/uploads/2007/04/apr07-pushup.jpg',
  },
  {
    id: 'deadlift',
    title: 'Deadlift',
    tag: 'Strength',
    icon: Dumbbell,
    level: 'Advanced',
    levelColor: 'text-amber-700 bg-amber-100 border-amber-200',
    desc: 'Spinal neutrality and hip-hinge mechanics analysis for safe and powerful deadlift technique.',
    img: 'https://cdn.muscleandstrength.com/sites/default/files/deadlift_0.jpg',
  },
  {
    id: 'lunge',
    title: 'Forward Lunge',
    tag: 'Injury Prevention',
    icon: ShieldCheck,
    level: 'Intermediate',
    levelColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    desc: 'Dynamic balance assessment and front-knee depth monitoring. Independently tracks front vs rear leg for accurate ACL risk scoring.',
    img: 'https://assets.clevelandclinic.org/transform/LargeFeatureImage/282b2789-82f6-4759-b42e-a441348f7cb8/lunge-1322900654',
  },
  {
    id: 'plank',
    title: 'Forearm Plank',
    tag: 'Strength',
    icon: Dumbbell,
    level: 'Beginner',
    levelColor: 'text-blue-700 bg-blue-100 border-blue-200',
    desc: 'Real-time spine neutrality, hip sag/pike detection, and head alignment tracking for maximum core endurance calibration.',
    img: 'https://blog.nasm.org/hubfs/how-to-perform-standard-plank.jpg',
  },
  {
    id: 'jumpLanding',
    title: 'Jump Landing Check',
    tag: 'Injury Prevention',
    icon: ShieldCheck,
    level: 'Intermediate',
    levelColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    desc: 'Bilateral knee absorption depth, landing symmetry, and valgus collapse detection. Essential for ACL injury screening.',
    img: 'https://figures.semanticscholar.org/bccfee2edd966187f47e8423570c61c05548fc21/1-Figure1-1.png',
  },
  {
    id: 'highKnees',
    title: 'High Knees',
    tag: 'Cardio',
    icon: Activity,
    level: 'Beginner',
    levelColor: 'text-blue-700 bg-blue-100 border-blue-200',
    desc: 'Hip-flexion angle and knee lift height tracking. Measures how high each knee rises relative to hip level with posture scoring.',
    img: 'https://www.focusfitness.net/stock-photos/wp-content/uploads/edd/2017/07/Fit-man-doing-high-knees-cardio-exercise.jpg',
  },
  {
    id: 'sumoSquat',
    title: 'Sumo Squat to Stand',
    tag: 'Mobility',
    icon: Activity,
    level: 'Intermediate',
    levelColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    desc: 'Stance width ratio, bilateral knee depth, and outward knee-tracking analysis for hip mobility and groin flexibility assessment.',
    img: 'https://imagely.mirafit.co.uk/wp/wp-content/uploads/2024/02/sumo-squat-with-Mirafit-Rubber-Dumbbell-1024x682.jpg',
  },
  {
    id: 'buttKicks',
    title: 'Butt Kicks',
    tag: 'Cardio',
    icon: Activity,
    level: 'Beginner',
    levelColor: 'text-blue-700 bg-blue-100 border-blue-200',
    desc: 'Knee-flexion depth monitoring to ensure the heel reaches glute height. Tracks posture and range of motion for warm-up quality.',
    img: 'https://spotebi.com/wp-content/uploads/2015/01/butt-kicks-exercise-illustration.jpg',
  },
  {
    id: 'pogoJump',
    title: 'Pogo Jumps',
    tag: 'Cardio',
    icon: Activity,
    level: 'Intermediate',
    levelColor: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    desc: 'Leg stiffness monitoring for ankle-driven propulsion. Penalises excess knee bend to ensure true elastic rebound mechanics.',
    img: 'https://i.ytimg.com/vi/zKqcL6HSTE4/maxresdefault.jpg',
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
              {['All', 'Strength', 'Mobility', 'Cardio', 'Injury Prevention'].map(f => (
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