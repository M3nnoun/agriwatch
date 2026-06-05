import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerPayout } from '@/lib/payout-engine'
import { calculateRiskScore } from '@/lib/risk-engine'
import { mockSatelliteReading } from '@/lib/satellite'
import { getWeatherData } from '@/lib/weather'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payouts = await prisma.payout.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      farm: { include: { farmer: true } },
      alert: true,
    },
  })
  return NextResponse.json(payouts)
}

export async function POST(req: NextRequest) {
  const { farmId, alertId } = await req.json()
  if (!farmId) {
    return NextResponse.json({ error: 'farmId is required' }, { status: 400 })
  }

  const farm = await prisma.farm.findUnique({
    where: { id: farmId },
    include: { farmer: true },
  })
  if (!farm) {
    return NextResponse.json({ error: 'Farm not found' }, { status: 404 })
  }

  const sat = mockSatelliteReading(true)
  const weather = await getWeatherData(farm.latitude, farm.longitude)
  const risk = calculateRiskScore(farm.cropType.toLowerCase(), sat, weather)

  const payout = await triggerPayout({
    farmerPhone: farm.farmer.phoneNumber,
    farmerName: farm.farmer.name,
    risk,
    ndviAtTrigger: sat.ndvi,
    rainfallAtTrigger: weather.rainfallMm7day,
  })

  const record = await prisma.payout.create({
    data: {
      farmId,
      alertId: alertId ?? null,
      amountUsd: payout.amountUsd,
      triggerReason: payout.triggerReason,
      ndviAtTrigger: sat.ndvi,
      rainfallAtTrigger: weather.rainfallMm7day,
      status: 'sent',
      mobileMoneyRef: payout.reference,
      method: payout.method,
    },
  })

  return NextResponse.json(record, { status: 201 })
}
