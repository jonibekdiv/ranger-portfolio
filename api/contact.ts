/**
 * POST /api/contact
 * Sends a contact-form message to Jonibek's Telegram via a bot.
 *
 * Required environment variables (Vercel → Project → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN  – token from @BotFather
 *   TELEGRAM_CHAT_ID    – the chat that should receive messages (your own user id)
 */

declare const process: { env: Record<string, string | undefined> }

const LIMITS = { name: 80, email: 120, message: 2000 }
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Best-effort per-instance rate limit: 5 messages per IP per 10 minutes.
const hits = new Map<string, number[]>()
const WINDOW = 10 * 60 * 1000
function tooMany(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status })

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' })

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) return json(503, { error: 'The contact form is not configured yet.' })

    let data: Record<string, unknown>
    try {
      data = await request.json()
    } catch {
      return json(400, { error: 'Invalid request.' })
    }

    // Honeypot: real visitors never fill this hidden field.
    if (typeof data.website === 'string' && data.website.trim()) return json(200, { ok: true })

    const name = String(data.name ?? '').trim()
    const email = String(data.email ?? '').trim()
    const message = String(data.message ?? '').trim()
    if (name.length < 2 || name.length > LIMITS.name) return json(400, { error: 'Please enter your name.' })
    if (!emailRe.test(email) || email.length > LIMITS.email) return json(400, { error: 'Please enter a valid email.' })
    if (message.length < 10 || message.length > LIMITS.message) return json(400, { error: 'Message must be 10 to 2000 characters.' })

    const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
    if (tooMany(ip)) return json(429, { error: 'Too many messages. Please try again in a few minutes.' })

    const text =
      `📩 <b>New message from your portfolio</b>\n\n` +
      `<b>Name:</b> ${escape(name)}\n` +
      `<b>Email:</b> ${escape(email)}\n\n` +
      `${escape(message)}`

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true } }),
      })
      if (!res.ok) {
        console.error('Telegram API error', res.status, await res.text())
        return json(502, { error: 'Could not deliver the message. Please write on Telegram directly.' })
      }
    } catch (err) {
      console.error('Telegram request failed', err)
      return json(502, { error: 'Could not deliver the message. Please write on Telegram directly.' })
    }

    return json(200, { ok: true })
  },
}
