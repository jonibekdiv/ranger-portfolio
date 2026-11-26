import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const ease = [0.2, 0.8, 0.2, 1] as const

const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)')
export const isFinePointer = () => mq('(hover: hover) and (pointer: fine)')

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => mq(query))
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

/** Decide once whether this device should get the full WebGL scene. */
export function canRender3D() {
  if (typeof window === 'undefined') return false
  if (prefersReducedMotion() || window.innerWidth < 900) return false
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (nav.connection?.saveData) return false
  if ((nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4) return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/* ---------- Lenis smooth scroll, synced with ScrollTrigger ---------- */
let lenis: Lenis | null = null

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export const lockScroll = (lock: boolean) => {
  if (lenis) {
    if (lock) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}
