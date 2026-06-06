import { MessageSquare, ChevronRight, Activity } from 'lucide-react'

export default function FeedbackPanel({ feedback, isVisible }) {
  if (!isVisible) return null

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 min-h-[220px] shadow-sm slide-in-right">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Live Coaching</span>
        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {feedback && feedback.length > 0 ? (
        <div className="flex flex-col gap-2 flex-1">
          {feedback.map((msg, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl fade-in"
            >
              <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700 leading-relaxed">{msg}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Activity className="w-8 h-8 text-slate-300" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-600 mb-0.5">Waiting for detection</p>
            <p className="text-xs text-slate-400">Stand in front of the camera</p>
          </div>
        </div>
      )}
    </div>
  )
}
