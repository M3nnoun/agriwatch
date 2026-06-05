import Anthropic from '@anthropic-ai/sdk'
import type { RiskScore, SatelliteReading, WeatherData } from './types'

// Current, non-deprecated Sonnet. Override with ANTHROPIC_MODEL if needed.
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6'

const SYSTEM = `You are AgriWatch, an AI assistant helping smallholder farmers understand climate risks.
- Warm, respectful tone — like a trusted local advisor
- Simple language for rural communities
- Exactly 3 numbered action steps specific to their crop
- Never use "NDVI", "anomaly score", or "parametric" — translate everything to plain language
- Under 280 words, WhatsApp-friendly line breaks`

const LANGS: Record<string, string> = { ar: 'Arabic', sw: 'Swahili', fr: 'French', en: 'English' }

function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim())
}

// Lazily construct the client so a missing key never throws at import time.
let client: Anthropic | null = null
function getClient(): Anthropic {
  if (!client) client = new Anthropic()
  return client
}

export async function* generateAlertMessageStream(p: {
  farmerName: string
  cropType: string
  risk: RiskScore
  sat: SatelliteReading
  weather: WeatherData
  hasInsurance: boolean
  language: string
}): AsyncGenerator<string> {
  const lang = LANGS[p.language] ?? 'English'

  // No key configured → stream a localized canned alert so the demo still works.
  if (!hasApiKey()) {
    yield* streamText(fallbackAlert(p))
    return
  }

  try {
    const stream = await getClient().messages.create({
      model: MODEL,
      max_tokens: 600,
      system: SYSTEM,
      stream: true,
      messages: [
        {
          role: 'user',
          content: `Write a WhatsApp alert in ${lang} only.
Farmer: ${p.farmerName} | Crop: ${p.cropType} | Risk: ${p.risk.level.toUpperCase()}
Issues: ${p.risk.reasons.join('; ')}
Crop health: ${Math.abs(p.risk.ndviAnomalyPct).toFixed(0)}% below normal
Rainfall this week: ${p.weather.rainfallMm7day.toFixed(1)}mm
Forecast 14 days: ${p.weather.rainfallMm14dayForecast.toFixed(1)}mm
Insurance: ${p.hasInsurance ? 'ACTIVE — auto-payout will trigger if drought confirmed' : 'No coverage'}
Structure: 1-line alert, explanation, 3 actions, insurance status, closing. ${lang} only.`,
        },
      ],
    })
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text
      }
    }
  } catch (err) {
    // Live call failed (bad key, rate limit, network) → degrade gracefully.
    console.error('[advisory] live generation failed, using fallback:', err)
    yield* streamText(fallbackAlert(p))
  }
}

