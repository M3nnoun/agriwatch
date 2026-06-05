import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const farmer = await prisma.farmer.findUnique({
    where: { id: params.id },
    include: {
      farms: {
        include: {
          ndviReadings: { orderBy: { readingDate: 'desc' } },
          weatherReadings: { orderBy: { readingDate: 'desc' } },
          alerts: { orderBy: { triggeredAt: 'desc' } },
          payouts: { orderBy: { createdAt: 'desc' } },
        },
      },
    },
  })

  if (!farmer) {
    return NextResponse.json({ error: 'Farmer not found' }, { status: 404 })
  }

  return NextResponse.json(farmer)
}
