import { Link, useLocation } from 'react-router-dom'
import { signOutUser } from '../firebase/auth'
import { LayoutDashboard, Dumbbell, History, LogOut, Zap } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/exercises', icon: Dumbbell, label: 'Exercises' },
  { to: '/history', icon: History, label: 'History' },
]

export default function Sidebar({ user }) {
  const location = useLocation()

  const handleSignOut = async () => {
    await signOutUser()
  }

  return (
    <aside className="fixed left-0 top-0 z-50 w-[240px] h-screen bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <div className="text-[15px] font-extrabold text-slate-900 tracking-tight leading-tight">Fit &amp; Fuel</div>
          <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">AI Coach</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/')
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                active 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 mt-auto border-t border-slate-200">
        {user && (
          <div className="px-3 mb-3">
            <div className="text-sm font-bold text-slate-900 truncate">
              {user.displayName || user.email?.split('@')[0] || 'Athlete'}
            </div>
            <div className="text-xs font-medium text-slate-500 truncate">
              {user.email}
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
