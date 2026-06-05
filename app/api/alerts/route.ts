import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const severity = searchParams.get('severity')
  const alertType = searchParams.get('type')

  const where: Prisma.AlertWhereInput = {}
  if (severity) where.severity = severity
  if (alertType) where.alertType = alertType

  const alerts = await prisma.alert.findMany({
    where,
    orderBy: { triggeredAt: 'desc' },
    include: {
      farm: { include: { farmer: true } },
      payouts: true,
    },
  })

  return NextResponse.json(alerts)
}
