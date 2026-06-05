// Enum-like value unions. Stored as String in the DB (SQLite has no enums),
// so these are the single source of truth for allowed values.
export type Language = 'ar' | 'sw' | 'fr' | 'en'
export type CropType = 'maize' | 'wheat' | 'sorghum' | 'millet' | 'cassava' | 'other'
export type AlertType = 'drought' | 'flood' | 'frost' | 'pest'
export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type PayoutStatus = 'pending' | 'sent' | 'confirmed' | 'failed'

export interface RiskScore {
  level: 'normal' | 'low' | 'medium' | 'high' | 'critical'
  score: number
  droughtRisk: boolean
  triggersPayout: boolean
  ndviAnomalyPct: number
  reasons: string[]
}

export interface SatelliteReading {
  ndvi: number
  ndwi: number
  date: string
  seasonalAverage: number
  anomalyPct: number
  cloudCoverage: number
  source: string
}

export interface WeatherData {
  rainfallMm7day: number
  rainfallMm14dayForecast: number
  tempMax: number
  soilMoisture: number
}

export interface PayoutResult {
  success: boolean
  reference: string
  amountUsd: number
  farmerName: string
  phone: string
  method: string
  timestamp: string
  triggerReason: string
}

export type SimulateEvent =
  | { event: 'satellite_scan'; data: { progress: number; status: string } }
  | { event: 'ndvi_result'; data: SatelliteReading }
  | { event: 'risk_score'; data: RiskScore }
  | { event: 'message_chunk'; data: { text: string } }
  | { event: 'whatsapp_sent'; data: { status: string; phone: string } }
  | { event: 'payout_complete'; data: PayoutResult }
  | { event: 'error'; data: { message: string } }
  | { event: 'done'; data: Record<string, never> }
