import { useEffect, useRef, useState } from 'react'
import { isFinePointer, prefersReducedMotion } from '../lib/motion'

type Mode = '' | 'is-link' | 'is-view' | 'is-text'

/** Red dot + trailing ring. Desktop / fine pointers only. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const trail = useRef<HTMLCanvasElement>(null)
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion())
  const [mode, setMode] = useState<Mode>('')
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0
    let magnet: HTMLElement | null = null

    // Fading red trail drawn on a full-screen canvas.
    const canvas = trail.current!
    const g = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const sizeCanvas = () => {
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)
    const points: { x: number; y: number; t: number }[] = []
    const LIFE = 380
    let dirty = false

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      points.push({ x, y, t: performance.now() })
      const t = e.target as HTMLElement
      const view = t.closest<HTMLElement>('[data-cursor="view"]')
      const field = t.closest('input, textarea')
      const link = t.closest<HTMLElement>('a, button, [data-cursor="link"]')
      magnet = t.closest<HTMLElement>('[data-magnetic]')
      if (view) { setMode('is-view'); setLabel(view.dataset.cursorLabel || 'VIEW') }
      else if (field) setMode('is-text')
      else if (link) setMode('is-link')
      else setMode('')
    }
    const loop = () => {
      let tx = x, ty = y
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        tx = r.left + r.width / 2 + (x - (r.left + r.width / 2)) * 0.35
        ty = r.top + r.height / 2 + (y - (r.top + r.height / 2)) * 0.35
      }
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`

      const now = performance.now()
      while (points.length && now - points[0].t > LIFE) points.shift()
      if (points.length > 1 || dirty) {
        g.clearRect(0, 0, innerWidth, innerHeight)
        g.lineCap = 'round'
        g.lineJoin = 'round'
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i]
          const life = 1 - (now - b.t) / LIFE
          g.strokeStyle = `rgba(255, 32, 32, ${0.55 * life})`
          g.lineWidth = 1 + 5 * life
          g.shadowColor = 'rgba(255, 32, 32, .9)'
          g.shadowBlur = 10 * life
          g.beginPath()
          g.moveTo(a.x, a.y)
          g.lineTo(b.x, b.y)
          g.stroke()
        }
        dirty = points.length > 1
      }
      raf = requestAnimationFrame(loop)
    }
    const hide = () => { if (dot.current && ring.current) dot.current.style.opacity = ring.current.style.opacity = '0' }
    const show = () => { if (dot.current && ring.current) dot.current.style.opacity = ring.current.style.opacity = '1' }

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    document.addEventListener('pointerenter', show)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', sizeCanvas)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      document.removeEventListener('pointerenter', show)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <canvas ref={trail} className="trail-canvas" aria-hidden="true" />
      <div ref={ring} className={`cursor-ring ${mode}`} aria-hidden="true"><span>{label}</span></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" style={{ opacity: mode === 'is-view' || mode === 'is-text' ? 0 : 1 }} />
    </>
  )
}
