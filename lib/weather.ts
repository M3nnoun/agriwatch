import type { WeatherData } from './types'

const NASA_POWER = 'https://power.larc.nasa.gov/api/temporal/daily/point'
const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast'

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  if (process.env.DEMO_MODE === 'true') return mockWeatherData(true)
  try {
    const end = new Date()
    const start = new Date(end.getTime() - 30 * 86400000)
    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '')

    const [nasaRes, meteoRes] = await Promise.all([
      fetch(
        `${NASA_POWER}?parameters=PRECTOTCORR,T2M_MAX,GWETROOT&community=AG` +
          `&longitude=${lon}&latitude=${lat}&start=${fmt(start)}&end=${fmt(end)}&format=JSON`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `${OPEN_METEO}?latitude=${lat}&longitude=${lon}` +
          `&daily=precipitation_sum,temperature_2m_max,soil_moisture_0_to_7cm_mean` +
          `&forecast_days=14&timezone=auto`,
        { next: { revalidate: 3600 } }
      ),
    ])

    const nasa = await nasaRes.json()
    const meteo = await meteoRes.json()

    const precip = (nasa?.properties?.parameter?.PRECTOTCORR ?? {}) as Record<string, number>
    const rain7 = (Object.values(precip) as number[])
      .slice(-7)
      .reduce((a, b) => a + b, 0)

    const forecast14 = ((meteo?.daily?.precipitation_sum ?? []) as number[]).reduce(
      (a, b) => a + b,
      0
    )

    const tempVals = Object.values(
      (nasa?.properties?.parameter?.T2M_MAX ?? { x: 32 }) as Record<string, number>
    ) as number[]

    return {
      rainfallMm7day: rain7,
      rainfallMm14dayForecast: forecast14,
      tempMax: Math.max(...tempVals),
      soilMoisture: meteo?.daily?.soil_moisture_0_to_7cm_mean?.[0] ?? 0.15,
    }
  } catch {
    return mockWeatherData(true)
  }
}

function mockWeatherData(drought = false): WeatherData {
  return {
    rainfallMm7day: drought ? 4.2 : 22.8,
    rainfallMm14dayForecast: drought ? 8.1 : 38.4,
    tempMax: drought ? 38.5 : 28.2,
    soilMoisture: drought ? 0.08 : 0.31,
  }
}
