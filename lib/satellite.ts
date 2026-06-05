import type { SatelliteReading } from './types'

// NDVI = (NIR - Red) / (NIR + Red)
// Sentinel-2: NIR = Band 8 (B08), Red = Band 4 (B04)
export function calculateNdvi(nir: number[], red: number[]): number {
  const values = nir.map((n, i) => {
    const denom = n + red[i]
    return denom === 0 ? 0 : (n - red[i]) / denom
  })
  return values.reduce((a, b) => a + b, 0) / values.length
}

// NDWI = (Green - NIR) / (Green + NIR)
// Sentinel-2: Green = Band 3 (B03)
export function calculateNdwi(green: number[], nir: number[]): number {
  const values = green.map((g, i) => {
    const denom = g + nir[i]
    return denom === 0 ? 0 : (g - nir[i]) / denom
  })
  return values.reduce((a, b) => a + b, 0) / values.length
}

export async function fetchSentinel2(lat: number, lon: number): Promise<SatelliteReading> {
  if (process.env.DEMO_MODE === 'true' || !process.env.COPERNICUS_CLIENT_ID) {
    return mockSatelliteReading()
  }
  // Real: auth Copernicus -> search Products -> download B04+B08 -> calculateNdvi
  // Coordinates would parameterize the STAC search bbox; omitted in demo build.
  void lat
  void lon
  throw new Error('Set DEMO_MODE=true or provide COPERNICUS_CLIENT_ID')
}

export function mockSatelliteReading(stressed = true): SatelliteReading {
  const ndvi = stressed ? 0.28 : 0.61
  const seasonal = stressed ? 0.51 : 0.58
  return {
    ndvi,
    ndwi: stressed ? -0.18 : 0.12,
    date: new Date().toISOString(),
    seasonalAverage: seasonal,
    anomalyPct: parseFloat((((ndvi - seasonal) / seasonal) * 100).toFixed(1)),
    cloudCoverage: 8.4,
    source: 'Sentinel-2 (simulated)',
  }
}
