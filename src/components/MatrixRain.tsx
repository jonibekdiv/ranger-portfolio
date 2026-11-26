import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const CHARS = 'アイウエオカキクケコサシスセソ0123456789<>/{}[]=+*#$RANGER'

/**
 * Low-cost "digital rain" for a section background: red glyph columns on a canvas,
 * ~24 fps, and paused whenever the canvas is off-screen or the tab is hidden.
 */
export default function MatrixRain({ opacity = 0.35 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || prefersReducedMotion()) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = window.innerWidth < 768 ? 14 : 16
    let drops: number[] = []
    let raf = 0
    let last = 0
    let visible = false

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(r.width))
      canvas.height = Math.max(1, Math.floor(r.height))
      const cols = Math.ceil(canvas.width / size)
      drops = Array.from({ length: cols }, () => Math.random() * -canvas.height / size)
      ctx.font = `500 ${size}px "JetBrains Mono", monospace`
    }

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      if (now - last < 42) return // ~24 fps is plenty for this effect
      last = now
      ctx.fillStyle = 'rgba(5, 5, 5, 0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * size
        const ch = CHARS[(Math.random() * CHARS.length) | 0]
        ctx.fillStyle = Math.random() > 0.975 ? '#ffd0d0' : '#ff2020'
        ctx.fillText(ch, i * size, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 1
      }
    }

    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    resize()
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop() })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="fx-canvas" style={{ opacity }} />
}
