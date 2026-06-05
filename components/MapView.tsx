'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { MapFarm } from './FarmMap'

// Leaflet uses `window`; it must never render on the server.
const FarmMap = dynamic(() => import('@/components/FarmMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center text-gray-500 text-sm">
      Loading map…
    </div>
  ),
})

export function MapView({ farms }: { farms: MapFarm[] }) {
  const data = useMemo(() => farms, [farms])
  return <FarmMap farms={data} />
}
