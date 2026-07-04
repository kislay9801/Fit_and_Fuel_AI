import { X } from 'lucide-react'

/**
 * Centered modal with an X close button. Closes on backdrop click or X.
 * Used by the Services detail cards (Nutrition, Injuries, Exercises).
 */
export default function Modal({ title, subtitle, accent = 'text-blue-600', onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-slate-100">
          <div className="min-w-0">
            <h3 className={`text-xl font-extrabold tracking-tight ${accent}`}>{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
