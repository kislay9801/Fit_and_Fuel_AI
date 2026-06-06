import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e5e9f0',
      borderRadius: '8px', padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(0, 102, 255, 0.1)',
    }}>
      <p style={{ color: '#4b5563', fontSize: '11px', marginBottom: '4px' }}>Session {label}</p>
      <p style={{ color: '#0066ff', fontSize: '16px', fontWeight: '700' }}>
        {payload[0].value}<span style={{ fontSize: '11px', color: '#4b5563' }}>/100</span>
      </p>
    </div>
  )
}

export default function ScoreTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        height: '200px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#8b94a5', fontSize: '14px',
      }}>
        No sessions yet — start training!
      </div>
    )
  }

  const chartData = data.map((s, i) => ({
    session: i + 1,
    score: Math.round(s.form_score),
    exercise: s.exercise,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e9f0" />
        <XAxis
          dataKey="session"
          tick={{ fill: '#4b5563', fontSize: 11 }}
          axisLine={{ stroke: '#e5e9f0' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#4b5563', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={75} stroke="rgba(0, 102, 255, 0.2)" strokeDasharray="4 4" />
        <ReferenceLine y={55} stroke="rgba(249, 115, 22, 0.2)" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#0066ff"
          strokeWidth={2.5}
          dot={{ fill: '#0066ff', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
