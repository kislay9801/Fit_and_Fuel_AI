import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

/** Small ghost button that returns to the dashboard. */
export default function BackToDashboard({ className = '' }) {
  return (
    <Link
      to="/dashboard"
      className={`inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm flex-shrink-0 ${className}`}
    >
      <ChevronLeft className="w-4 h-4" />
      Dashboard
    </Link>
  )
}
