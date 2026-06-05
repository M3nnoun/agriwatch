import { prisma } from '@/lib/prisma'
import { AlertBadge } from '@/components/AlertBadge'
import { Bell, Banknote } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Alerts · AgriWatch' }

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { triggeredAt: 'desc' },
    include: {
      farm: { include: { farmer: true } },
      payouts: true,
    },
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Alert queue</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Every climate alert raised by the monitoring engine, newest first.
        </p>
      </header>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {alerts.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
            <Bell size={24} className="text-gray-600" />
            No alerts yet — run a simulation to generate one.
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {alerts.map((a) => {
              const paid = a.payouts.reduce((s, p) => s + p.amountUsd, 0)
              return (
                <li key={a.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">{a.farm.farmer.name}</span>
                        <AlertBadge severity={a.severity} />
                        <span className="text-xs text-gray-500 uppercase">{a.alertType}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {a.farm.cropType} · {a.farm.country} ·{' '}
                        {new Date(a.triggeredAt).toLocaleString()}
                      </p>
                      {a.messageText && (
                        <p className="mt-2 text-sm text-gray-300 line-clamp-3 whitespace-pre-wrap">
                          {a.messageText}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {paid > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <Banknote size={14} /> ${paid.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">no payout</span>
                      )}
                      <p className="text-[11px] text-gray-600 mt-1">
                        {a.messageSent ? 'WhatsApp sent' : 'queued'}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
