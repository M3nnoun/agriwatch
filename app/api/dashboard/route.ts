import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [farmers, farms, alerts, payouts, payoutAgg, countries] = await Promise.all([
    prisma.farmer.count(),
    prisma.farm.count(),
    prisma.alert.count(),
    prisma.payout.count(),
    prisma.payout.aggregate({ _sum: { amountUsd: true } }),
    prisma.farm.findMany({ select: { country: true }, distinct: ['country'] }),
  ])

  const severityCounts = await prisma.alert.groupBy({
    by: ['severity'],
    _count: { _all: true },
  })

  return NextResponse.json({
    farmers,
    farms,
    alerts,
    payouts,
    totalPaidUsd: payoutAgg._sum.amountUsd ?? 0,
    countries: countries.length,
    severityCounts: severityCounts.map((s) => ({
      severity: s.severity,
      count: s._count._all,
    })),
  })
}
