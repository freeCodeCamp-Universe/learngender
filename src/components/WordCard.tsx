import { useEffect, useRef, useState } from 'react'
import type { Gender, Word } from '../types'
import { playCorrect, playIncorrect, primeAudio } from '../lib/sounds'

interface WordCardProps {
  word: Word
  onSwipe: (gender: Gender, translationUsed: boolean) => boolean
  showTranslation: boolean
}

const FLICK_VELOCITY = 0.4  // px/ms
const MIN_DISTANCE   = 70   // px

const BOUNCE_DURATION = 580 // ms — must match CSS animation duration

export function WordCard({ word, onSwipe, showTranslation }: WordCardProps) {
  const [dragX, setDragX]         = useState(0)
  const [dragY, setDragY]         = useState(0)
  const [anim, setAnim]           = useState<'idle' | 'enter' | 'fly-left' | 'fly-right' | 'bounce-left' | 'bounce-right' | 'dismiss-left' | 'dismiss-right'>('idle')
  const [bouncePx, setBouncePx]   = useState(100)
  const [ready, setReady]         = useState(false)

  const cardRef          = useRef<HTMLDivElement>(null)
  const pointerStartX    = useRef<number | null>(null)
  const pointerStartY    = useRef<number | null>(null)
  const cardTopOnPress   = useRef(0)   // card's top edge when drag started
  const lastX            = useRef(0)
  const lastTime         = useRef(0)
  const velocity         = useRef(0)
  const handled          = useRef(false)
  const showTranslationRef = useRef(showTranslation)
  const translationUsedRef = useRef(showTranslation)

  useEffect(() => {
    showTranslationRef.current = showTranslation
  }, [showTranslation])

  // New word arrives → drop-in animation
  useEffect(() => {
    setReady(false)
    setDragX(0)
    setDragY(0)
    setAnim('enter')
    handled.current = false
    translationUsedRef.current = showTranslationRef.current
    const raf = requestAnimationFrame(() => {
      setReady(true)
      setTimeout(() => setAnim(a => a === 'enter' ? 'idle' : a), 220)
    })
    return () => cancelAnimationFrame(raf)
  }, [word.id])

  useEffect(() => {
    if (!showTranslation) return
    translationUsedRef.current = true
  }, [showTranslation])

  function commit(dir: 'left' | 'right') {
    if (handled.current) return
    handled.current = true
    setDragX(0)
    setDragY(0)
    primeAudio()

    const gender: Gender = dir === 'right' ? 'masculine' : 'feminine'
    const correct = onSwipe(gender, translationUsedRef.current)

    if (correct) {
      playCorrect()
      setAnim(dir === 'right' ? 'fly-right' : 'fly-left')
    } else {
      playIncorrect()
      // Measure distance from card edge to the app container edge (not window width,
      // which breaks on desktop where .app is narrower than the viewport).
      let edgePx = 100
      if (cardRef.current) {
        const rect      = cardRef.current.getBoundingClientRect()
        const appEl     = cardRef.current.closest('.app') ?? document.body
        const appRect   = appEl.getBoundingClientRect()
        edgePx = dir === 'right'
          ? Math.max(0, appRect.right  - rect.right - 8)
          : Math.max(0, rect.left - appRect.left  - 8)
      }
      setBouncePx(edgePx)
      setAnim(dir === 'right' ? 'bounce-right' : 'bounce-left')
      setTimeout(() => {
        setAnim(dir === 'right' ? 'dismiss-right' : 'dismiss-left')
      }, BOUNCE_DURATION)
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
  }, [])

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (handled.current) return
    primeAudio()
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerStartX.current = e.clientX
    pointerStartY.current = e.clientY
    // Record card top so we can clamp upward drag to stay below the topbar
    cardTopOnPress.current = cardRef.current
      ? cardRef.current.getBoundingClientRect().top
      : 80
    lastX.current    = e.clientX
    lastTime.current = e.timeStamp
    velocity.current = 0
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null || pointerStartY.current === null || handled.current) return
    const dt = e.timeStamp - lastTime.current
    if (dt > 0) velocity.current = (e.clientX - lastX.current) / dt
    lastX.current    = e.clientX
    lastTime.current = e.timeStamp

    const rawDy = e.clientY - pointerStartY.current
    // Don't let the card's top edge cross above the topbar (≈64px from viewport top)
    const TOPBAR_BOTTOM = 64
    const maxUpward = TOPBAR_BOTTOM - cardTopOnPress.current  // negative number
    setDragX(e.clientX - pointerStartX.current)
    setDragY(Math.max(rawDy, maxUpward))
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return
    const dx  = e.clientX - pointerStartX.current
    const vel = velocity.current
    pointerStartX.current = null
    pointerStartY.current = null

    if (Math.abs(dx) >= MIN_DISTANCE) {
      commit(dx > 0 ? 'right' : 'left')
    } else if (Math.abs(vel) > FLICK_VELOCITY) {
      commit(vel > 0 ? 'right' : 'left')
    } else {
      setDragX(0)
      setDragY(0)
    }
  }

  function onPointerCancel() {
    pointerStartX.current = null
    pointerStartY.current = null
    setDragX(0)
    setDragY(0)
  }

  const isBouncing   = anim === 'bounce-left'   || anim === 'bounce-right'
  const isDismissing = anim === 'dismiss-left'  || anim === 'dismiss-right'
  const isEntering   = anim === 'enter'
  const isMoving   = dragX !== 0 || dragY !== 0

  // When bouncing, the CSS keyframe animation drives the transform.
  // For all other states, inline style drives it.
  const usingCssAnim = (isBouncing || isDismissing || isEntering) && ready

  let inlineTransform = ''
  let transition = ''
  let opacity = 1

  if (!ready) {
    inlineTransform = 'translateX(0) translateY(-28px) rotate(0deg)'
    opacity = 0
    transition = 'none'
  } else if (usingCssAnim) {
    inlineTransform = '' // CSS animation takes over
  } else if (anim === 'fly-right') {
    // translateY is always 0 here (zeroed in commit before setAnim);
    // 'none' prevents any lingering Y from the drag interpolating into the fly path
    inlineTransform = 'translateX(150%) translateY(0) rotate(18deg)'
    opacity = 0
    transition = 'transform 0.26s ease-in, opacity 0.26s ease-in'
  } else if (anim === 'fly-left') {
    inlineTransform = 'translateX(-150%) translateY(0) rotate(-18deg)'
    opacity = 0
    transition = 'transform 0.26s ease-in, opacity 0.26s ease-in'
  } else if (isMoving) {
    inlineTransform = `translateX(${dragX}px) translateY(${dragY}px) rotate(${dragX / 15}deg)`
    transition = 'none'
  } else {
    // Snap back: X snaps with spring, Y snaps instantly so card never floats above topbar
    inlineTransform = 'translateX(0) translateY(0) rotate(0deg)'
    transition = 'transform 0.18s ease-out'
  }



  const cssAnimClass =
    anim === 'bounce-right'   ? 'word-card--bounce-right'   :
    anim === 'bounce-left'    ? 'word-card--bounce-left'    :
    anim === 'dismiss-right'  ? 'word-card--dismiss-right'  :
    anim === 'dismiss-left'   ? 'word-card--dismiss-left'   :
    anim === 'enter'          ? 'word-card--enter'          :
    ''

  return (
    <div
      ref={cardRef}
      className={`word-card${cssAnimClass ? ` ${cssAnimClass}` : ''}`}
      style={{
        '--bounce-px': `${bouncePx}px`,
        ...(inlineTransform ? { transform: inlineTransform } : {}),
        opacity,
        transition: usingCssAnim ? undefined : transition,
        cursor: isMoving ? 'grabbing' : 'grab',
      } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      role="main"
      aria-label={`Word: ${word.word}`}
    >
      <p className="word-card__noun">{word.word}</p>
      {word.hint && <p className="word-card__hint">{word.hint}</p>}
      {showTranslation && <p className="word-card__translation">{word.translation}</p>}
    </div>
  )
}
