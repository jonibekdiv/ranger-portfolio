import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from './Icons'
import { navItems, profile } from '../data/content'
import { ease, lockScroll, scrollToId } from '../lib/motion'

export default function Nav({ ready }: { ready: boolean }) {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navItems.forEach(({ id }) => { const el = document.getElementById(id); if (el) io.observe(el) })
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => { lockScroll(open) }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    window.setTimeout(() => scrollToId(id), open ? 350 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Main"
          className={`flex w-full max-w-[1320px] items-center justify-between gap-4 rounded-full py-2 pr-2 pl-5 transition-all duration-500 ${
            scrolled || open ? 'glass shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)]' : 'border border-transparent'
          }`}
        >
          <a href="#home" onClick={go('home')} className="group flex items-center gap-2.5" aria-label="Ranger вЂ” back to top">
            <Logo className="h-8 w-8 text-neon drop-shadow-[0_0_10px_rgba(255,32,32,.6)] transition-transform duration-500 group-hover:-rotate-12" />
            <span className="font-display text-xl font-black italic tracking-tight text-white">RANGER</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  aria-current={active === id ? 'true' : undefined}
                  className={`relative block px-4 py-2.5 text-sm font-semibold transition-colors ${active === id ? 'text-white' : 'text-gray hover:text-white'}`}
                >
                  {label}
                  {active === id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded bg-neon shadow-[0_0_12px_#ff2020]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href={profile.telegram} target="_blank" rel="noopener" className="btn btn-red btn-sm hidden sm:inline-flex">
              Hire me <ArrowUpRight />
            </a>
            <button
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <motion.span className="absolute h-[2px] w-5 rounded bg-white" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} transition={{ duration: 0.4, ease }} />
              <motion.span className="absolute h-[2px] w-5 rounded bg-neon" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} transition={{ duration: 0.4, ease }} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[70] flex flex-col justify-center bg-black/95 px-8 backdrop-blur-xl md:hidden"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease }}
          >
            <ul className="space-y-2">
              {navItems.map(({ id, label }, i) => (
                <motion.li key={id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}>
                  <a href={`#${id}`} onClick={go(id)} className={`font-display text-5xl font-black italic ${active === id ? 'text-neon' : 'text-white'}`}>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={profile.telegram} target="_blank" rel="noopener" className="btn btn-red mt-12 self-start">Hire me <ArrowUpRight /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
