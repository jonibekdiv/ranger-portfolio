// Tiny UI sound engine. Sounds are synthesised with the Web Audio API (no audio files),
// stay off by default, and the choice is remembered.

let ctx: AudioContext | null = null
let enabled = false
const listeners = new Set<(on: boolean) => void>()

try { enabled = localStorage.getItem('sound') === 'on' } catch { /* ignore */ }

export const isSoundOn = () => enabled

export function setSound(on: boolean) {
  enabled = on
  try { localStorage.setItem('sound', on ? 'on' : 'off') } catch { /* ignore */ }
  if (on) ensureCtx()
  listeners.forEach((fn) => fn(on))
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function blip(freqFrom: number, freqTo: number, duration: number, volume: number, type: OscillatorType) {
  if (!enabled) return
  const ac = ensureCtx()
  if (!ac || ac.state !== 'running') return
  const t = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freqFrom, t)
  osc.frequency.exponentialRampToValueAtTime(freqTo, t + duration)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

let lastHover = 0
export function playHover() {
  const now = performance.now()
  if (now - lastHover < 70) return
  lastHover = now
  blip(1800, 1400, 0.04, 0.025, 'sine')
}

export function playClick() {
  blip(520, 220, 0.09, 0.06, 'triangle')
}
