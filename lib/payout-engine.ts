import type { PayoutResult, RiskScore } from './types'
import { randomBytes } from 'crypto'

const AMOUNTS: Record<string, number> = { critical: 15, high: 8, medium: 4 }

export async function triggerPayout(p: {
  farmerPhone: string
  farmerName: string
  risk: RiskScore
  ndviAtTrigger: number
  rainfallAtTrigger: number
}): Promise<PayoutResult> {
  const ref = `AW-${randomBytes(4).toString('hex').toUpperCase()}`
  const amount = AMOUNTS[p.risk.level] ?? 4

  // Simulate processing delay for demo drama
  await new Promise((r) => setTimeout(r, 800))

  if (process.env.DEMO_MODE === 'true') {
    return {
      success: true,
      reference: ref,
      amountUsd: amount,
      farmerName: p.farmerName,
      phone: p.farmerPhone,
      method: 'M-Pesa (simulated)',
      timestamp: new Date().toISOString(),
      triggerReason: p.risk.reasons.join('; '),
    }
  }
  // Production: call Safaricom Daraja B2C API or Orange Money API
  void p.ndviAtTrigger
  void p.rainfallAtTrigger
  throw new Error('Set DEMO_MODE=true or configure production payment provider')
}
