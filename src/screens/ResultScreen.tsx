import { useEffect, useRef, useState } from 'react'
import type { RoundSummary } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { MasteryCircle } from '../components/MasteryCircle'
import { getLevelName, getLevelProgress } from '../lib/levels'

interface ResultScreenProps {
  summary: RoundSummary
  onPlayAgain: () => void
  onHome: () => void
}

function getBadge(score: number): { label: string; emoji: string } {
  if (score >= 9) return { label: 'Excellent Job', emoji: '🏆' }
  if (score >= 7) return { label: 'Great Job', emoji: '⭐' }
  return { label: 'Good Job', emoji: '👍' }
}

export function ResultScreen({ summary, onPlayAgain, onHome }: ResultScreenProps) {
  const badge = getBadge(summary.score)
  const labels = LANGUAGE_LABELS[summary.language]
  const levelUp = summary.levelAfter > summary.levelBefore

  // Animated progress bar
  const progressBefore = getLevelProgress(summary.scoreBefore)
  const progressAfter = getLevelProgress(summary.scoreAfter)
  const [barPct, setBarPct] = useState(progressBefore.pct)
  const animated = useRef(false)

  useEffect(() => {
    if (animated.current) return
    animated.current = true
    const timeout = setTimeout(() => setBarPct(progressAfter.pct), 300)
    return () => clearTimeout(timeout)
  }, [progressAfter.pct])

  return (
    <div className="result-screen">
      {/* Badge */}
      <div className="result-badge">
        <span className="result-badge__emoji">{badge.emoji}</span>
        <h1 className="result-badge__label">{badge.label}</h1>
        {levelUp && (
          <div className="result-badge__levelup">
            Level Up! → {getLevelName(summary.levelAfter)}
          </div>
        )}
      </div>

      {/* Score */}
      <div className="result-score">
        <span className="result-score__value">{summary.score}/10</span>
        <span className={`result-score__status ${summary.passed ? 'passed' : 'failed'}`}>
          {summary.passed ? 'Passed' : 'Failed'}
        </span>
        <span className="result-score__points">+{summary.pointsEarned} pts</span>
      </div>

      {/* Level progress bar */}
      <div className="result-progress">
        <div className="result-progress__labels">
          <span>{getLevelName(summary.levelAfter)}</span>
          {progressAfter.nextXP && (
            <span>{progressAfter.nextXP - progressAfter.currentXP} pts to next level</span>
          )}
        </div>
        <div className="result-progress__track">
          <div
            className="result-progress__fill"
            style={{ width: `${barPct}%`, transition: 'width 0.8s ease-out' }}
          />
        </div>
      </div>

      {/* Word list */}
      <ul className="result-word-list">
        {summary.cards.map((card, i) => (
          <li
            key={`${card.word.word}-${i}`}
            className={`result-word-item ${card.correct ? 'result-word-item--correct' : 'result-word-item--incorrect'}`}
          >
            <MasteryCircle pct={card.masteryPct} size={40} />
            <div className="result-word-item__info">
              <span className="result-word-item__article">
                {card.word.gender === 'feminine' ? labels.feminine : labels.masculine}
              </span>
              <span className="result-word-item__noun">{card.word.word}</span>
              <span className="result-word-item__translation">{card.word.translation}</span>
              {card.word.patternNote && (
                <span className="result-word-item__note">{card.word.patternNote}</span>
              )}
            </div>
            <span className="result-word-item__indicator">
              {card.correct ? '✓' : '✗'}
            </span>
          </li>
        ))}
      </ul>

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
