import { useMemo } from 'react'
import { getScoreBand } from '../utils/formScoring'

export default function ScoreRing({ score, size = 160 }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const progress = score / 100
  const strokeDashoffset = circumference * (1 - progress)
  const band = useMemo(() => getScoreBand(score), [score])

  // In light theme, we want more vibrant solid colors for the score, so let's map them here.
  const themeColors = {
    optimal: '#10B981', // emerald-500
    stable: '#3B82F6', // blue-500
    deviation: '#F59E0B', // amber-500
    danger: '#EF4444' // red-500
  }
  
  let color = themeColors.danger
  let bgClass = 'bg-red-50 text-red-700 border-red-200'
  if (score >= 90) { color = themeColors.optimal; bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  else if (score >= 75) { color = themeColors.stable; bgClass = 'bg-blue-50 text-blue-700 border-blue-200' }
  else if (score >= 55) { color = themeColors.deviation; bgClass = 'bg-amber-50 text-amber-700 border-amber-200' }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track (Light theme) */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="#E2E8F0" // slate-200
            strokeWidth="12"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-extrabold leading-none tracking-tight tabular-nums transition-colors duration-400"
               style={{ fontSize: size > 130 ? '42px' : '32px', color }}>
            {Math.round(score)}
          </div>
          <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">/ 100</div>
        </div>
      </div>

      {/* Band label */}
      <div className={`flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full border ${bgClass}`}>
        <span className="text-sm">{band.emoji}</span>
        <span className="text-xs font-bold uppercase tracking-wide">{band.label}</span>
      </div>
    </div>
  )
}
