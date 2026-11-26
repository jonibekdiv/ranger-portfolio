import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Mail, MapPin } from 'lucide-react'
import Magnetic from './Magnetic'
import { GithubIcon, InstagramIcon, TelegramIcon } from './Icons'
import { profile } from '../data/content'
import { ease } from '../lib/motion'
import { useI18n } from '../i18n'
import { ScrambleText, SectionReveal } from './Effects'

type Field = 'name' | 'email' | 'message'
type ErrKey = 'errName' | 'errEmail' | 'errMessage'
type Errors = Partial<Record<Field, ErrKey>>
// Status keeps translation keys (not text) so it re-renders correctly when the language changes.
type Status = { kind: 'idle' } | { kind: 'ok' } | { kind: 'fix' } | { kind: 'server'; code: string }

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'errName'
  if (!emailRe.test(v.email.trim())) e.email = 'errEmail'
  if (v.message.trim().length < 10) e.message = 'errMessage'
  return e
}

export default function Contact() {
  const { t } = useI18n()
  const c = t.contact
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [sending, setSending] = useState(false)
  const [trap, setTrap] = useState('')

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value }
    setValues(next)
    if (touched) setErrors(validate(next))
  }

  /** Sends the message to /api/contact, which forwards it to Jonibek's Telegram bot. */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setTouched(true)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus({ kind: 'fix' })
      return
    }
    setSending(true)
    setStatus({ kind: 'idle' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website: trap }),
      })
      if (res.ok) {
        setStatus({ kind: 'ok' })
        setValues({ name: '', email: '', message: '' })
        setTouched(false)
        setErrors({})
      } else {
        setStatus({ kind: 'server', code: String(res.status) })
      }
    } catch {
      setStatus({ kind: 'server', code: 'offline' })
    } finally {
      setSending(false)
    }
  }

  const statusText =
    status.kind === 'ok' ? c.sent
    : status.kind === 'fix' ? c.fix
    : status.kind === 'server' ? `${c.server[status.code] ?? c.server.other} ${c.alt(profile.telegramUser)}`
    : ''

  const channels = [
    { href: profile.telegram, label: 'Telegram', value: `@${profile.telegramUser}`, Icon: TelegramIcon },
    { href: profile.github, label: 'GitHub', value: profile.githubHandle, Icon: GithubIcon },
    profile.instagram && { href: profile.instagram, label: 'Instagram', value: profile.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, ''), Icon: InstagramIcon },
    profile.email && { href: `mailto:${profile.email}`, label: 'Email', value: profile.email, Icon: (p: React.SVGProps<SVGSVGElement>) => <Mail {...(p as object)} /> },
  ].filter(Boolean) as { href: string; label: string; value: string; Icon: (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element }[]

  const field = (k: Field, label: string, type = 'text') => {
    const err = errors[k]
    const Tag = k === 'message' ? 'textarea' : 'input'
    return (
      <div className={`field ${err ? 'has-error' : ''}`}>
        <Tag
          id={`f-${k}`}
          name={k}
          type={k === 'message' ? undefined : type}
          placeholder=" "
          value={values[k]}
          onChange={set(k)}
          aria-invalid={!!err}
          aria-describedby={err ? `e-${k}` : undefined}
          autoComplete={k === 'name' ? 'name' : k === 'email' ? 'email' : 'off'}
          required
        />
        <label htmlFor={`f-${k}`}>{label}</label>
        <AnimatePresence>
          {err && (
            <m.span id={`e-${k}`} className="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{c[err]}</m.span>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <section id="contact" data-bg="#050505" aria-labelledby="contact-title" className="pad-x relative overflow-hidden py-28 lg:py-40">
      <SectionReveal />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,32,32,.22),transparent_60%)] blur-2xl" />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <m.span initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="kicker"><ScrambleText text={c.kicker} /></m.span>
          <h2 id="contact-title" className="mt-6 font-display text-[clamp(40px,6vw,100px)] leading-[.92] font-black tracking-[-.04em] text-white">
            {c.lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <m.span
                  className={`block ${i === 2 ? 'text-neon text-glow italic' : ''}`}
                  initial={{ y: '105%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 1, ease, delay: i * 0.1 }}
                >
                  {line}
                </m.span>
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg text-gray">{c.desc}</p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {channels.map(({ href, label, value, Icon }, i) => (
              <m.li key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: i * 0.08 }}>
                <a href={href} target="_blank" rel="noopener" className="glass group flex items-center gap-4 rounded-2xl p-4 transition hover:border-neon/50 hover:shadow-[0_0_40px_-10px_rgba(255,32,32,.6)]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-neon/10 text-neon transition group-hover:bg-neon group-hover:text-white"><Icon width={20} height={20} /></span>
                  <span><span className="block text-xs text-gray">{label}</span><span className="font-semibold text-white">{value}</span></span>
                </a>
              </m.li>
            ))}
            <li className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-neon/10 text-neon"><MapPin size={20} /></span>
              <span><span className="block text-xs text-gray">{c.location}</span><span className="font-semibold text-white">{c.country}</span></span>
            </li>
          </ul>
        </div>

        <m.form
          noValidate
          onSubmit={onSubmit}
          aria-label={c.form}
          className="glass glow-border is-on relative rounded-[32px] p-6 sm:p-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease }}
        >
          <div className="relative z-[2] grid gap-5">
            {/* Honeypot for spam bots: hidden from people and screen readers. */}
            <input
              type="text"
              name="website"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {field('name', c.name)}
              {field('email', c.email, 'email')}
            </div>
            {field('message', c.message)}
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <button type="submit" disabled={sending} aria-busy={sending} className="btn btn-red">
                  {sending ? (
                    <>{c.sending} <Loader2 className="animate-spin" /></>
                  ) : (
                    <>{c.send} <ArrowRight /></>
                  )}
                </button>
              </Magnetic>
              <p className="text-xs text-gray">{c.note}</p>
            </div>
            <div aria-live="polite" className="min-h-[24px]">
              <AnimatePresence mode="wait">
                {status.kind !== 'idle' && (
                  <m.p
                    key={statusText}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start gap-2 text-sm ${status.kind === 'ok' ? 'text-emerald-400' : 'text-[#ff6b6b]'}`}
                  >
                    {status.kind === 'ok' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                    {statusText}
                  </m.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </m.form>
      </div>
    </section>
  )
}
