import { useEffect, useRef, useState } from 'react'
import type { Language, RoundSummary } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { MasteryCircle } from './MasteryCircle'
import { getRoundPointCap, getRoundScoreBreakdown } from '../lib/scoring'
import { SUMMIT_STEP } from '../hooks/useRound'

interface SummitDrawerProps {
  summary: RoundSummary
  language: Language
  onNext: () => void
  onExit: () => void
}

function getBadge(score: number, perfect: boolean) {
  if (perfect) return { emoji: '🏆', label: 'Perfect Round!' }
  if (score >= 7) return { emoji: '🏆', label: 'Excellent Job!' }
  if (score >= 5) return { emoji: '⭐', label: 'Great Job!' }
  return { emoji: '👍', label: 'Good Job!' }
}

// Animated bar: starts at pctBefore, animates to pctAfter after a delay
function AnimatedBar({ pctBefore, pctAfter }: { pctBefore: number; pctAfter: number }) {
  const [width, setWidth] = useState(pctBefore)
  const raf = useRef<number>(0)

  useEffect(() => {
    // drawer rise = 0.5s delay + 0.5s animation = ~1s before we start filling
    const timer = setTimeout(() => {
      raf.current = requestAnimationFrame(() => {
        raf.current = requestAnimationFrame(() => setWidth(pctAfter))
      })
    }, 1000)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf.current)
    }
  }, [pctBefore, pctAfter])

  return (
    <div className="summit-drawer__bar-fill" style={{ width: `${width}%` }} />
  )
}

export function SummitDrawer({ summary, language, onNext, onExit }: SummitDrawerProps) {
  const labels = LANGUAGE_LABELS[language]

  // Deduplicated cards — first attempt per word (most honest result)
  const uniqueCards = summary.cards.reduce<typeof summary.cards>((acc, r) => {
    if (!acc.find(x => x.word.word === r.word.word)) acc.push(r)
    return acc
  }, [])

  const breakdown = getRoundScoreBreakdown(uniqueCards, { perfectTarget: SUMMIT_STEP })
  const uniqueCorrect = uniqueCards.filter(r => r.correct).length
  const badge = getBadge(uniqueCorrect, breakdown.perfect)
  const maxPoints = getRoundPointCap(SUMMIT_STEP, { includePerfectBonus: true })
  const scorePct = Math.min(100, Math.round((breakdown.points / maxPoints) * 100))

  // Score pill pop — show after drawer finishes rising
  const [showScore, setShowScore] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowScore(true), 900)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="summit-drawer">
      <div className="summit-drawer__handle" />

      {/* Badge */}
      <div className="summit-drawer__badge">
        <span className="summit-drawer__badge-emoji">{badge.emoji}</span>
        <span className="summit-drawer__badge-label">{badge.label}</span>
      </div>

      {/* Score section */}
      <div className="summit-drawer__score">
        <div className="summit-drawer__score-row">
          <span className="summit-drawer__score-label">Score</span>
          <span
            className={`summit-drawer__score-pill${showScore ? ' summit-drawer__score-pill--visible' : ''}`}
          >
            {breakdown.points} / {maxPoints} pts
          </span>
        </div>
        <div className="summit-drawer__bar-track">
          <AnimatedBar pctBefore={0} pctAfter={scorePct} />
        </div>
        <div className="summit-drawer__score-breakdown">
          <span className="summit-drawer__score-chip">
            {breakdown.correctCount} correct +{breakdown.correctPoints}
          </span>
          <span className="summit-drawer__score-chip">
            bonus {breakdown.passBonus ? `+${breakdown.passBonus}` : ' -'}
          </span>
          <span className="summit-drawer__score-chip">
            no translation {breakdown.noTranslationBonus ? `+${breakdown.noTranslationBonus}` : ' -'}
          </span>
        </div>
      </div>

      {/* Word list */}
      <div className="summit-drawer__words">
        {uniqueCards.map((r, i) => {
          const article = r.word.gender === 'feminine' ? labels.feminine : labels.masculine
          return (
            <div key={i} className={`summit-drawer__word-row ${r.correct ? 'summit-drawer__word-row--correct' : 'summit-drawer__word-row--wrong'}`}>
              <MasteryCircle pct={r.masteryAfter} size={34} textColor="#1a1612" />
              {(() => {
                const delta = r.masteryAfter - r.masteryBefore
                if (delta === 0) return null
                return (
                  <span className={`summit-drawer__delta ${delta > 0 ? 'summit-drawer__delta--up' : 'summit-drawer__delta--down'}`}>
                    {delta > 0 ? '↑' : '↓'}{Math.abs(delta)}%
                  </span>
                )
              })()}
              <span className="summit-drawer__word-article">{article}</span>
              <span className="summit-drawer__word-noun">{r.word.word}</span>
              <span className="summit-drawer__word-translation">{r.word.translation}</span>
              <span className="summit-drawer__word-result">{r.correct ? '✓' : '✗'}</span>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="summit-drawer__actions">
        <button className="btn btn--primary" onClick={onNext}>
          Next →
        </button>
      </div>
      <button className="summit-drawer__exit-btn" onClick={onExit}>
        Exit
      </button>
    </div>
  )
}
