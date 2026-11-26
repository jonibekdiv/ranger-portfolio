import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { GithubIcon } from './Icons'
import { BotPreview } from './Projects'
import type { Project } from '../data/content'
import { ease, lockScroll } from '../lib/motion'

export default function ProjectModal({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>('a, button')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); lockScroll(false); prev?.focus() }
  }, [onClose])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[110] grid place-items-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="glass relative z-10 max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-[32px] border-neon/30 shadow-[0_40px_120px_-20px_rgba(255,32,32,.45)]"
        data-lenis-prevent
        initial={{ y: 80, scale: 0.94, clipPath: 'inset(10% 6% 10% 6% round 32px)' }}
        animate={{ y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 32px)' }}
        exit={{ y: 60, scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <button ref={closeBtn} onClick={onClose} aria-label="Close project details" className="glass absolute top-4 right-4 z-20 grid h-12 w-12 place-items-center rounded-full text-white transition hover:rotate-90 hover:bg-neon">
          <X size={20} />
        </button>
        <div className="relative aspect-[16/9] overflow-hidden">
          {p.image ? (
            <motion.img src={p.image} alt={`Screenshot of ${p.title}`} className="h-full w-full object-cover object-top" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease }} />
          ) : (
            <BotPreview big />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
          <span className="absolute bottom-4 left-6 font-display text-7xl font-black italic text-neon/90 text-glow sm:text-8xl">{p.index}</span>
        </div>

        <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7, ease }}>
            <p className="text-xs font-bold tracking-[.2em] text-neon uppercase">{p.short}</p>
            <h3 id="modal-title" className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">{p.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-gray">{p.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.live && <a href={p.live} target="_blank" rel="noopener" className="btn btn-red">Live demo <ArrowUpRight /></a>}
              <a href={p.repo} target="_blank" rel="noopener" className="btn btn-ghost"><GithubIcon /> Source code</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease }}>
            <h4 className="text-sm font-bold tracking-[.18em] text-white uppercase">Key features</h4>
            <ul className="mt-4 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-gray"><span className="grid h-6 w-6 place-items-center rounded-full bg-neon/15 text-neon"><Check size={14} /></span>{f}</li>
              ))}
            </ul>
            <h4 className="mt-8 text-sm font-bold tracking-[.18em] text-white uppercase">Stack</h4>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => <li key={s} className="rounded-full border border-neon/25 bg-neon/[.07] px-3 py-1 font-mono text-xs text-[#ffb3b3]">{s}</li>)}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
