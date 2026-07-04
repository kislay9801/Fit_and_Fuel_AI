import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, HeartPulse, Dumbbell, ChevronRight, Activity } from 'lucide-react'
import Modal from '../../components/Modal'
import { INJURIES } from '../../data/injuries'

export default function Injuries() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(null) // injury object

  return (
    <div className="max-w-5xl mx-auto space-y-10 px-4 sm:px-6 pt-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-600 to-red-500 text-white p-8 sm:p-10 shadow-md">
        <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-4">
          <HeartPulse className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Injuries & Recovery</h1>
        <p className="text-red-50 max-w-2xl leading-relaxed">
          A plain-language guide to common athletic injuries — what they are, how recovery usually works,
          and the exercises that help prevent and rehab them. Tap an injury to learn more.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>This is general educational information, not medical advice. For a suspected injury, see a qualified medical professional before returning to training.</p>
      </div>

      {/* Injury cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INJURIES.map(inj => (
          <button
            key={inj.key}
            onClick={() => setOpen(inj)}
            className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl">{inj.emoji}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md">{inj.area}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight mb-1">{inj.name}</h3>
            <p className="text-sm text-slate-500 leading-snug line-clamp-2 mb-3">{inj.description}</p>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              View details
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {open && (
        <Modal
          title={`${open.emoji} ${open.name}`}
          subtitle={open.area}
          accent="text-slate-900"
          onClose={() => setOpen(null)}
        >
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">What it is</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{open.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" /> Recovery
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{open.recovery}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-blue-500" /> Prevention & Recovery Exercises
              </h4>
              {open.exercises.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {open.exercises.map(ex => (
                      <span key={ex} className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">{ex}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => { setOpen(null); navigate('/services/exercises') }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Activity className="w-4 h-4" /> See demos in the Exercise Library →
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-500 italic">Recommended exercises coming soon.</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
