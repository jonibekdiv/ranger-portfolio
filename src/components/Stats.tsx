import { useEffect, useRef, useState } from 'react'
import { skills } from '../data/content'
import { useI18n } from '../i18n'
import { prefersReducedMotion } from '../lib/motion'

/** Counts from 0 to `to` once the number scrolls into view. */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) { setValue(to); return }
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const dur = 1800
      const tick = (now: number) => {
        const k = Math.min((now - start) / dur, 1)
        setValue(Math.round(to * (1 - Math.pow(1 - k, 4))))
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to])

  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      <span aria-hidden="true">{value}</span>
      {suffix && <span aria-hidden="true" className="text-neon">{suffix}</span>}
    </span>
  )
}

export default function Stats() {
  const s = useI18n().t.stats
  // Real numbers only: public GitHub repositories, listed skills, platforms covered.
  const items = [
    { to: 32, suffix: '+', label: s.projects },
    { to: skills.length, label: s.tech },
    { to: 3, label: s.platforms },
  ]
  return (
    <dl className="relative mx-auto mt-16 grid max-w-[1440px] grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:mt-28">
      {items.map((it) => (
        <div key={it.label} className="group relative flex flex-col bg-[#0b0b0b] px-3 py-6 text-center transition-colors duration-500 hover:bg-[#120606] sm:px-8 sm:py-10 sm:text-left">
          <dt className="order-2 mt-2 text-[11px] leading-snug text-gray sm:mt-3 sm:text-sm">{it.label}</dt>
          <dd className="font-display text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            <Counter to={it.to} suffix={it.suffix} />
          </dd>
          <span aria-hidden="true" className="absolute inset-x-8 bottom-0 h-[2px] origin-left scale-x-0 bg-neon shadow-[0_0_12px_#ff2020] transition-transform duration-700 group-hover:scale-x-100" />
        </div>
      ))}
    </dl>
  )
}
