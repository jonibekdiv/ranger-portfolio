import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import SplitText from './SplitText'
import Magnetic from './Magnetic'
import WorkspaceFallback from './WorkspaceFallback'
import { GithubIcon, TelegramIcon } from './Icons'
import { profile } from '../data/content'
import { canRender3D, ease, gsap, scrollToId } from '../lib/motion'

const Workspace3D = lazy(() => import('./Workspace3D'))

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [use3D] = useState(canRender3D)
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
      gsap.to('[data-hero-scene]', { yPercent: 12, scale: 0.92, opacity: 0.25, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-hero-word]', { xPercent: 0 }, { xPercent: -25, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section ref={root} id="home" data-bg="#050505" aria-label="Introduction" className="pad-x relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      {/* atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[480px] w-[560px] rounded-full border border-neon/50 bg-[radial-gradient(circle_at_70%_70%,#2a0000,#080000_70%)] shadow-[0_0_80px_rgba(255,32,32,.25)]" />
        <div className="absolute right-[-10%] top-[10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse,rgba(255,32,32,.18),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,#000_30%,transparent_75%)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs><filter id="hero-blur"><feGaussianBlur stdDeviation="8" /></filter></defs>
          {[{ f: 'url(#hero-blur)', w: 10, o: 0.5 }, { f: undefined, w: 2, o: 1 }].map((p, i) => (
            <motion.path
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

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div data-hero-copy>
          <motion.div {...up(0.1)} className="glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] font-bold tracking-[.22em] text-white">
            <span className="pulse-dot" /> AVAILABLE FOR PROJECTS
          </motion.div>

          <motion.p {...up(0.25)} className="mt-7 font-display text-lg font-bold tracking-[.08em] text-white/90 sm:text-xl">
            HELLO, I'M JONIBEK.
          </motion.p>

          <h1 className="mt-1 font-display text-[clamp(76px,10.5vw,190px)] leading-[.82] font-black italic tracking-[-.04em] text-neon text-glow">
            <SplitText text="RANGER" delay={0.45} stagger={0.06} play={ready} />
          </h1>

          <motion.p {...up(0.9)} className="mt-6 font-display text-base font-bold tracking-[.12em] text-white sm:text-lg">
            FRONTEND DEVELOPER <span className="text-neon">&amp;</span> CREATIVE WEB DESIGNER
          </motion.p>
          <motion.p {...up(1)} className="mt-3 max-w-[44ch] text-lg leading-relaxed text-gray">
            I build modern, interactive and beautiful digital experiences.
          </motion.p>

          <motion.div {...up(1.1)} className="mt-9 flex flex-wrap gap-4">
            <Magnetic>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects') }} className="btn btn-red">
                Explore my work <ArrowRight />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact') }} className="btn btn-ghost">
                Contact me <Mail />
              </a>
            </Magnetic>
          </motion.div>

          <motion.div {...up(1.2)} className="mt-9 flex gap-3">
            <a href={profile.telegram} target="_blank" rel="noopener" aria-label="Telegram" className="icon-btn glass"><TelegramIcon /></a>
            <a href={profile.github} target="_blank" rel="noopener" aria-label="GitHub" className="icon-btn glass"><GithubIcon /></a>
          </motion.div>
        </div>

        <motion.div
          data-hero-scene
          className="relative h-[min(62vh,620px)] min-h-[340px] w-full"
          initial={{ opacity: 0, scale: 0.94, x: 60 }}
          animate={ready ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ duration: 1.4, ease, delay: 0.35 }}
        >
          {use3D ? (
            <Suspense fallback={<WorkspaceFallback />}>
              <Workspace3D />
            </Suspense>
          ) : (
            <div className="flex h-full items-center"><WorkspaceFallback /></div>
          )}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        onClick={(e) => { e.preventDefault(); scrollToId('about') }}
        aria-label="Scroll to About"
        className="absolute bottom-7 left-1/2 z-10 hidden h-11 w-7 -translate-x-1/2 rounded-full border-2 border-white/30 md:block"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
      >
        <motion.span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded bg-neon" animate={{ y: [0, 14], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} />
      </motion.a>
    </section>
  )
}
