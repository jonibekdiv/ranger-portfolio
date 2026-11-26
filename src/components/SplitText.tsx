import { m } from 'framer-motion'
import { ease } from '../lib/motion'

/** Letter-by-letter reveal. Screen readers get the plain text. */
export default function SplitText({ text, className = '', delay = 0, stagger = 0.045, play = true }: { text: string; className?: string; delay?: number; stagger?: number; play?: boolean }) {
  return (
    <span className={`inline-block whitespace-nowrap pb-[0.12em] pr-[0.08em] align-bottom [clip-path:inset(-60%_-30%_0_-30%)] ${className}`} aria-label={text} role="text">
      {[...text].map((ch, i) => (
        <m.span
          key={i}
          aria-hidden="true"
          className="inline-block will-change-transform"
          initial={{ y: '110%', rotate: 8, opacity: 0 }}
          animate={play ? { y: '0%', rotate: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease, delay: delay + i * stagger }}
        >
          {ch === ' ' ? ' ' : ch}
        </m.span>
      ))}
    </span>
  )
}
