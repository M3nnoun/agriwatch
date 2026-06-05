import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchSentinel2, mockSatelliteReading } from '@/lib/satellite'
import { getWeatherData } from '@/lib/weather'
import { calculateRiskScore } from '@/lib/risk-engine'
import { generateAlertMessageStream } from '@/lib/advisory'
import { triggerPayout } from '@/lib/payout-engine'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { farmId } = await req.json()
  const encoder = new TextEncoder()

  function sse(event: string, data: unknown): Uint8Array {
    return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const farm = await prisma.farm.findUniqueOrThrow({
          where: { id: farmId },
          include: { farmer: true },
        })

        // Step 1: Satellite scanning with progress
        for (const [progress, status] of [
          [10, 'Connecting to Sentinel-2 satellite...'],
          [45, 'Downloading B04 + B08 spectral bands...'],
          [80, 'Calculating NDVI for farm polygon...'],
          [100, 'Analysis complete.'],
        ] as [number, string][]) {
          controller.enqueue(sse('satellite_scan', { progress, status }))
          await delay(progress < 100 ? 650 : 300)
        }

        // Step 2: Satellite + weather data
        const sat =
          process.env.DEMO_MODE === 'true'
            ? mockSatelliteReading(true)
            : await fetchSentinel2(farm.latitude, farm.longitude)

        controller.enqueue(sse('ndvi_result', sat))
        await delay(300)

        const weather = await getWeatherData(farm.latitude, farm.longitude)

        // Step 3: Risk scoring
        const risk = calculateRiskScore(farm.cropType.toLowerCase(), sat, weather)
        controller.enqueue(sse('risk_score', risk))
        await delay(400)

        // Step 4: Claude message streaming
        let fullMessage = ''
        for await (const chunk of generateAlertMessageStream({
          farmerName: farm.farmer.name,
          cropType: farm.cropType.toLowerCase(),
          risk,
          sat,
          weather,
          hasInsurance: true,
          language: farm.farmer.language.toLowerCase(),
        })) {
          fullMessage += chunk
          controller.enqueue(sse('message_chunk', { text: chunk }))
        }

        // Step 5: Save alert + notify
        const alert = await prisma.alert.create({
          data: {
            farmId,
            alertType: 'drought',
            severity: risk.level,
            messageSent: true,
            messageText: fullMessage,
            whatsappStatus: 'simulated',
          },
        })

        controller.enqueue(
          sse('whatsapp_sent', {
            status: 'delivered',
            phone: farm.farmer.phoneNumber,
          })
        )
        await delay(700)

        // Step 6: Payout if critical
        if (risk.triggersPayout) {
          const payout = await triggerPayout({
            farmerPhone: farm.farmer.phoneNumber,
            farmerName: farm.farmer.name,
            risk,
            ndviAtTrigger: sat.ndvi,
            rainfallAtTrigger: weather.rainfallMm7day,
          })

          await prisma.payout.create({
            data: {
              farmId,
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

          controller.enqueue(sse('payout_complete', payout))
        }

        controller.enqueue(sse('done', {}))
        controller.close()
      } catch (err) {
        // Emit a structured error event and close cleanly so the client can
        // show a friendly message instead of a hard "failed to pipe" 500.
        console.error('[simulate] stream failed:', err)
        try {
          controller.enqueue(
            sse('error', {
              message: err instanceof Error ? err.message : 'Simulation failed',
            })
          )
        } catch {
          // controller may already be closed; ignore
        }
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
