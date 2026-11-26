import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle2, Mail, MapPin } from 'lucide-react'
import Magnetic from './Magnetic'
import { GithubIcon, InstagramIcon, TelegramIcon } from './Icons'
import { profile } from '../data/content'
import { ease } from '../lib/motion'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
type Status = { kind: 'idle' } | { kind: 'ok'; text: string } | { kind: 'error'; text: string }

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: { name: string; email: string; message: string }): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name (at least 2 characters).'
  if (!emailRe.test(v.email.trim())) e.email = 'Please enter a valid email, e.g. you@example.com.'
  if (v.message.trim().length < 10) e.message = 'Tell me a bit more (at least 10 characters).'
  return e
}

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value }
    setValues(next)
    if (touched) setErrors(validate(next))
  }

  /**
   * There is no backend, so the form hands the message to a real channel:
   * email (if configured) or Telegram, after copying the text to the clipboard.
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus({ kind: 'error', text: 'Please fix the highlighted fields.' })
      return
    }
    const body = `Hi Jonibek! I'm ${values.name.trim()} (${values.email.trim()}).\n\n${values.message.trim()}`
    if (profile.email) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('New project inquiry')}&body=${encodeURIComponent(body)}`
      setStatus({ kind: 'ok', text: 'Your email app is opening with the message ready to send.' })
      return
    }
    try {
      await navigator.clipboard.writeText(body)
      window.open(profile.telegram, '_blank', 'noopener')
      setStatus({ kind: 'ok', text: 'Message copied. Paste it into the Telegram chat that just opened and press send.' })
    } catch {
      setStatus({ kind: 'error', text: `Couldn't copy the message. Please write to me directly on Telegram: @${profile.telegramUser}.` })
    }
  }

  const channels = [
    { href: profile.telegram, label: 'Telegram', value: `@${profile.telegramUser}`, Icon: TelegramIcon },
    { href: profile.github, label: 'GitHub', value: profile.githubHandle, Icon: GithubIcon },
    profile.instagram && { href: profile.instagram, label: 'Instagram', value: profile.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, ''), Icon: InstagramIcon },
    profile.email && { href: `mailto:${profile.email}`, label: 'Email', value: profile.email, Icon: (p: React.SVGProps<SVGSVGElement>) => <Mail {...(p as object)} /> },
  ].filter(Boolean) as { href: string; label: string; value: string; Icon: (p: React.SVGProps<SVGSVGElement>) => React.JSX.Element }[]

  const field = (k: keyof typeof values, label: string, type = 'text') => {
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
            <m.span id={`e-${k}`} className="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{err}</m.span>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <section id="contact" data-bg="#050505" aria-labelledby="contact-title" className="pad-x relative overflow-hidden py-28 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,32,32,.22),transparent_60%)] blur-2xl" />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <m.span initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="kicker">Contact</m.span>
          <h2 id="contact-title" className="mt-6 font-display text-[clamp(44px,6.4vw,104px)] leading-[.9] font-black tracking-[-.04em] text-white">
            {["LET'S BUILD", 'SOMETHING', 'AMAZING.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
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
          <p className="mt-6 max-w-[40ch] text-lg text-gray">Have an interesting idea? Let's turn it into reality.</p>

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
              <span><span className="block text-xs text-gray">Location</span><span className="font-semibold text-white">{profile.country}</span></span>
            </li>
          </ul>
        </div>

        <m.form
          noValidate
          onSubmit={onSubmit}
          aria-label="Contact form"
          className="glass glow-border is-on relative rounded-[32px] p-6 sm:p-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease }}
        >
          <div className="relative z-[2] grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {field('name', 'Your name')}
              {field('email', 'Your email', 'email')}
            </div>
            {field('message', 'Tell me about your project')}
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <button type="submit" className="btn btn-red">Send message <ArrowRight /></button>
              </Magnetic>
              <p className="text-xs text-gray">{profile.email ? 'Opens your email app.' : 'Sends via Telegram.'}</p>
            </div>
            <div aria-live="polite" className="min-h-[24px]">
              <AnimatePresence mode="wait">
                {status.kind !== 'idle' && (
                  <m.p
                    key={status.text}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start gap-2 text-sm ${status.kind === 'ok' ? 'text-emerald-400' : 'text-[#ff6b6b]'}`}
                  >
                    {status.kind === 'ok' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                    {status.text}
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
