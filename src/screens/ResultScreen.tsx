import { useEffect, useRef, useState } from 'react'
import type { RoundSummary } from '../types'
import { MasteryCircle } from '../components/MasteryCircle'
import { getMasteryTierOverview } from '../lib/levels'
import { SUMMIT_STEP } from '../hooks/useRound'

interface ResultScreenProps {
  summary: RoundSummary
  onPlayAgain: () => void
  onHome: () => void
}

function getBadge(score: number, passed: boolean): { label: string; emoji: string } {
  if (!passed) return { label: 'Good Try!', emoji: '💪' }
  if (score >= SUMMIT_STEP) return { label: 'Excellent Job', emoji: '🏆' }
  if (score >= 7) return { label: 'Great Job', emoji: '⭐' }
  return { label: 'Good Job', emoji: '👍' }
}

export function ResultScreen({ summary, onPlayAgain, onHome }: ResultScreenProps) {
  const badge = getBadge(summary.score, summary.passed)
  const levelUp = summary.levelAfter > summary.levelBefore

  const uniqueCards = summary.cards.reduce<typeof summary.cards>((acc, r) => {
    if (!acc.find(x => x.word.id === r.word.id)) acc.push(r)
    return acc
  }, [])

  // Animated mastery-tier progress bar
  const tierBefore = getMasteryTierOverview(summary.masteredBefore)
  const tierAfter = getMasteryTierOverview(summary.masteredAfter)
  const masteryTierChanged = tierAfter.tier > tierBefore.tier
  const tierLabel = masteryTierChanged ? `${tierBefore.name} -> ${tierAfter.name}` : tierAfter.name
  const tierCountLabel = tierAfter.nextThreshold
    ? `${tierAfter.masteredCount} / ${tierAfter.nextThreshold} mastered`
    : `${tierAfter.masteredCount} mastered`

  const levelUpLabel = summary.levelAfter === summary.levelBefore + 1
    ? `Level Up! -> Level ${summary.levelAfter}`
    : `Level Up! -> Level ${summary.levelBefore} to ${summary.levelAfter}`

  const [barPct, setBarPct] = useState(tierBefore.pct)
  const animated = useRef(false)

  useEffect(() => {
    if (animated.current) return
    animated.current = true
    const timeout = setTimeout(() => setBarPct(tierAfter.pct), 300)
    return () => clearTimeout(timeout)
  }, [tierAfter.pct])

  return (
    <div className="result-screen">
      {/* Score + badge in one row */}
      <div className="result-score">
        <span className="result-badge__emoji">{badge.emoji}</span>
        <span className="result-badge__label">{badge.label}</span>
        <span className="result-score__value">{summary.score} correct</span>
        <span className={`result-score__status ${summary.passed ? 'passed' : 'failed'}`}>
          {summary.passed ? 'Passed' : 'Failed'}
        </span>
        <span className="result-score__points">+{summary.pointsEarned} pts</span>
      </div>
      {levelUp && (
        <div className="result-badge__levelup">
          {levelUpLabel}
        </div>
      )}

      {/* Mastery tier progress bar */}
      <div className="result-progress">
        <div className="result-progress__labels">
          <span>{tierLabel}</span>
          <span>{tierCountLabel}</span>
        </div>
        <div className="result-progress__track">
          <div
            className="result-progress__fill"
            style={{ width: `${barPct}%`, transition: 'width 0.8s ease-out' }}
          />
        </div>
      </div>

      {/* Word list */}
      <div className="result-word-list">
        {uniqueCards.map((r, i) => {
          const article = r.word.article
          const delta = r.masteryAfter - r.masteryBefore
          const displayDelta = delta === 0 && r.correct ? 1 : Math.abs(delta)
          const isPositiveDelta = delta > 0 || (delta === 0 && r.correct)
          return (
            <div key={i} className={`result-word-row ${r.correct ? 'result-word-row--correct' : 'result-word-row--wrong'}`}>
              <MasteryCircle pct={r.masteryAfter} size={34} />
              {(delta !== 0 || r.correct) && (
                <span className={`result-word-row__delta ${isPositiveDelta ? 'result-word-row__delta--up' : 'result-word-row__delta--down'}`}>
                  {isPositiveDelta ? '↑' : '↓'}{displayDelta}%
                </span>
              )}
              <span className="result-word-row__article">{article}</span>
              <span className="result-word-row__noun">{r.word.word}</span>
              <span className="result-word-row__translation">{r.word.translation}</span>
              <span className="result-word-row__result">{r.correct ? '✓' : '✗'}</span>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="result-actions">
        <button className="btn btn--primary" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="btn btn--secondary" onClick={onHome}>
          Home
        </button>
      </div>
    </div>
  )
}
