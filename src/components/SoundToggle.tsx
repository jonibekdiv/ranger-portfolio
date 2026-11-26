import { useEffect, useState } from 'react'
import { isSoundOn, onSoundChange, playClick, playHover, setSound } from '../lib/sound'
import { useI18n } from '../i18n'

const INTERACTIVE = 'a, button, [data-cursor], input, textarea'

/** Floating sound switch + global hover/click sounds for interactive elements. */
export default function SoundToggle() {
  const t = useI18n().t.sound
  const [on, setOn] = useState(isSoundOn)

  useEffect(() => onSoundChange(setOn), [])

  useEffect(() => {
    if (!on) return
    let lastTarget: Element | null = null
    const over = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const el = (e.target as Element).closest(INTERACTIVE)
      if (el && el !== lastTarget) playHover()
      lastTarget = el
    }
    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) playClick()
    }
    window.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', down)
    return () => { window.removeEventListener('pointerover', over); window.removeEventListener('pointerdown', down) }
  }, [on])

  return (
    <button
      type="button"
      onClick={() => { setSound(!on); if (!on) window.setTimeout(playClick, 30) }}
      aria-pressed={on}
      aria-label={on ? t.on : t.off}
      title={on ? t.on : t.off}
      className={`glass fixed bottom-5 left-5 z-[85] flex h-11 items-center gap-2.5 rounded-full px-4 text-white transition hover:border-neon/50 hover:shadow-[0_0_30px_-8px_rgba(255,32,32,.8)] ${on ? 'sound-on text-neon' : 'text-gray'}`}
    >
      <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="hidden text-[11px] font-bold tracking-[.18em] sm:inline">{on ? 'ON' : 'OFF'}</span>
    </button>
  )
}
