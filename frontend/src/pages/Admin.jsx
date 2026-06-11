import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getAllUsers } from '../firebase/firestore'
import { isAdmin } from '../utils/admin'
import { Users, Shield, RefreshCw, Activity, Award } from 'lucide-react'

function formatDate(d) {
  if (!d) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function scoreColor(score) {
  if (score >= 90) return 'text-emerald-600'
  if (score >= 75) return 'text-blue-600'
  if (score >= 55) return 'text-amber-600'
  return 'text-slate-500'
}

export default function Admin({ user }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    const { users: u, error: e } = await getAllUsers()
    setUsers(u)
    setError(e)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  // Hard gate: non-admins never see this page
  if (!isAdmin(user)) return <Navigate to="/dashboard" replace />

  const totalSessions = users.reduce((sum, u) => sum + (u.totalSessions || 0), 0)
  const activeUsers = users.filter(u => (u.totalSessions || 0) > 0).length

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md h-20 w-full flex justify-between items-center px-4 sm:px-8 border-b border-slate-200 shadow-sm gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-lg sm:text-2xl text-slate-900 tracking-tight truncate">Admin · Users</h2>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </header>

      <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600' },
            { label: 'Active Users', value: activeUsers, icon: Activity, color: 'text-emerald-600' },
            { label: 'Total Sessions', value: totalSessions, icon: Award, color: 'text-amber-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-900">{loading ? '—' : value}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            ⚠ {error}
          </div>
        )}

        {/* Users table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-slate-500 text-sm font-medium">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3 animate-spin" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-900">No users yet</p>
              <p className="text-sm text-slate-500">Users appear here after they sign up.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-slate-200 bg-slate-50">
                    {['User', 'Sessions', 'Avg Score', 'Best', 'Joined', 'Last Active'].map(h => (
                      <th key={h} className="px-6 py-3 text-xs text-slate-500 uppercase font-bold tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-900">{u.displayName || u.email?.split('@')[0] || 'Athlete'}</div>
                        <div className="text-xs text-slate-500">{u.email || u.id}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-slate-900">{u.totalSessions ?? 0}</td>
                      <td className={`px-6 py-4 font-bold text-sm ${scoreColor(u.avgFormScore ?? 0)}`}>{u.avgFormScore ?? 0}</td>
                      <td className="px-6 py-4 font-bold text-sm text-slate-700">{u.bestScore ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(u.lastSessionAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
