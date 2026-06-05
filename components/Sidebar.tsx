'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Map, Zap, Bell, Users, Satellite, Menu, X } from 'lucide-react'
import { cn } from '@/lib/ui'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/simulate', label: 'Simulate', icon: Zap, star: true },
  { href: '/map', label: 'NDVI Map', icon: Map },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/farmers', label: 'Farmers', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-gray-800 bg-gray-950 sticky top-0 z-30">
        <Brand />
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-gray-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-b border-gray-800 bg-gray-950">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-800 bg-gray-950 h-screen sticky top-0">
        <div className="px-6 h-16 flex items-center border-b border-gray-800">
          <Brand />
        </div>
        <NavLinks pathname={pathname} />
        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="rounded-lg bg-gray-900 border border-gray-800 p-3">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-emerald-400 font-medium">Demo mode</span> — satellite, payout &
              WhatsApp are simulated. Claude messages are live.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-emerald-600">
        <Satellite size={18} className="text-white" />
      </span>
      <span className="font-semibold tracking-tight text-white">AgriWatch</span>
    </Link>
  )
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="p-3 space-y-1">
      {NAV.map(({ href, label, icon: Icon, star }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              active
                ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-700/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'
            )}
          >
            <Icon size={18} />
            <span>{label}</span>
            {star && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-semibold">
                DEMO
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
