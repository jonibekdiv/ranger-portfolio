import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

const GLYPHS = '!<>-_\\/[]{}=+*^?#$%&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/**
 * "Decrypting" text: random glyphs resolve left-to-right into the real text.
 * Runs once when it scrolls into view (and `play` is true), and again when the text changes (language switch).
 */
export function ScrambleText({ text, play = true, delay = 0, className = '' }: { text: string; play?: boolean; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [out, setOut] = useState(text)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) { setOut(text); return }
    if (!play) { setOut(text.replace(/\S/g, ' ')); return }

    let raf = 0
    let timer = 0
    const run = () => {
      const duration = Math.max(700, text.length * 55)
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        const solved = Math.floor(p * text.length)
        let s = text.slice(0, solved)
        for (let i = solved; i < text.length; i++) {
          s += /\s/.test(text[i]) ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
        setOut(s)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const start = () => { timer = window.setTimeout(run, delay * 1000) }
    // Already on screen (e.g. the hero right after the loader): start now instead of waiting for an observer callback.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) {
      start()
      return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      start()
    }, { rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [text, play, delay])

  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

/**
 * Cinematic section transition: a glowing panel behind the section expands from an
 * inset rounded card to full-bleed while a red line draws across the top edge.
 * Place it as the first child of a `relative` section that has a `data-bg` colour.
 */
export function SectionReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    const section = root?.parentElement
    if (!root || !section) return
    section.style.isolation = 'isolate'
    root.style.setProperty('--panel', section.dataset.bg || '#090909')
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
        defaults: { ease: 'none' },
      })
      tl.fromTo('[data-panel]', { clipPath: 'inset(0% 9% 0% 9% round 64px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, 0)
        .fromTo('[data-panel-edge]', { opacity: 1 }, { opacity: 0 }, 0.55)
        .fromTo('[data-line]', { scaleX: 0 }, { scaleX: 1 }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="section-reveal">
      <div data-panel className="section-panel">
        <div data-panel-edge className="section-panel-edge" />
      </div>
      <div data-line className="section-line" />
    </div>
  )
}
