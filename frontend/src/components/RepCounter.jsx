import { Hash, Activity } from 'lucide-react'

export default function RepCounter({ count, phase, exercise }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
        <Hash className="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
          Reps Detected
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-extrabold text-slate-900 tabular-nums leading-none">
            {count}
          </span>
          <span className={`text-sm font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${
            phase === 'down' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-500 border border-slate-200'
          }`}>
            {phase === 'down' ? '↓ down' : '↑ up'}
          </span>
        </div>
      </div>
    </div>
  )
}
