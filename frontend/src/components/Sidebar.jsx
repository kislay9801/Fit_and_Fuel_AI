import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signOutUser } from '../firebase/auth'
import { isAdmin } from '../utils/admin'
import { LayoutDashboard, Dumbbell, History, LogOut, Zap, HeartPulse, ChevronDown, Shield, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/exercises', icon: Dumbbell, label: 'Exercises' },
  { to: '/history', icon: History, label: 'History' },
]

export default function Sidebar({ user, mobileOpen = false, onClose = () => {} }) {
  const location = useLocation()
  const [servicesOpen, setServicesOpen] = useState(false)
  const isServicesActive = location.pathname.startsWith('/services')

  const handleSignOut = async () => {
    await signOutUser()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 z-40" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 w-[240px] h-screen bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo → Dashboard */}
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-slate-900 tracking-tight leading-tight">Fit &amp; Fuel</div>
            <div className="text-xs font-bold text-blue-600 tracking-wider uppercase">AI Coach</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + '/')
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
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

          {/* Services Dropdown */}
          <div>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                isServicesActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <HeartPulse className={`w-5 h-5 ${isServicesActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                Services
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''} ${isServicesActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            </button>

            {servicesOpen && (
              <div className="flex flex-col gap-1 mt-1 pl-11 pr-2">
                {[
                  { to: '/services/nutrition', label: 'Nutrition' },
                  { to: '/services/injuries', label: 'Injuries & Recovery' },
                  { to: '/services/exercises', label: 'Exercise Library' },
                  { to: '/services/warmups', label: 'Warm-Up Exercises' },
                  { to: '/services/athletes', label: 'Athletes & Quotes' }
                ].map(sub => {
                  const subActive = location.pathname === sub.to
                  return (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      onClick={onClose}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        subActive
                          ? 'bg-blue-50/50 text-blue-700'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {sub.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Admin (owner only) */}
          {isAdmin(user) && (
            <Link
              to="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                location.pathname === '/admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Shield className={`w-5 h-5 ${location.pathname === '/admin' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              Admin
            </Link>
          )}
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
    </>
  )
}
