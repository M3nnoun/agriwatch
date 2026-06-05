import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { CropType, Language } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const farmers = await prisma.farmer.findMany({
    orderBy: { registeredAt: 'desc' },
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
  return NextResponse.json(farmers)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { phoneNumber, name, language, crop, latitude, longitude, country, region, areaHectares } =
    body

  if (!phoneNumber || !name || latitude == null || longitude == null || !country) {
    return NextResponse.json(
      { error: 'phoneNumber, name, latitude, longitude and country are required' },
      { status: 400 }
    )
  }

  const farmer = await prisma.farmer.create({
    data: {
      phoneNumber,
      name,
      language: (language ?? 'en') as Language,
      farms: {
        create: {
          name: `${name.split(' ')[0]}'s farm`,
          cropType: (crop ?? 'maize') as CropType,
          latitude,
          longitude,
          country,
          region: region ?? null,
          areaHectares: areaHectares ?? 1.0,
        },
      },
    },
    include: { farms: true },
  })

  return NextResponse.json(farmer, { status: 201 })
}
