import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Centered modal (bottom-sheet on mobile) with an X close button.
 * - Locks background scroll while open, so the page behind never moves.
 * - `overscroll-contain` stops touch scroll from "leaking" to the page.
 * - Closes on backdrop click, the X, or the Escape key.
 */
export default function Modal({ title, subtitle, accent = 'text-blue-600', onClose, children }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // lock background scroll
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Grab handle (mobile bottom-sheet affordance) */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center flex-shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-3 sm:pt-6 pb-4 sm:pb-5 border-b border-slate-100 flex-shrink-0">
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

        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain flex-1">{children}</div>
      </div>
    </div>
  )
}
