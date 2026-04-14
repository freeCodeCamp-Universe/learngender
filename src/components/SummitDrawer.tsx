import type { Language, RoundSummary } from '../types'
import { LANGUAGE_LABELS, LEVEL_THRESHOLDS } from '../types'
import { getLevelProgressFromMastered } from '../lib/levels'
import { MasteryCircle } from './MasteryCircle'

interface SummitDrawerProps {
  summary: RoundSummary
  language: Language
  onNext: () => void
  onExit: () => void
}

function getBadge(score: number) {
  if (score >= 7) return { emoji: '🏆', label: 'Excellent Job!' }
  if (score >= 5) return { emoji: '⭐', label: 'Great Job!' }
  return { emoji: '👍', label: 'Good Job!' }
}

export function SummitDrawer({ summary, language, onNext, onExit }: SummitDrawerProps) {
  const labels = LANGUAGE_LABELS[language]

  // Deduplicated cards — first attempt per word (most honest result)
  const uniqueCards = summary.cards.reduce<typeof summary.cards>((acc, r) => {
    if (!acc.find(x => x.word.word === r.word.word)) acc.push(r)
    return acc
  }, [])

  const uniqueCorrect = uniqueCards.filter(r => r.correct).length
  const uniqueTotal   = uniqueCards.length
  const badge = getBadge(uniqueCorrect)

  const leveledUp = summary.levelAfter > summary.levelBefore
  const progress = getLevelProgressFromMastered(summary.masteredAfter)
  const { name: levelName, pct, masteredCount, nextThreshold } = progress

  return (
    <div className="summit-drawer">
      <div className="summit-drawer__handle" />

      {/* Badge */}
      <div className="summit-drawer__badge">
        <span className="summit-drawer__badge-emoji">{badge.emoji}</span>
        <span className="summit-drawer__badge-label">{badge.label}</span>
        <span className="summit-drawer__badge-score">{uniqueCorrect} / {uniqueTotal}</span>
      </div>

      {/* XP + level bar */}
      <div className="summit-drawer__xp">
        <div className="summit-drawer__xp-row">
          <span className="summit-drawer__level-name">{levelName}</span>
          <span className="summit-drawer__pts">
            {masteredCount}{nextThreshold ? ` / ${nextThreshold}` : ''} words{leveledUp ? '  🎉 Level up!' : ''}
          </span>
        </div>
        <div className="summit-drawer__bar-track">
          <div className="summit-drawer__bar-fill" style={{ width: `${pct}%` }} />
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
