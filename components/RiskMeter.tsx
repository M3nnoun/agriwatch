import { cn } from '@/lib/ui'

export function RiskMeter({ score, level }: { score: number; level: string }) {
  const color =
    score >= 70
      ? 'bg-red-500'
      : score >= 45
        ? 'bg-orange-500'
        : score >= 25
          ? 'bg-amber-500'
          : score >= 10
            ? 'bg-yellow-500'
            : 'bg-emerald-500'

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wide text-gray-400">Risk score</span>
        <span className="text-sm font-semibold text-white">
          {score}
          <span className="text-gray-500">/100</span>
          <span className="ml-2 uppercase text-xs text-gray-400">{level}</span>
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={cn('h-2 rounded-full transition-all duration-700', color)}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  )
}
