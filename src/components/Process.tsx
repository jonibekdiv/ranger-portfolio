import { useEffect, useRef } from 'react'
import { m } from 'framer-motion'
import { Code2, Lightbulb, PenTool, Rocket } from 'lucide-react'
import { ScrambleText, SectionReveal } from './Effects'
import { useI18n } from '../i18n'
import { ease, gsap } from '../lib/motion'

const icons = [Lightbulb, PenTool, Code2, Rocket]

/** "How I work": four steps joined by a red line that draws itself as you scroll. */
export default function Process() {
  const root = useRef<HTMLElement>(null)
  const p = useI18n().t.process

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-line-fill]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-steps]', start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
      })
      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
        gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 65%', toggleClass: { targets: step, className: 'is-on' } } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="process" data-bg="#090909" aria-labelledby="process-title" className="pad-x relative overflow-hidden py-28 lg:py-40">
      <SectionReveal />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-16 text-left lg:mb-24 lg:text-center">
          <span className="kicker"><ScrambleText text={p.kicker} /></span>
          <h2 id="process-title" className="h2 mt-5">
            {p.t1} <span className="text-neon text-glow">{p.t2a}</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg text-gray lg:mx-auto">{p.desc}</p>
        </div>

        <ol data-steps className="relative">
          {/* track + animated fill */}
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[23px] w-[2px] bg-white/10 lg:left-1/2 lg:-ml-px">
            <div data-line-fill className="h-full w-full origin-top bg-gradient-to-b from-neon via-[#ff6b6b] to-neon shadow-[0_0_16px_2px_rgba(255,32,32,.7)]" />
          </div>

          {p.steps.map((step, i) => {
            const Icon = icons[i]
            const right = i % 2 === 1
            return (
              <li key={i} data-step className="process-step relative grid grid-cols-[48px_1fr] gap-6 pb-14 last:pb-0 lg:grid-cols-[1fr_64px_1fr] lg:gap-10 lg:pb-20">
                <div className={`hidden lg:block ${right ? 'lg:order-1' : 'lg:order-3'}`} />
                <div className="relative z-[1] flex justify-center lg:order-2">
                  <span className="process-node grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-[#0e0e0e] text-gray lg:h-16 lg:w-16">
                    <Icon size={22} />
                  </span>
                </div>
                <m.div
                  initial={{ opacity: 0, x: right ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease }}
                  className={`glass process-card rounded-3xl p-6 sm:p-8 ${right ? 'lg:order-3' : 'lg:order-1 lg:text-right'}`}
                >
                  <span className="font-mono text-xs tracking-[.3em] text-neon">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 text-gray">{step.desc}</p>
                </m.div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
