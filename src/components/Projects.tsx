import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowUpRight, Maximize2 } from 'lucide-react'
import TiltCard from './TiltCard'
import ProjectModal from './ProjectModal'
import { GithubIcon } from './Icons'
import { projects, profile, type Project } from '../data/content'
import { useI18n } from '../i18n'
import { ScrambleText, SectionReveal } from './Effects'
import { ease, gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'

export function BotPreview({ big = false }: { big?: boolean }) {
  const msgs = [
    { me: false, t: "📚 Kutubxona24'ga xush kelibsiz! Kitob nomini yozing." },
    { me: true, t: "O'tkan kunlar" },
    { me: false, t: "Abdulla Qodiriy — O'tkan kunlar\n📄 PDF · 2.4 MB" },
  ]
  return (
    <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_20%_0,#1b3b56,#0b1622_70%)]">
      <div className={`grid w-[78%] gap-2 ${big ? 'text-base' : 'text-[13px]'}`}>
        <div className="mb-1 flex items-center gap-2 text-white/80">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2aabee] text-sm">📚</span>
          <span className="font-semibold">Kutubxona24 Bot</span>
        </div>
        {msgs.map((msg, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }}
            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-white ${msg.me ? 'justify-self-end rounded-br-sm bg-[#2b5278]' : 'rounded-bl-sm bg-[#1e2c3a]'}`}
          >
            {msg.t}
          </m.div>
        ))}
        <div className="flex w-max gap-1 rounded-2xl bg-[#1e2c3a] px-3 py-2.5">
          {[0, 1, 2].map((d) => (
            <m.i key={d} className="block h-1.5 w-1.5 rounded-full bg-[#8aa]" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ p, onOpen, wide }: { p: Project; onOpen: () => void; wide: boolean }) {
  const { t } = useI18n()
  const tx = t.projects.items[p.id]
  return (
    <article className={`project-card shrink-0 ${wide ? 'lg:w-[min(46vw,760px)]' : 'lg:w-[min(36vw,560px)]'} w-full`}>
      <TiltCard max={6} className="glass glow-border group relative overflow-hidden rounded-[28px]">
        <button
          type="button"
          onClick={onOpen}
          data-cursor="view"
          data-cursor-label={t.projects.openLabel}
          aria-label={t.projects.open(p.title)}
          className="relative block aspect-[16/10] w-full overflow-hidden lg:aspect-[16/8.5]"
        >
          {p.image ? (
            <img data-parallax src={p.image} alt={t.projects.shot(p.title)} loading="lazy" width={1280} height={800} className="h-[115%] w-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
          ) : (
            <BotPreview />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <span className="absolute top-5 left-5 font-display text-6xl font-black italic text-white/90 drop-shadow-[0_4px_20px_rgba(0,0,0,.8)]">{p.index}</span>
          <span className="glass absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full text-white transition-all duration-500 group-hover:rotate-90 group-hover:bg-neon">
            <Maximize2 size={18} />
          </span>
        </button>
        <div className="relative z-[2] p-6 sm:p-7">
          <p className="text-xs font-bold tracking-[.2em] text-neon uppercase">{tx.short}</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">{p.title}</h3>
          <p className="mt-3 line-clamp-2 text-gray">{tx.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.projects.tech}>
            {p.stack.slice(0, 4).map((s) => (
              <li key={s} className="rounded-full border border-neon/25 bg-neon/[.07] px-3 py-1 font-mono text-xs text-[#ffb3b3]">{s}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener" className="btn btn-red btn-sm">{t.projects.live} <ArrowUpRight /></a>
            )}
            <a href={p.repo} target="_blank" rel="noopener" className="btn btn-ghost btn-sm"><GithubIcon /> GitHub</a>
          </div>
        </div>
      </TiltCard>
    </article>
  )
}

export default function Projects({ ready }: { ready: boolean }) {
  const pt = useI18n().t.projects
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Project | null>(null)

  // Pinned horizontal gallery on large screens; normal vertical list elsewhere.
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      gsap.utils.toArray<HTMLElement>('[data-parallax]', el).forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
      })
      gsap.fromTo('[data-proj-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
    })
    mm.add('(max-width: 1023px)', () => {
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.from(card, { y: 80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%' } })
      })
    })
    // The pin is created after sections below it already set up their triggers:
    // re-order by page position and recalculate so later sections start at the right scroll offset.
    const id = window.setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh() }, 120)
    return () => { clearTimeout(id); mm.revert() }
  }, [ready])

  return (
    <section ref={root} id="projects" data-bg="#0b0303" aria-labelledby="projects-title" className="relative overflow-hidden py-28 lg:flex lg:h-[100svh] lg:items-center lg:py-0">
      <SectionReveal />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,32,32,.12),transparent_60%)]" />
      <div ref={track} className="pad-x relative flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12 lg:pr-[12vw]">
        <div className="shrink-0 lg:w-[min(34vw,520px)]">
          <m.span initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="kicker"><ScrambleText text={pt.kicker} /></m.span>
          <m.h2 id="projects-title" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.1 }} className="h2 mt-5">
            {pt.t1}<br />{pt.t2} <span className="text-neon text-glow">{pt.t2a}</span>
          </m.h2>
          <p className="mt-6 max-w-[36ch] text-gray">{pt.desc}</p>
          <a href={`${profile.github}?tab=repositories`} target="_blank" rel="noopener" className="btn btn-ghost btn-sm mt-8">{pt.all} <ArrowUpRight /></a>
        </div>
        {projects.map((p, i) => (
          <div key={p.id} className={`lg:pt-10 ${i % 2 ? 'lg:translate-y-8' : 'lg:-translate-y-2'}`}>
            <Card p={p} wide={i % 2 === 0} onOpen={() => setOpen(p)} />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="pad-x absolute inset-x-0 bottom-10 hidden lg:block">
        <div className="h-[2px] w-full overflow-hidden rounded bg-white/10">
          <div data-proj-progress className="h-full origin-left bg-neon shadow-[0_0_12px_#ff2020]" />
        </div>
      </div>

      <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}
