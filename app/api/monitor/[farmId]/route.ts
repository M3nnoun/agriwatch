import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchSentinel2, mockSatelliteReading } from '@/lib/satellite'
import { getWeatherData } from '@/lib/weather'
import { calculateRiskScore } from '@/lib/risk-engine'
import { triggerPayout } from '@/lib/payout-engine'

export const dynamic = 'force-dynamic'

/**
 * Run a full (non-streaming) monitoring cycle for a single farm:
 * satellite -> weather -> risk -> persist readings -> alert + payout if warranted.
 * Used by cron-style monitoring; the SSE version lives at /api/simulate.
 */
export async function POST(_req: NextRequest, { params }: { params: { farmId: string } }) {
  const farm = await prisma.farm.findUnique({
    where: { id: params.farmId },
    include: { farmer: true },
  })
  if (!farm) {
    return NextResponse.json({ error: 'Farm not found' }, { status: 404 })
  }

  const sat =
    process.env.DEMO_MODE === 'true'
      ? mockSatelliteReading(true)
      : await fetchSentinel2(farm.latitude, farm.longitude)
  const weather = await getWeatherData(farm.latitude, farm.longitude)
  const risk = calculateRiskScore(farm.cropType.toLowerCase(), sat, weather)

  await prisma.ndviReading.create({
    data: {
      farmId: farm.id,
      ndviMean: sat.ndvi,
      ndwiMean: sat.ndwi,
      seasonalAverage: sat.seasonalAverage,
      anomalyPct: sat.anomalyPct,
      cloudCoverage: sat.cloudCoverage,
      source: sat.source,
    },
  })

  await prisma.weatherReading.create({
    data: {
      farmId: farm.id,
      rainfallMm: weather.rainfallMm7day,
      tempMax: weather.tempMax,
      tempMin: weather.tempMax - 10,
      soilMoisture: weather.soilMoisture,
      forecast14dayMm: weather.rainfallMm14dayForecast,
    },
  })

  let alertId: string | null = null
  let payoutId: string | null = null

  if (risk.droughtRisk) {
    const alert = await prisma.alert.create({
      data: {
        farmId: farm.id,
        alertType: 'drought',
        severity: risk.level,
        messageSent: false,
        whatsappStatus: 'queued',
      },
    })
    alertId = alert.id

    if (risk.triggersPayout) {
      const payout = await triggerPayout({
        farmerPhone: farm.farmer.phoneNumber,
        farmerName: farm.farmer.name,
        risk,
        ndviAtTrigger: sat.ndvi,
        rainfallAtTrigger: weather.rainfallMm7day,
      })
      const record = await prisma.payout.create({
        data: {
          farmId: farm.id,
          alertId: alert.id,
          amountUsd: payout.amountUsd,
          triggerReason: payout.triggerReason,
          ndviAtTrigger: sat.ndvi,
          rainfallAtTrigger: weather.rainfallMm7day,
          status: 'sent',
          mobileMoneyRef: payout.reference,
          method: payout.method,
        },
      })
      payoutId = record.id
    }
  }

  return NextResponse.json({ farmId: farm.id, sat, weather, risk, alertId, payoutId })
}
