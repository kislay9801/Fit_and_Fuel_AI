import { useNavigate } from 'react-router-dom'
import { Play, Dumbbell } from 'lucide-react'

const exerciseConfig = {
  squat: {
    emoji: '🏋️',
    gradient: 'linear-gradient(135deg, #0066ff, #4ade80)',
    glowColor: 'rgba(0, 102, 255, 0.2)',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    tips: ['Keep chest up', 'Drive knees over toes', 'Go below parallel', 'Brace core throughout'],
    difficulty: 'Intermediate',
    kcal: '~8 kcal/rep',
  },
  pushup: {
    emoji: '💪',
    gradient: 'linear-gradient(135deg, #00d4d4, #0066ff)',
    glowColor: 'rgba(0, 212, 212, 0.2)',
    muscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    tips: ['Body stays in straight line', 'Elbows at 45°', 'Full chest to ground', 'Controlled descent'],
    difficulty: 'Beginner',
    kcal: '~5 kcal/rep',
  },
  deadlift: {
    emoji: '🔥',
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    glowColor: 'rgba(249, 115, 22, 0.2)',
    muscles: ['Hamstrings', 'Glutes', 'Erectors', 'Traps', 'Lats'],
    tips: ['Neutral spine always', 'Hip hinge pattern', 'Bar close to body', 'Lock out at top'],
    difficulty: 'Advanced',
    kcal: '~10 kcal/rep',
  },
}

export default function ExerciseCard({ exercise }) {
  const navigate = useNavigate()
  const config = exerciseConfig[exercise]
  const name = exercise.charAt(0).toUpperCase() + exercise.slice(1)

  return (
    <div
      className="card-hover"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e9f0',
        borderRadius: '8px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        cursor: 'default',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#0066ff'
        e.currentTarget.style.boxShadow = `0 8px 32px ${config.glowColor}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e5e9f0'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '8px',
          background: config.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', flexShrink: 0,
        }}>
          {config.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0a0a14', margin: 0 }}>{name}</h3>
            <span style={{
              fontSize: '10px', fontWeight: '600',
              padding: '2px 8px', borderRadius: '20px',
              background: 'rgba(0, 102, 255, 0.08)',
              color: '#0066ff', textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {config.difficulty}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#8b94a5' }}>{config.kcal}</div>
        </div>
      </div>

      {/* Muscles */}
      <div>
        <div style={{ fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: '600' }}>
          Muscles Targeted
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {config.muscles.map(m => (
            <span key={m} style={{
              fontSize: '12px', color: '#4b5563',
              padding: '3px 10px', borderRadius: '20px',
              background: '#f0f3fa',
              border: '1px solid #cbd5e1',
            }}>{m}</span>
          ))}
        </div>
      </div>

      {/* Form Tips */}
      <div>
        <div style={{ fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: '600' }}>
          Key Form Tips
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {config.tips.map((tip, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
              <span style={{ color: '#4ade80', flexShrink: 0 }}>✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate(`/session/${exercise}`)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          width: '100%', padding: '14px',
          background: config.gradient,
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '700', color: 'white',
          transition: 'opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
          boxShadow: `0 4px 16px ${config.glowColor}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${config.glowColor}` }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${config.glowColor}` }}
      >
        <Play size={16} fill="white" />
        Start Analysis
      </button>
    </div>
  )
}
