import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import SplitText from './SplitText'
import Magnetic from './Magnetic'
import WorkspaceFallback from './WorkspaceFallback'
import { GithubIcon, TelegramIcon } from './Icons'
import { profile } from '../data/content'
import { useI18n } from '../i18n'
import { canRender3D, ease, gsap, prefersReducedMotion, scrollToId } from '../lib/motion'
import { ScrambleText } from './Effects'

const Workspace3D = lazy(() => import('./Workspace3D'))

/** If WebGL fails at runtime (driver, lost context, chunk error), show the CSS scene instead. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [use3D] = useState(canRender3D)
  const { t } = useI18n()
  // Start the periodic glitch once the letter-by-letter intro has finished.
  const [glitch, setGlitch] = useState(false)
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const id = window.setTimeout(() => setGlitch(true), 1900)
    return () => clearTimeout(id)
  }, [ready])
  const up = (d: number) => ({
    initial: { opacity: 0, y: 30, filter: 'blur(6px)' },
    animate: ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 1, ease, delay: d },
  })

  // Cinematic scroll-out: copy lifts and fades, scene sinks, giant outline word drifts.
  useEffect(() => {
    if (!ready || !root.current) return
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('[data-hero-copy]', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-hero-scene]', { yPercent: 0, scale: 1, opacity: 1 }, { yPercent: 12, scale: 0.92, opacity: 0.25, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-hero-word]', { xPercent: 0 }, { xPercent: -25, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section ref={root} id="home" data-bg="#050505" aria-label={t.hero.aria} className="pad-x relative flex min-h-[100svh] items-center overflow-hidden pt-20 pb-20 lg:pt-28">
      {/* atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[480px] w-[560px] rounded-full border border-neon/50 bg-[radial-gradient(circle_at_70%_70%,#2a0000,#080000_70%)] shadow-[0_0_80px_rgba(255,32,32,.25)]" />
        <div className="absolute right-[-10%] top-[10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse,rgba(255,32,32,.18),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,#000_30%,transparent_75%)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs><filter id="hero-blur"><feGaussianBlur stdDeviation="8" /></filter></defs>
          {[{ f: 'url(#hero-blur)', w: 10, o: 0.5 }, { f: undefined, w: 2, o: 1 }].map((p, i) => (
            <m.path
              key={i}
              d="M-40 640 C 320 800, 780 790, 1480 580"
              fill="none"
              stroke="#ff2020"
              strokeWidth={p.w}
              opacity={p.o}
              filter={p.f}
              initial={{ pathLength: 0 }}
              animate={ready ? { pathLength: 1 } : {}}
              transition={{ duration: 2.2, ease, delay: 0.4 }}
            />
          ))}
        </svg>
        <div data-hero-word className="outline-text absolute bottom-[6%] left-[-2%] select-none font-display text-[22vw] leading-none font-black italic whitespace-nowrap">
          RANGER RANGER
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-2 sm:gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div data-hero-copy>
          <m.div {...up(0.1)} className="glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] font-bold tracking-[.22em] text-white">
            <span className="pulse-dot" /> {t.hero.badge}
          </m.div>

          <m.p {...up(0.25)} className="mt-5 font-display text-lg font-bold sm:mt-7 tracking-[.08em] text-white/90 sm:text-xl">
            <ScrambleText text={t.hero.hello} play={ready} delay={0.35} />
          </m.p>

          <h1 className="mt-1 font-display text-[clamp(76px,10.5vw,190px)] leading-[.82] font-black italic tracking-[-.04em] text-neon text-glow">
            <span className={`glitch ${glitch ? 'is-live' : ''}`} data-text="RANGER">
              <SplitText text="RANGER" delay={0.45} stagger={0.06} play={ready} />
            </span>
          </h1>

          <m.p {...up(0.9)} className="mt-6 font-display text-base font-bold tracking-[.12em] text-white sm:text-lg">
            {t.hero.role1} <span className="text-neon">&amp;</span> {t.hero.role2}
          </m.p>
          <m.p {...up(1)} className="mt-3 max-w-[44ch] text-lg leading-relaxed text-gray">
            {t.hero.desc}
          </m.p>

          <m.div {...up(1.1)} className="mt-9 flex flex-wrap gap-4">
            <Magnetic>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects') }} className="btn btn-red">
                {t.hero.explore} <ArrowRight />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact') }} className="btn btn-ghost">
                {t.hero.contact} <Mail />
              </a>
            </Magnetic>
          </m.div>

          <m.div {...up(1.2)} className="mt-9 flex gap-3">
            <a href={profile.telegram} target="_blank" rel="noopener" aria-label="Telegram" className="icon-btn glass"><TelegramIcon /></a>
            <a href={profile.github} target="_blank" rel="noopener" aria-label="GitHub" className="icon-btn glass"><GithubIcon /></a>
          </m.div>
        </div>

        <m.div
          className="relative order-first -mx-4 h-[240px] w-[calc(100%+2rem)] sm:mx-0 sm:h-[340px] sm:w-full lg:order-none lg:h-[min(62vh,620px)] lg:min-h-[340px]"
          initial={{ opacity: 0, scale: 0.94, x: 60 }}
          animate={ready ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ duration: 1.4, ease, delay: 0.35 }}
        >
          {/* GSAP scroll effects live on this inner wrapper so they never fight the entrance animation. */}
          <div data-hero-scene className="h-full w-full">
            {use3D ? (
              // Mount the WebGL scene only after the first paint so it doesn't compete with the hero text.
              ready && (
                <SceneBoundary fallback={<div className="flex h-full items-center"><WorkspaceFallback /></div>}>
                  <Suspense fallback={null}>
                    <Workspace3D />
                  </Suspense>
                </SceneBoundary>
              )
            ) : (
              <div className="flex h-full items-center"><WorkspaceFallback /></div>
            )}
          </div>
        </m.div>
      </div>

      <m.a
        href="#about"
        onClick={(e) => { e.preventDefault(); scrollToId('about') }}
        aria-label={t.hero.scroll}
        className="absolute bottom-7 left-1/2 z-10 hidden h-11 w-7 -translate-x-1/2 rounded-full border-2 border-white/30 md:block"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
      >
        <m.span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded bg-neon" animate={{ y: [0, 14], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} />
      </m.a>
    </section>
  )
}
