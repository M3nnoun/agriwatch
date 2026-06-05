import { prisma } from '@/lib/prisma'
import { MapView } from '@/components/MapView'
import type { MapFarm } from '@/components/FarmMap'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'NDVI map · AgriWatch' }

export default async function MapPage() {
  const farms = await prisma.farm.findMany({
    include: {
      farmer: true,
      ndviReadings: { orderBy: { readingDate: 'desc' }, take: 1 },
      alerts: { orderBy: { triggeredAt: 'desc' }, take: 1 },
    },
  })

  const mapFarms: MapFarm[] = farms.map((f) => ({
    id: f.id,
    name: f.name,
    farmerName: f.farmer.name,
    cropType: f.cropType,
    country: f.country,
    latitude: f.latitude,
    longitude: f.longitude,
    ndvi: f.ndviReadings[0]?.ndviMean ?? null,
    severity: f.alerts[0]?.severity ?? null,
  }))

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-white">NDVI map</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Each marker is a monitored farm, coloured by current crop health (NDVI). Red = stressed,
          green = healthy.
        </p>
      </header>
      <div className="h-[70vh] rounded-xl overflow-hidden border border-gray-800">
        <MapView farms={mapFarms} />
      </div>
      <Legend />
    </div>
  )
}

function Legend() {
  const items = [
    { c: '#22c55e', l: 'Healthy (≥0.55)' },
    { c: '#84cc16', l: 'Good (0.45–0.55)' },
    { c: '#eab308', l: 'Fair (0.35–0.45)' },
    { c: '#f97316', l: 'Stressed (0.25–0.35)' },
    { c: '#ef4444', l: 'Critical (<0.25)' },
  ]
  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
      {items.map((i) => (
        <span key={i.l} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: i.c }} />
          {i.l}
        </span>
      ))}
    </div>
  )
}
