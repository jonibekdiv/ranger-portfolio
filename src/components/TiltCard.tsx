import { useRef, type ReactNode, type HTMLAttributes } from 'react'
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { isFinePointer } from '../lib/motion'

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode; max?: number }

/** 3D tilt + pointer spotlight (sets --mx/--my for the .spotlight class). */
export default function TiltCard({ children, max = 10, className = '', ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${nx * 100}%`)
    el.style.setProperty('--my', `${ny * 100}%`)
    if (isFinePointer()) { px.set(nx); py.set(ny) }
  }
  const reset = () => { px.set(0.5); py.set(0.5) }

  return (
    <m.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`spotlight ${className}`}
      {...(rest as object)}
    >
      {children}
    </m.div>
  )
}
