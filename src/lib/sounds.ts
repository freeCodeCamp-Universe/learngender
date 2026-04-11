import { getSettings } from './storage'

/**
 * Sound effects module — Phase 8.
 *
 * Sounds are generated via the Web Audio API (no audio files needed,
 * avoids bundling large assets). All sounds respect the mute setting.
 */

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  // Lazy-create shared AudioContext
  const w = window as Window & { _lngAudioCtx?: AudioContext }
  if (!w._lngAudioCtx) {
    try {
      w._lngAudioCtx = new AudioContext()
    } catch {
      return null
    }
  }
  return w._lngAudioCtx
}

function isMuted(): boolean {
  return !getSettings().soundEnabled
}

function beep(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.3
): void {
  if (isMuted()) return
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)

  gainNode.gain.setValueAtTime(gain, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.connect(gainNode)
  gainNode.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function playCorrect(): void {
  if (isMuted()) return
  beep(523, 0.08) // C5
  setTimeout(() => beep(659, 0.12), 80) // E5
}

export function playIncorrect(): void {
  if (isMuted()) return
  beep(200, 0.15, 'sawtooth', 0.2)
  setTimeout(() => beep(160, 0.2, 'sawtooth', 0.15), 120)
}

export function playLevelUp(): void {
  if (isMuted()) return
  const notes = [523, 659, 784, 1047] // C E G C
  notes.forEach((freq, i) => {
    setTimeout(() => beep(freq, 0.15, 'sine', 0.35), i * 120)
  })
}
