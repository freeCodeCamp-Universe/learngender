import { useEffect, useRef, useState } from 'react'
import { getXPProgress } from '../lib/levels'
import { getScore } from '../lib/storage'
import type { Language, RoundSummary } from '../types'

interface LevelBadgeProps {
  language: Language
  summary?: RoundSummary | null
}

export function LevelBadge({ language, summary }: LevelBadgeProps) {
  const totalXP = getScore(language).score
  const initialXP = summary ? Math.max(0, totalXP - summary.pointsEarned) : totalXP
  const [displayXP, setDisplayXP] = useState(initialXP)
  const [visible, setVisible] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationFrame = useRef<number | null>(null)
  const animationDelay = useRef<ReturnType<typeof setTimeout> | null>(null)
  const levelUpTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { level, pct, xpInLevel, xpNeeded } = getXPProgress(displayXP)

  function handleClick() {
    setVisible(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 800)
  }

  useEffect(() => {
    if (!summary) return

    const startXP = initialXP
    const endXP = totalXP
    const startLevel = getXPProgress(startXP).level
    let lastLevel = startLevel
    let startTime: number | null = null

    animationDelay.current = setTimeout(() => {
      const duration = Math.min(1800, Math.max(950, summary.pointsEarned * 12))

      const tick = (timestamp: number) => {
        if (startTime === null) startTime = timestamp
        const rawProgress = Math.min(1, (timestamp - startTime) / duration)
        const easedProgress = 1 - Math.pow(1 - rawProgress, 3)
        const nextXP = Math.round(startXP + (endXP - startXP) * easedProgress)

        setDisplayXP(nextXP)

        const nextLevel = getXPProgress(nextXP).level
        if (nextLevel > lastLevel) {
          lastLevel = nextLevel
          setShowLevelUp(true)
          if (levelUpTimer.current) clearTimeout(levelUpTimer.current)
          levelUpTimer.current = setTimeout(() => setShowLevelUp(false), 1700)
        }

        if (rawProgress < 1) {
          animationFrame.current = requestAnimationFrame(tick)
          return
        }

        setDisplayXP(endXP)
      }

      animationFrame.current = requestAnimationFrame(tick)
    }, 900)

    return () => {
      if (animationDelay.current) clearTimeout(animationDelay.current)
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
      if (levelUpTimer.current) clearTimeout(levelUpTimer.current)
    }
  }, [initialXP, summary, totalXP])

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
    if (animationDelay.current) clearTimeout(animationDelay.current)
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    if (levelUpTimer.current) clearTimeout(levelUpTimer.current)
  }, [])

  return (
    <div
      className={`level-badge${summary ? ' level-badge--celebrating' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className="level-badge__circle">{level}</div>
      <div className="level-badge__bar-track">
        <div className="level-badge__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {showLevelUp && (
        <div className="level-badge__celebration">Level up!</div>
      )}
      <div className={`level-badge__tooltip${visible ? ' level-badge__tooltip--visible' : ''}`}>
        {xpInLevel} / {xpNeeded} xp
      </div>
    </div>
  )
}
