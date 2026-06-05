import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/ui'

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'emerald',
}: {
  label: string
  value: string | number
  sub?: string
  icon?: LucideIcon
  accent?: 'emerald' | 'red' | 'blue' | 'amber'
}) {
  const accentMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
        </div>
        {Icon && (
          <span className={cn('grid place-items-center w-10 h-10 rounded-lg', accentMap[accent])}>
            <Icon size={20} />
          </span>
        )}
      </div>
    </div>
  )
}
