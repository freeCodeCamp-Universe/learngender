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

function startTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType,
  gain: number
): void {
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

function isMuted(): boolean {
  return !getSettings().soundEnabled
}

export function primeAudio(): void {
  if (isMuted()) return
  const ctx = getCtx()
  if (!ctx || ctx.state !== 'suspended') return
  void ctx.resume().catch(() => {})
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

  if (ctx.state === 'suspended') {
    void ctx.resume().then(() => {
      if (!isMuted()) startTone(ctx, frequency, duration, type, gain)
    }).catch(() => {})
    return
  }

  startTone(ctx, frequency, duration, type, gain)
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

export function playWin(): void {
  if (isMuted()) return
  const notes = [523, 659, 784] // C E G
  notes.forEach((freq, i) => {
    setTimeout(() => beep(freq, 0.12, 'triangle', 0.28), i * 90)
  })
}

export function playLevelUp(): void {
  if (isMuted()) return
  const notes = [523, 659, 784, 1047] // C E G C
  notes.forEach((freq, i) => {
    setTimeout(() => beep(freq, 0.15, 'sine', 0.35), i * 120)
  })
}
