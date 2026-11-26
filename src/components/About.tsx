import { useEffect, useRef } from 'react'
import { m } from 'framer-motion'
import { Code2, Flag, MapPin, Sparkles, User } from 'lucide-react'
import TiltCard from './TiltCard'
import { profile } from '../data/content'
import { ease, gsap } from '../lib/motion'

const info = [
  { icon: User, label: 'Name', value: profile.name },
  { icon: Code2, label: 'Role', value: profile.role },
  { icon: MapPin, label: 'Country', value: profile.country },
  { icon: Sparkles, label: 'Specialty', value: 'Web Development' },
  { icon: Flag, label: 'Brand', value: profile.brand },
]

const chips = [
  { text: '<div />', cls: 'left-[2%] top-[8%]', depth: -60 },
  { text: 'useState()', cls: 'right-[0%] top-[18%]', depth: 40 },
  { text: '{ }', cls: 'left-[8%] bottom-[14%]', depth: 70 },
  { text: 'npm run dev', cls: 'right-[6%] bottom-[6%]', depth: -40 },
]

const reveal = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
}

export default function About() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((el) => {
        gsap.fromTo(el, { y: -Number(el.dataset.depth) }, { y: Number(el.dataset.depth), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.fromTo('[data-about-word]', { xPercent: 10 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="about" data-bg="#090909" aria-labelledby="about-title" className="pad-x relative overflow-hidden py-28 lg:py-40">
      <div data-about-word aria-hidden="true" className="outline-text pointer-events-none absolute top-10 left-0 font-display text-[18vw] leading-none font-black whitespace-nowrap select-none">
        ABOUT ME · ABOUT ME
      </div>

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[1.05fr_1fr_.8fr]">
        <div>
          <m.span {...reveal} transition={{ duration: 0.8, ease }} className="kicker">About me</m.span>
          <m.h2 id="about-title" {...reveal} transition={{ duration: 0.9, ease, delay: 0.1 }} className="h2 mt-5">
            Turning Ideas<br />Into <span className="text-neon text-glow">Reality</span>
          </m.h2>
          <m.p {...reveal} transition={{ duration: 0.9, ease, delay: 0.2 }} className="mt-6 max-w-[46ch] text-lg leading-relaxed text-gray">
            I'm Jonibek, a Frontend Developer from Uzbekistan. I enjoy transforming creative ideas into modern digital experiences. I'm constantly learning new technologies and improving my development skills.
          </m.p>
        </div>

        {/* laptop */}
        <m.div
          className="relative mx-auto w-full max-w-[520px]"
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease }}
          aria-hidden="true"
        >
          <div className="absolute inset-[18%_8%] rounded-full bg-[radial-gradient(ellipse,rgba(255,32,32,.4),transparent_65%)] blur-2xl" />
          <m.svg viewBox="0 0 520 380" className="relative w-full" animate={{ y: [0, -12, 0], rotate: [0, -1, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
            <defs>
              <linearGradient id="lt-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5b5b5f" /><stop offset="1" stopColor="#1d1d20" /></linearGradient>
              <linearGradient id="lt-screen" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#1a0505" /><stop offset="1" stopColor="#050000" /></linearGradient>
              <filter id="lt-neon" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <ellipse className="ring" cx="260" cy="230" rx="235" ry="70" opacity=".5" />
            <path d="M150 40 380 62 352 250 120 236z" fill="#2a2a2e" />
            <path d="M158 50 370 70 345 241 129 228z" fill="url(#lt-screen)" />
            <g filter="url(#lt-neon)" fill="none" stroke="#ff2323" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
              {['M222 120 190 148l28 30', 'M292 128l30 30-32 28', 'M268 110 242 194'].map((d, i) => (
                <m.path key={d} d={d} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease, delay: 0.5 + i * 0.25 }} />
              ))}
            </g>
            <path d="M120 236 352 250 470 302 205 330z" fill="url(#lt-body)" />
            <path d="M150 248 343 260 430 297 214 318z" fill="#151517" />
            <g fill="#2b2b2f"><path d="M160 254l180 11 6 4-182-11z" /><path d="M168 264l184 12 8 5-186-12z" /><path d="M178 275l188 12 10 6-190-12z" /><path d="M190 287l192 13 12 7-196-13z" /></g>
            <path d="M205 330 470 302 472 308 207 337z" fill="#0d0d0f" />
            <path className="ring" d="M25 230a235 70 0 0 0 470 0" />
            <path className="ring-spark" pathLength={1} d="M25 230a235 70 0 0 0 470 0" />
          </m.svg>
          {chips.map((c) => (
            <div key={c.text} data-depth={c.depth} className={`glass absolute ${c.cls} rounded-xl px-3 py-1.5 font-mono text-xs text-[#ffb3b3] shadow-[0_10px_30px_rgba(0,0,0,.5)]`}>
              {c.text}
            </div>
          ))}
        </m.div>

        {/* info cards */}
        <TiltCard max={8} className="glass glow-border is-on relative rounded-3xl p-6">
          <div className="relative z-[2] flex items-center gap-4 border-b border-white/10 pb-5">
            <img src="/img/avatar.webp" alt="Portrait of Jonibek" width={64} height={64} loading="lazy" className="h-16 w-16 rounded-full border-2 border-neon object-cover shadow-[0_0_24px_rgba(255,32,32,.5)]" />
            <div>
              <p className="font-display text-lg font-bold text-white">Jonibek</p>
              <p className="text-sm text-gray">aka <span className="text-neon">Ranger</span></p>
            </div>
          </div>
          <ul className="relative z-[2] mt-2">
            {info.map(({ icon: Icon, label, value }, i) => (
              <m.li
                key={label}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-4 py-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon"><Icon size={19} /></span>
                <div>
                  <p className="text-xs text-gray">{label}</p>
                  <p className="font-semibold text-white">{value}</p>
                </div>
              </m.li>
            ))}
          </ul>
        </TiltCard>
      </div>
    </section>
  )
}
