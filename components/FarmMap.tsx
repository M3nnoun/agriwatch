'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ndviColor } from '@/lib/ui'

export interface MapFarm {
  id: string
  name: string
  farmerName: string
  cropType: string
  country: string
  latitude: number
  longitude: number
  ndvi: number | null
  severity: string | null
}

export default function FarmMap({ farms }: { farms: MapFarm[] }) {
  const valid = farms.filter((f) => f.latitude !== 0 || f.longitude !== 0)
  const center: [number, number] = valid.length
    ? [
        valid.reduce((a, f) => a + f.latitude, 0) / valid.length,
        valid.reduce((a, f) => a + f.longitude, 0) / valid.length,
      ]
    : [4, 18]

  return (
    <MapContainer
      center={center}
      zoom={4}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', background: '#0b0f1a' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {valid.map((f) => {
        const color = f.ndvi != null ? ndviColor(f.ndvi) : '#6b7280'
        return (
          <CircleMarker
            key={f.id}
            center={[f.latitude, f.longitude]}
            radius={10}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.7, weight: 2 }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong>{f.farmerName}</strong>
                <br />
                {f.name} · {f.cropType}
                <br />
                {f.country}
                <br />
                NDVI: {f.ndvi != null ? f.ndvi.toFixed(2) : 'n/a'}
                {f.severity ? ` · ${f.severity}` : ''}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
