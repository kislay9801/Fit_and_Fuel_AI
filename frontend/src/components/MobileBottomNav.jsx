import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, History as HistoryIcon, Menu } from 'lucide-react'

/**
 * Bottom tab bar shown only on mobile (md:hidden). Primary routes live here;
 * the "Menu" button opens the full Sidebar drawer (Services, Admin, Sign Out).
 * Avoids the desktop sidebar squishing page content on phones.
 */
export default function MobileBottomNav({ onOpenMenu }) {
  const { pathname } = useLocation()

  const items = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/exercises', icon: Dumbbell, label: 'Library' },
    { to: '/history', icon: HistoryIcon, label: 'History' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {items.map(({ to, icon: Icon, label }) => {
        const active = pathname === to || pathname.startsWith(to + '/')
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        )
      })}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
      >
        <Menu className="w-6 h-6" />
        <span className="text-[10px] font-semibold">Menu</span>
      </button>
    </nav>
  )
}
