import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import { techIcons } from './Icons'
import { skills } from '../data/content'
import { ease, gsap } from '../lib/motion'

export default function Skills() {
  const root = useRef<HTMLElement>(null)

  // Animated typography: the heading words slide in from opposite sides as you scroll.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top 85%', end: 'top 25%', scrub: 1 }
      gsap.fromTo('[data-skill-l]', { xPercent: -30, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-skill-r]', { xPercent: 30, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [])

  const wall = [...skills, ...skills]

  return (
    <section ref={root} id="skills" data-bg="#050505" aria-labelledby="skills-title" className="relative overflow-hidden py-28 lg:py-40">
      {/* floating technology wall */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-10 opacity-[.07] [mask-image:linear-gradient(90deg,transparent,#000_20%,#000_80%,transparent)]">
        {[0, 1].map((row) => (
          <motion.div
            key={row}
            className="flex w-max gap-16"
            animate={{ x: row ? ['-50%', '0%'] : ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {wall.map((s, i) => (
              <div key={i} className="h-24 w-24 grayscale [&>svg]:h-full [&>svg]:w-full">{techIcons[s.id]}</div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="pad-x relative mx-auto max-w-[1440px]">
        <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="kicker">My skills</span>
            <h2 id="skills-title" className="h2 mt-5">
              <span data-skill-l className="block">Technologies</span>
              <span data-skill-r className="block">I Work <span className="text-neon text-glow">With</span></span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-gray">The tools I use every day to design, build and ship fast, animated interfaces.</p>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {skills.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease, delay: (i % 6) * 0.07 }}
            >
              <TiltCard max={14} className="group glass glow-border relative grid aspect-[1/1.05] place-content-center justify-items-center gap-4 rounded-3xl p-5 text-center transition-[scale,box-shadow] duration-500 hover:scale-[1.04] hover:shadow-[0_24px_60px_-18px_rgba(255,32,32,.6)]">
                <div className="relative z-[2] h-14 w-14 transition-transform duration-500 [transform:translateZ(40px)] group-hover:-translate-y-1 [&>svg]:h-full [&>svg]:w-full [&>svg]:drop-shadow-[0_8px_18px_rgba(0,0,0,.6)]">
                  {techIcons[s.id]}
                </div>
                <span className="relative z-[2] font-semibold text-white">{s.name}</span>
              </TiltCard>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
