import { prisma } from '@/lib/prisma'
import { AlertBadge } from '@/components/AlertBadge'
import { LANGUAGE_LABELS } from '@/lib/ui'
import { Phone, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Farmers · AgriWatch' }

export default async function FarmersPage() {
  const farmers = await prisma.farmer.findMany({
    orderBy: { registeredAt: 'asc' },
    include: {
      farms: {
        include: {
          ndviReadings: { orderBy: { readingDate: 'desc' }, take: 1 },
          alerts: { orderBy: { triggeredAt: 'desc' }, take: 1 },
          payouts: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Registered farmers</h1>
        <p className="mt-1 text-gray-400 text-sm">
          {farmers.length} smallholder farmers under active satellite monitoring.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {farmers.map((farmer) => {
          const farm = farmer.farms[0]
          const ndvi = farm?.ndviReadings[0]?.ndviMean ?? null
          const severity = farm?.alerts[0]?.severity ?? null
          const totalPaid = farmer.farms
            .flatMap((f) => f.payouts)
            .reduce((s, p) => s + p.amountUsd, 0)

          return (
            <div key={farmer.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-white font-semibold">{farmer.name}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Phone size={12} /> {farmer.phoneNumber}
                  </p>
                </div>
                {severity && <AlertBadge severity={severity} />}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat label="Crop" value={farm?.cropType ?? '—'} />
                <Stat
                  label="NDVI"
                  value={ndvi != null ? ndvi.toFixed(2) : '—'}
                  danger={ndvi != null && ndvi < 0.35}
                />
                <Stat label="Paid" value={`$${totalPaid.toFixed(0)}`} good={totalPaid > 0} />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {farm?.country ?? 'Unknown'}
                </span>
                <span>{LANGUAGE_LABELS[farmer.language] ?? farmer.language}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  danger,
  good,
}: {
  label: string
  value: string
  danger?: boolean
  good?: boolean
}) {
  const color = danger ? 'text-red-400' : good ? 'text-emerald-400' : 'text-white'
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold capitalize ${color}`}>{value}</p>
    </div>
  )
}
