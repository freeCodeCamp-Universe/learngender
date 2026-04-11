import { useEffect, useRef, useState } from 'react'
import type { Gender, Word } from '../types'

interface WordCardProps {
  word: Word
  // Returns true if the answer was correct
  onSwipe: (gender: Gender, translationUsed: boolean) => boolean
  showTranslationByDefault: boolean
}

const FLICK_VELOCITY = 0.4  // px/ms
const MIN_DISTANCE   = 80   // px

export function WordCard({ word, onSwipe, showTranslationByDefault }: WordCardProps) {
  const [translationRevealed, setTranslationRevealed] = useState(showTranslationByDefault)
  const [dragX, setDragX]   = useState(0)
  const [anim, setAnim]     = useState<'idle' | 'fly-left' | 'fly-right' | 'bounce-left' | 'bounce-right'>('idle')
  const [ready, setReady]   = useState(false)

  const pointerStartX = useRef<number | null>(null)
  const lastX         = useRef(0)
  const lastTime      = useRef(0)
  const velocity      = useRef(0)
  const handled       = useRef(false)

  // New word arrives → snap to centre instantly, then re-enable transitions
  useEffect(() => {
    setReady(false)
    setTranslationRevealed(showTranslationByDefault)
    setDragX(0)
    setAnim('idle')
    handled.current = false
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [word.word, showTranslationByDefault])

  function commit(dir: 'left' | 'right') {
    if (handled.current) return
    handled.current = true
    setDragX(0)

    const gender: Gender = dir === 'right' ? 'masculine' : 'feminine'
    const correct = onSwipe(gender, translationRevealed && !showTranslationByDefault)

    if (correct) {
      setAnim(dir === 'right' ? 'fly-right' : 'fly-left')
    } else {
      // Bounce: shoot ~40% in the direction then spring back
      setAnim(dir === 'right' ? 'bounce-right' : 'bounce-left')
      setTimeout(() => {
        setAnim('idle')
        handled.current = false
      }, 420)
    }
  }

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  commit('left')
      if (e.key === 'ArrowRight') commit('right')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationRevealed, showTranslationByDefault])

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (handled.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerStartX.current = e.clientX
    lastX.current    = e.clientX
    lastTime.current = e.timeStamp
    velocity.current = 0
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null || handled.current) return
    const dt = e.timeStamp - lastTime.current
    if (dt > 0) velocity.current = (e.clientX - lastX.current) / dt
    lastX.current    = e.clientX
    lastTime.current = e.timeStamp
    setDragX(e.clientX - pointerStartX.current)
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return
    const dx  = e.clientX - pointerStartX.current
    const vel = velocity.current
    pointerStartX.current = null

    if (Math.abs(vel) > FLICK_VELOCITY || Math.abs(dx) >= MIN_DISTANCE) {
      commit((vel !== 0 ? vel : dx) > 0 ? 'right' : 'left')
    } else {
      setDragX(0) // snap back
    }
  }

  function onPointerCancel() {
    pointerStartX.current = null
    setDragX(0)
  }

  const showTranslation = translationRevealed || showTranslationByDefault
  const isFlying  = anim === 'fly-left'    || anim === 'fly-right'
  const isBouncing = anim === 'bounce-left' || anim === 'bounce-right'
  const isMoving  = dragX !== 0

  // Compute visual transform
  let tx: string
  let rotate: number
  let transition: string
  let opacity = 1

  if (!ready) {
    tx = '0px'; rotate = 0; transition = 'none'
  } else if (anim === 'fly-right') {
    tx = '150%'; rotate = 18; opacity = 0; transition = 'transform 0.26s ease-in, opacity 0.26s ease-in'
  } else if (anim === 'fly-left') {
    tx = '-150%'; rotate = -18; opacity = 0; transition = 'transform 0.26s ease-in, opacity 0.26s ease-in'
  } else if (anim === 'bounce-right') {
    tx = '38%'; rotate = 8; transition = 'transform 0.12s ease-out'
  } else if (anim === 'bounce-left') {
    tx = '-38%'; rotate = -8; transition = 'transform 0.12s ease-out'
  } else if (isMoving) {
    tx = `${dragX}px`; rotate = dragX / 15; transition = 'none'
  } else {
    // idle / snap-back
    tx = '0px'; rotate = 0; transition = 'transform 0.18s ease-out'
  }

  const dragPct    = Math.min(Math.abs(dragX) / MIN_DISTANCE, 1)
  const hintOpacity = isFlying || isBouncing ? 0 : dragPct

  return (
    <div
      className="word-card"
      style={{ transform: `translateX(${tx}) rotate(${rotate}deg)`, opacity, transition, cursor: isMoving ? 'grabbing' : 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      role="main"
      aria-label={`Word: ${word.word}`}
    >
      <div className="word-card__hint word-card__hint--left"  style={{ opacity: dragX < 0 ? hintOpacity : 0 }}>fem</div>
      <div className="word-card__hint word-card__hint--right" style={{ opacity: dragX > 0 ? hintOpacity : 0 }}>masc</div>

      <p className="word-card__noun">{word.word}</p>

      {showTranslation ? (
        <p className="word-card__translation">{word.translation}</p>
      ) : (
        <button
          className="word-card__reveal-btn"
          onClick={() => setTranslationRevealed(true)}
          aria-label="Reveal translation"
        >
          👁️
        </button>
      )}
    </div>
  )
}
