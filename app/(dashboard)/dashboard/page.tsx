import Link from 'next/link'
import { Users, Sprout, Bell, Banknote, Zap, Globe } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { MetricCard } from '@/components/MetricCard'
import { AlertBadge } from '@/components/AlertBadge'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [farmers, farms, alertCount, payoutCount, payoutAgg, countries, recentAlerts, recentPayouts] =
    await Promise.all([
      prisma.farmer.count(),
      prisma.farm.count(),
      prisma.alert.count(),
      prisma.payout.count(),
      prisma.payout.aggregate({ _sum: { amountUsd: true } }),
      prisma.farm.findMany({ select: { country: true }, distinct: ['country'] }),
      prisma.alert.findMany({
        orderBy: { triggeredAt: 'desc' },
        take: 5,
        include: { farm: { include: { farmer: true } } },
      }),
      prisma.payout.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { farm: { include: { farmer: true } } },
      }),
    ])

  const totalPaid = payoutAgg._sum.amountUsd ?? 0

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mission control</h1>
          <p className="mt-1 text-gray-400 text-sm max-w-xl">
            We watch your fields from space. We warn you before the storm hits. We pay you when it
            does.
          </p>
        </div>
        <Link
          href="/simulate"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors self-start"
        >
          <Zap size={16} /> Run drought simulation
        </Link>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Farmers protected" value={farmers} icon={Users} accent="emerald" />
        <MetricCard label="Farms monitored" value={farms} icon={Sprout} accent="emerald" sub={`${countries.length} countries`} />
        <MetricCard label="Active alerts" value={alertCount} icon={Bell} accent="amber" />
        <MetricCard
          label="Paid out"
          value={`$${totalPaid.toFixed(2)}`}
          icon={Banknote}
          accent="emerald"
          sub={`${payoutCount} payouts`}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent alerts */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-medium text-white flex items-center gap-2">
              <Bell size={16} className="text-amber-400" /> Recent alerts
            </h2>
            <Link href="/alerts" className="text-xs text-emerald-400 hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-800">
            {recentAlerts.length === 0 && (
              <li className="px-5 py-6 text-sm text-gray-500">No alerts yet.</li>
            )}
            {recentAlerts.map((a) => (
              <li key={a.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{a.farm.farmer.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {a.farm.cropType} · {a.farm.country} · {a.alertType}
                  </p>
                </div>
                <AlertBadge severity={a.severity} />
              </li>
            ))}
          </ul>
        </section>

        {/* Recent payouts */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-medium text-white flex items-center gap-2">
              <Banknote size={16} className="text-emerald-400" /> Recent payouts
            </h2>
            <Link href="/farmers" className="text-xs text-emerald-400 hover:underline">
              Farmers
            </Link>
          </div>
          <ul className="divide-y divide-gray-800">
            {recentPayouts.length === 0 && (
              <li className="px-5 py-6 text-sm text-gray-500">No payouts yet.</li>
            )}
            {recentPayouts.map((p) => (
              <li key={p.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{p.farm.farmer.name}</p>
                  <p className="text-xs text-gray-500 truncate font-mono">{p.mobileMoneyRef}</p>
                </div>
                <span className="text-emerald-400 font-semibold">${p.amountUsd.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-3">
        <Globe size={18} className="text-emerald-400 shrink-0" />
        <p className="text-sm text-gray-400">
          Monitoring {farms} farms across {countries.length} countries via Sentinel-2, NASA POWER and
          Open-Meteo. Alerts are written by Claude in the farmer&apos;s own language and delivered to
          any phone — no app required.
        </p>
      </section>
    </div>
  )
}
