import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FARMERS = [
  { name: 'Amara Diallo',     phone: '+221701234567', language: 'fr', country: 'Senegal',   crop: 'millet',  lat: 14.4974, lon: -14.4524, ndvi: 0.28, seasonal: 0.51, risk: 'critical' },
  { name: 'Fatima Al-Rashid', phone: '+212601234567', language: 'ar', country: 'Morocco',   crop: 'wheat',   lat: 31.7917, lon: -7.0926,  ndvi: 0.42, seasonal: 0.55, risk: 'medium' },
  { name: 'James Ochieng',    phone: '+254701234567', language: 'sw', country: 'Kenya',     crop: 'maize',   lat: -0.0236, lon: 37.9062,  ndvi: 0.61, seasonal: 0.58, risk: 'normal' },
  { name: 'Moussa Coulibaly', phone: '+22370123456',  language: 'fr', country: 'Mali',      crop: 'sorghum', lat: 12.6392, lon: -8.0029,  ndvi: 0.31, seasonal: 0.49, risk: 'high' },
  { name: 'Aisha Mohammed',   phone: '+251911234567', language: 'en', country: 'Ethiopia',  crop: 'maize',   lat: 9.1450,  lon: 40.4897,  ndvi: 0.55, seasonal: 0.52, risk: 'normal' },
  { name: 'Kwame Asante',     phone: '+233501234567', language: 'en', country: 'Ghana',     crop: 'cassava', lat: 7.9465,  lon: -1.0232,  ndvi: 0.48, seasonal: 0.60, risk: 'low' },
  { name: 'Halima Mwangi',    phone: '+255712345678', language: 'sw', country: 'Tanzania',  crop: 'maize',   lat: -6.3690, lon: 34.8888,  ndvi: 0.38, seasonal: 0.54, risk: 'high' },
  { name: 'Ibrahim Al-Sayed', phone: '+201001234567', language: 'ar', country: 'Egypt',     crop: 'wheat',   lat: 28.2,    lon: 30.8,     ndvi: 0.44, seasonal: 0.47, risk: 'low' },
] as const

async function main() {
  // Clear existing data (respect FK order)
  await prisma.payout.deleteMany()
  await prisma.alert.deleteMany()
  await prisma.ndviReading.deleteMany()
  await prisma.weatherReading.deleteMany()
  await prisma.farm.deleteMany()
  await prisma.farmer.deleteMany()

  for (const f of FARMERS) {
    const farmer = await prisma.farmer.create({
      data: { phoneNumber: f.phone, name: f.name, language: f.language },
    })

    const farm = await prisma.farm.create({
      data: {
        farmerId: farmer.id,
        name: `${f.name.split(' ')[0]}'s farm`,
        cropType: f.crop,
        latitude: f.lat,
        longitude: f.lon,
        country: f.country,
        areaHectares: 1.5,
      },
    })

    const anomaly = parseFloat((((f.ndvi - f.seasonal) / f.seasonal) * 100).toFixed(1))
    await prisma.ndviReading.create({
      data: {
        farmId: farm.id,
        ndviMean: f.ndvi,
        ndwiMean: f.ndvi > 0.45 ? 0.1 : -0.18,
        seasonalAverage: f.seasonal,
        anomalyPct: anomaly,
      },
    })

    await prisma.weatherReading.create({
      data: {
        farmId: farm.id,
        rainfallMm: f.risk === 'critical' ? 4.2 : f.risk === 'high' ? 9.1 : 22.4,
        tempMax: f.risk === 'critical' ? 38.5 : 29.2,
        tempMin: 18.0,
        forecast14dayMm: f.risk === 'critical' ? 8.1 : 32.0,
      },
    })

    if (f.risk === 'critical' || f.risk === 'high' || f.risk === 'medium') {
      const alert = await prisma.alert.create({
        data: {
          farmId: farm.id,
          alertType: 'drought',
          severity: f.risk,
          messageSent: true,
          messageText: `Demo alert for ${f.name}.`,
          whatsappStatus: 'delivered',
        },
      })

      if (f.risk === 'critical') {
        await prisma.payout.create({
          data: {
            farmId: farm.id,
            alertId: alert.id,
            amountUsd: 15,
            triggerReason: 'NDVI 45% below seasonal average, rainfall 4.2mm/week',
            ndviAtTrigger: f.ndvi,
            rainfallAtTrigger: 4.2,
            status: 'sent',
            mobileMoneyRef: 'AW-DEMO0001',
            method: 'M-Pesa (simulated)',
          },
        })
      }
    }
  }
  console.log('Seeded 8 farmers across 6 countries')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
