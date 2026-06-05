import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateWelcomeMessage } from '@/lib/advisory'

export const dynamic = 'force-dynamic'

/**
 * Twilio WhatsApp inbound webhook.
 * Twilio posts application/x-www-form-urlencoded with `From` and `Body`.
 * We respond with TwiML <Message> for the reply.
 *
 * Minimal onboarding flow:
 *   - Unknown number  -> ask for name + crop ("name, crop")
 *   - Known number    -> acknowledge / generate a welcome
 */
function twiml(message: string): Response {
  const body = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(
    message
  )}</Message></Response>`
  return new Response(body, { headers: { 'Content-Type': 'text/xml' } })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const from = String(form.get('From') ?? '').replace('whatsapp:', '')
  const text = String(form.get('Body') ?? '').trim()

  if (!from) {
    return twiml('Sorry, we could not read your number. Please try again.')
  }

  const existing = await prisma.farmer.findUnique({
    where: { phoneNumber: from },
    include: { farms: true },
  })

  if (existing) {
    return twiml(
      `Welcome back, ${existing.name}! AgriWatch is monitoring your ${
        existing.farms[0]?.cropType ?? 'farm'
      } from space. We'll alert you the moment drought risk rises. Reply HELP for options.`
    )
  }

  // New farmer onboarding: expect "Name, crop"
  const parts = text.split(',').map((p) => p.trim())
  if (parts.length >= 2 && parts[0]) {
    const [name, cropRaw] = parts
    const validCrops = ['maize', 'wheat', 'sorghum', 'millet', 'cassava', 'other']
    const crop = validCrops.includes(cropRaw.toLowerCase()) ? cropRaw.toLowerCase() : 'other'

    const farmer = await prisma.farmer.create({
      data: {
        phoneNumber: from,
        name,
        language: 'en',
        farms: {
          create: {
            name: `${name.split(' ')[0]}'s farm`,
            cropType: crop as 'maize',
            latitude: 0,
            longitude: 0,
            country: 'Unknown',
          },
        },
      },
    })

    let welcome = `Hello ${farmer.name}! You're registered with AgriWatch. We'll watch your ${crop} from space and warn you before drought hits. You have 30 days free insurance.`
    try {
      if (process.env.ANTHROPIC_API_KEY) {
        welcome = await generateWelcomeMessage(farmer.name, crop, 'en')
      }
    } catch {
      // fall back to the static welcome on any API error
    }
    return twiml(welcome)
  }

  return twiml(
    'Welcome to AgriWatch! To register, reply with your name and crop, e.g. "Amara Diallo, millet".'
  )
}