export async function generateWelcomeMessage(
  name: string,
  crop: string,
  lang: string
): Promise<string> {
  if (!hasApiKey()) return fallbackWelcome(name, crop, lang)
  try {
    const res = await getClient().messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Welcome WhatsApp message in ${LANGS[lang] ?? 'English'} for ${name} growing ${crop}.
      Tell them: farm monitored from space, alerts when at risk, 30-day free insurance, reply with questions.
      Under 120 words. ${LANGS[lang] ?? 'English'} only.`,
        },
      ],
    })
    const block = res.content[0]
    return block.type === 'text' ? block.text : fallbackWelcome(name, crop, lang)
  } catch (err) {
    console.error('[advisory] welcome generation failed, using fallback:', err)
    return fallbackWelcome(name, crop, lang)
  }
}

// --- Streamed fallback (no API key required) --------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Emit text token-by-token so the fallback feels identical to the live stream.
async function* streamText(text: string): AsyncGenerator<string> {
  const tokens = text.match(/\S+\s*/g) ?? [text]
  for (const t of tokens) {
    yield t
    await delay(22)
  }
}

function fallbackAlert(p: {
  farmerName: string
  cropType: string
  weather: WeatherData
  language: string
}): string {
  const name = p.farmerName.split(' ')[0]
  const crop = p.cropType
  const rain = p.weather.rainfallMm7day.toFixed(1)
  const fc = p.weather.rainfallMm14dayForecast.toFixed(1)
  const lang = p.language
  const templates: Record<string, string> = {
    en: `⚠️ Drought alert for your ${crop} farm, ${name}.

Your crops are showing signs of stress and rainfall has been very low (${rain}mm this week, only ${fc}mm expected over the next 14 days).

What to do now:
1. Water your ${crop} early morning or evening to reduce water loss.
2. Add mulch around the plants to keep moisture in the soil.
3. Hold off on fertilizer until the rains return.

✅ Your insurance is active — if the drought is confirmed, a payout is sent to your phone automatically.

We are watching your fields and we are with you. — AgriWatch`,

    fr: `⚠️ Alerte sécheresse pour votre champ de ${crop}, ${name}.

Vos cultures montrent des signes de stress et les pluies sont très faibles (${rain}mm cette semaine, seulement ${fc}mm prévus sur 14 jours).

À faire maintenant :
1. Arrosez votre ${crop} tôt le matin ou le soir pour limiter les pertes.
2. Ajoutez du paillage autour des plantes pour garder l'humidité du sol.
3. Attendez le retour de la pluie avant de mettre de l'engrais.

✅ Votre assurance est active — si la sécheresse est confirmée, un versement est envoyé automatiquement sur votre téléphone.

Nous surveillons vos champs et nous sommes avec vous. — AgriWatch`,

    sw: `⚠️ Tahadhari ya ukame kwa shamba lako la ${crop}, ${name}.

Mazao yako yanaonyesha dalili za mkazo na mvua imekuwa ndogo sana (${rain}mm wiki hii, ${fc}mm pekee zinatarajiwa kwa siku 14 zijazo).

Fanya sasa:
1. Mwagilia ${crop} asubuhi mapema au jioni kupunguza upotevu wa maji.
2. Weka matandazo kuzunguka mimea ili kuhifadhi unyevu wa udongo.
3. Subiri mvua irudi kabla ya kuweka mbolea.

✅ Bima yako iko hai — ukame ukithibitishwa, malipo yatatumwa kwenye simu yako moja kwa moja.

Tunalinda mashamba yako na tuko pamoja nawe. — AgriWatch`,

    ar: `⚠️ تنبيه جفاف لحقل ${crop} الخاص بك يا ${name}.

تُظهر محاصيلك علامات إجهاد والأمطار قليلة جداً (${rain} ملم هذا الأسبوع، ويُتوقع ${fc} ملم فقط خلال 14 يوماً).

ما العمل الآن:
1. اسقِ ${crop} في الصباح الباكر أو المساء لتقليل فقد الماء.
2. ضع غطاءً نباتياً حول النباتات للحفاظ على رطوبة التربة.
3. أجّل إضافة السماد حتى عودة المطر.

✅ تأمينك فعّال — في حال تأكُّد الجفاف، يُرسَل التعويض إلى هاتفك تلقائياً.

نحن نراقب حقولك ونقف إلى جانبك. — AgriWatch`,
  }
  return templates[lang] ?? templates.en
}

function fallbackWelcome(name: string, crop: string, lang: string): string {
  const first = name.split(' ')[0]
  const templates: Record<string, string> = {
    en: `Hello ${first}! Welcome to AgriWatch. We now watch your ${crop} from space and will warn you the moment drought risk rises. You have 30 days of free insurance — if a drought is confirmed, a payout reaches your phone automatically. Reply any time with questions. 🌍`,
    fr: `Bonjour ${first} ! Bienvenue sur AgriWatch. Nous surveillons désormais votre ${crop} depuis l'espace et vous alerterons dès que le risque de sécheresse augmente. Vous avez 30 jours d'assurance gratuite — en cas de sécheresse confirmée, un versement arrive automatiquement sur votre téléphone. Répondez à tout moment. 🌍`,
    sw: `Habari ${first}! Karibu AgriWatch. Sasa tunalinda ${crop} yako kutoka angani na tutakuonya pindi hatari ya ukame inapoongezeka. Una siku 30 za bima bure — ukame ukithibitishwa, malipo hufika kwenye simu yako moja kwa moja. Jibu wakati wowote ukiwa na maswali. 🌍`,
    ar: `مرحباً ${first}! أهلاً بك في AgriWatch. نحن الآن نراقب ${crop} الخاص بك من الفضاء وسننبهك فور ارتفاع خطر الجفاف. لديك 30 يوماً من التأمين المجاني — وعند تأكُّد الجفاف يصل التعويض إلى هاتفك تلقائياً. راسلنا في أي وقت. 🌍`,
  }
  return templates[lang] ?? templates.en
}
