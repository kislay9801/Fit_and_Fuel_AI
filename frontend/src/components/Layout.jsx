import { useState } from 'react'
import Sidebar from './Sidebar'
import MobileBottomNav from './MobileBottomNav'

export default function Layout({ children, user }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {/* Sidebar is fixed; reserve space for it on desktop, full width on mobile.
          Bottom padding on mobile clears the fixed bottom nav. */}
      <main className="md:ml-[240px] min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <MobileBottomNav onOpenMenu={() => setMenuOpen(true)} />
    </div>
  )
}
