import { useState } from 'react'
import { Dumbbell, Video, Camera, ChevronRight, PlayCircle } from 'lucide-react'
import Modal from '../../components/Modal'
import { EXERCISE_CATEGORIES, CATALOG_EXERCISES } from '../../data/exercisesCatalog'

const CATEGORY_STYLE = {
  'Injury Prevention': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Injury Recovery': 'bg-blue-50 text-blue-700 border-blue-200',
  'Plyometrics': 'bg-purple-50 text-purple-700 border-purple-200',
  'Resistance Training': 'bg-amber-50 text-amber-700 border-amber-200',
}

export default function ExercisesCatalog() {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null)

  const filtered = filter === 'All'
    ? CATALOG_EXERCISES
    : CATALOG_EXERCISES.filter(ex => ex.categories.includes(filter))

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 pt-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-8 sm:p-10 shadow-md">
        <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-4">
          <Dumbbell className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Exercise Library</h1>
        <p className="text-blue-50 max-w-2xl leading-relaxed">
          Prevention, recovery, plyometric, and strength exercises — each with the angle to film or watch
          from, and demo videos. Tap an exercise for details.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['All', ...EXERCISE_CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors border ${
              filter === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Exercise cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ex => (
          <button
            key={ex.name}
            onClick={() => setOpen(ex)}
            className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col"
          >
            <h3 className="font-bold text-slate-900 tracking-tight mb-2 leading-snug">{ex.name}</h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3">
              <Camera className="w-3.5 h-3.5" />
              {ex.angle}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {ex.categories.map(c => (
                <span key={c} className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${CATEGORY_STYLE[c] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{c}</span>
              ))}
            </div>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-auto">
              <Video className="w-3.5 h-3.5" /> {ex.videos.length} demo{ex.videos.length > 1 ? 's' : ''}
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {open && (
        <Modal title={open.name} accent="text-slate-900" onClose={() => setOpen(null)}>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {open.categories.map(c => (
                <span key={c} className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${CATEGORY_STYLE[c] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{c}</span>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-slate-500" /> Recommended angle
              </h4>
              <p className="text-sm text-slate-700">{open.angle}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-blue-500" /> Demo videos
              </h4>
              <div className="flex flex-col gap-2">
                {open.videos.map((vid, i) => (
                  vid.url ? (
                    <a
                      key={i}
                      href={vid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors"
                    >
                      <PlayCircle className="w-5 h-5" /> {vid.label}
                    </a>
                  ) : (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-400 font-bold text-sm"
                    >
                      <PlayCircle className="w-5 h-5" /> {vid.label} · video coming soon
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
