import type { RiskScore, SatelliteReading, WeatherData } from './types'

// Published FAO drought thresholds (mm/week) by crop type
// Source: FAO Crop Water Requirements, Irrigation and Drainage Paper 56
const THRESHOLDS: Record<string, { critical: number; warning: number }> = {
  maize: { critical: 10, warning: 20 },
  wheat: { critical: 8, warning: 15 },
  sorghum: { critical: 6, warning: 12 },
  millet: { critical: 5, warning: 10 },
  cassava: { critical: 12, warning: 22 },
  other: { critical: 10, warning: 20 },
}

export function calculateRiskScore(
  cropType: string,
  sat: SatelliteReading,
  weather: WeatherData
): RiskScore {
  const t = THRESHOLDS[cropType] ?? THRESHOLDS.other
  const reasons: string[] = []
  let score = 0

  // NDVI anomaly scoring
  if (sat.anomalyPct <= -35) {
    score += 40
    reasons.push(`Crop health ${Math.abs(sat.anomalyPct).toFixed(0)}% below seasonal average`)
  } else if (sat.anomalyPct <= -20) {
    score += 25
    reasons.push(`Crop stress detected — ${Math.abs(sat.anomalyPct).toFixed(0)}% below normal`)
  } else if (sat.anomalyPct <= -10) {
    score += 10
    reasons.push('Mild crop stress — monitor closely')
  }

  // NDWI water stress
  if (sat.ndwi < -0.2) {
    score += 15
    reasons.push('Severe water stress in crop canopy')
  } else if (sat.ndwi < -0.1) {
    score += 8
    reasons.push('Moderate water stress detected')
  }

  // Rainfall scoring
  if (weather.rainfallMm7day < t.critical) {
    score += 35
    reasons.push(`Critically low rainfall: ${weather.rainfallMm7day.toFixed(1)}mm this week`)
  } else if (weather.rainfallMm7day < t.warning) {
    score += 20
    reasons.push(`Below-normal rainfall: ${weather.rainfallMm7day.toFixed(1)}mm this week`)
  }

  // 14-day forecast
  if (weather.rainfallMm14dayForecast < t.critical * 2) {
    score += 15
    reasons.push(`14-day forecast: only ${weather.rainfallMm14dayForecast.toFixed(1)}mm expected`)
  }

  // Soil moisture
  if (weather.soilMoisture < 0.1) {
    score += 10
    reasons.push(`Critically dry soil (${(weather.soilMoisture * 100).toFixed(0)}% moisture)`)
  }

  score = Math.min(score, 100)
  const level =
    score >= 70 ? 'critical' : score >= 45 ? 'high' : score >= 25 ? 'medium' : score >= 10 ? 'low' : 'normal'

  return {
    level,
    score,
    droughtRisk: score >= 45,
    triggersPayout: score >= 70,
    ndviAnomalyPct: sat.anomalyPct,
    reasons,
  }
}
