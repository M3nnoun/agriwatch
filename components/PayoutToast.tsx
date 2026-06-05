import { CheckCircle2 } from 'lucide-react'
import type { PayoutResult } from '@/lib/types'

export function PayoutToast({ payout }: { payout: PayoutResult }) {
  return (
    <div className="bg-emerald-950 border border-emerald-700 rounded-xl p-6 text-center animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center justify-center gap-2 mb-2 text-emerald-400">
        <CheckCircle2 size={20} />
        <span className="text-sm font-medium uppercase tracking-wide">Payout sent</span>
      </div>
      <p className="text-5xl font-bold text-emerald-400 mb-1">${payout.amountUsd.toFixed(2)}</p>
      <p className="text-emerald-300 text-sm mb-1">to {payout.farmerName}</p>
      <p className="text-emerald-300/70 text-xs mb-3">{payout.method}</p>
      <p className="text-xs text-gray-400 font-mono">Ref: {payout.reference}</p>
    </div>
  )
}
