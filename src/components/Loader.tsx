import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Logo } from './Icons'
import { useI18n } from '../i18n'
import { ease, lockScroll } from '../lib/motion'

/** Shows until fonts + page assets are actually ready. No artificial delay. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0.1)
  const [visible, setVisible] = useState(true)
  const { t } = useI18n()

  useEffect(() => {
    // The app is mounted, so scripts are ready; wait only for the web fonts (max 1.5s).
    lockScroll(true)
    setProgress(0.55)
    let done = false
    const finish = () => { if (!done) { done = true; setProgress(1) } }
    if (document.fonts) document.fonts.ready.then(finish)
    else finish()
    const safety = window.setTimeout(finish, 1500)
    return () => clearTimeout(safety)
  }, [])

  // As soon as we're ready, start revealing the page while the curtain lifts.
  useEffect(() => {
    if (progress < 1) return
    const t = window.setTimeout(() => {
      setVisible(false)
      lockScroll(false)
      onDone()
    }, 150)
    return () => clearTimeout(t)
  }, [progress, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed inset-0 z-[120] grid place-content-center justify-items-center gap-8 bg-black"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease }}
          aria-hidden="true"
        >
          <m.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Logo className="h-14 w-14 text-neon drop-shadow-[0_0_18px_rgba(255,32,32,.8)]" />
            <span className="font-display text-5xl font-black italic tracking-tight text-white sm:text-7xl">RANGER</span>
          </m.div>
          <div className="h-[2px] w-64 overflow-hidden rounded bg-white/10">
            <m.div
              className="h-full origin-left bg-neon shadow-[0_0_18px_2px_#ff2020]"
              animate={{ scaleX: progress }}
              transition={{ duration: 0.6, ease }}
            />
          </div>
          <p className="font-mono text-xs tracking-[.3em] text-gray">{t.loader}</p>
        </m.div>
      )}
    </AnimatePresence>
  )
}
