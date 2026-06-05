import twilio from 'twilio'

export interface WhatsAppResult {
  status: string
  sid?: string
  to: string
  simulated: boolean
}

/**
 * Send a WhatsApp message via Twilio. In DEMO_MODE (or when Twilio
 * credentials are missing) this returns a simulated "delivered" status so
 * the entire flow works offline with only ANTHROPIC_API_KEY configured.
 */
export async function sendWhatsApp(to: string, body: string): Promise<WhatsAppResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_NUMBER

  if (process.env.DEMO_MODE === 'true' || !sid || !token || !from) {
    void body
    return { status: 'delivered', to, simulated: true }
  }

  const client = twilio(sid, token)
  const msg = await client.messages.create({
    from,
    to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    body,
  })

  return { status: msg.status, sid: msg.sid, to, simulated: false }
}
