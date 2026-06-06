import { useState } from 'react'
import { X, AlertTriangle, AlertOctagon } from 'lucide-react'

export default function RiskAlerts({ risks }) {
  const [dismissed, setDismissed] = useState(new Set())

  const activeRisks = risks.filter(r => !dismissed.has(r.id))

  if (activeRisks.length === 0) return null

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 max-w-[280px]">
      {activeRisks.map((risk) => {
        const isHigh = risk.severity === 'high'
        const colorClass = isHigh ? 'text-red-700' : 'text-amber-700'
        const bgClass = isHigh ? 'bg-red-50/95 border-red-200' : 'bg-amber-50/95 border-amber-200'

        return (
          <div
            key={risk.id}
            className={`flex items-start gap-3 p-3 rounded-xl border shadow-lg backdrop-blur-md toast-in ${bgClass}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isHigh
                ? <AlertOctagon className="w-5 h-5 text-red-600" />
                : <AlertTriangle className="w-5 h-5 text-amber-600" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-bold mb-0.5 ${colorClass}`}>
                {risk.label}
              </div>
              <div className="text-xs font-medium text-slate-600 leading-snug">
                {risk.injury}
              </div>
            </div>
            <button
              onClick={() => setDismissed(prev => new Set([...prev, risk.id]))}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
