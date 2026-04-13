import type { Language, RoundSummary } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { useRound } from '../hooks/useRound'
import { MountainBackground } from '../components/MountainBackground'
import { WordCard } from '../components/WordCard'
import { Lives } from '../components/Lives'
import { getSettings } from '../lib/storage'

interface GameScreenProps {
  language: Language
  onRoundEnd: (summary: RoundSummary) => void
  onPlayAgain: () => void
  onHome: () => void
}

function getBadge(score: number) {
  if (score >= 7) return { emoji: '🏆', label: 'Excellent Job' }
  if (score >= 5) return { emoji: '⭐', label: 'Great Job' }
  return { emoji: '👍', label: 'Good Job' }
}

export function GameScreen({ language, onRoundEnd, onPlayAgain, onHome }: GameScreenProps) {
  const settings = getSettings()
  const { state, currentWord, answer } = useRound(language, onRoundEnd)
  const labels = LANGUAGE_LABELS[language]

  const isSummit = state.phase === 'summit'
  const isDone   = state.phase === 'done'

  if (state.phase === 'loading' || (!currentWord && !isSummit && !isDone)) {
    return (
      <div className="game-screen game-screen--loading">
        <p>Loading...</p>
      </div>
    )
  }

  const badge = isSummit && state.summary ? getBadge(state.summary.score) : null

  return (
    <div className={`game-screen ${state.isShaking ? 'game-screen--shake' : ''}`}>
      <MountainBackground hikerStep={state.hikerStep} isSummit={isSummit} />

      {/* Top bar */}
      <div className="game-screen__topbar">
        <button className="icon-btn icon-btn--dark" onClick={onHome} aria-label="Return to home">☰</button>
        <Lives count={state.lives} />
      </div>

      {!isSummit && (
        <>
          {/* Card area */}
          <div className="game-screen__card-area">
            <div className="game-screen__card-row">
              <div className="gender-band gender-band--left" aria-label="Feminine">
                <span className="gender-band__article">fem</span>
              </div>

              {currentWord && (
                <WordCard
                  word={currentWord}
                  onSwipe={answer}
                  showTranslationByDefault={settings.showTranslationByDefault}
                />
              )}

              <div className="gender-band gender-band--right" aria-label="Masculine">
                <span className="gender-band__article">masc</span>
              </div>
            </div>
            <p className="swipe-hint" aria-hidden="true">
              ← {labels.feminine} &nbsp;&nbsp; {labels.masculine} →
            </p>
          </div>

          {/* Progress */}
          <div className="game-screen__progress" aria-label={`${state.score} correct`}>
            {state.score} / 8
          </div>
        </>
      )}

      {/* Summit overlay */}
      {isSummit && state.summary && badge && (
        <div className="summit-overlay">
          <div className="summit-badge">
            <div className="summit-badge__emoji">{badge.emoji}</div>
            <div className="summit-badge__label">{badge.label}</div>
            <div className="summit-badge__score">{state.summary.score} / {state.deck?.length ?? '—'}</div>
            <div className="summit-badge__pts">
              +{state.summary.pointsEarned} pts · {state.summary.levelAfter > state.summary.levelBefore ? '🎉 Level up!' : ''}
            </div>
          </div>
          <div className="summit-actions">
            <button className="btn btn--secondary" onClick={() => onRoundEnd(state.summary!)}>
              See words
            </button>
            <button className="btn btn--primary" onClick={onPlayAgain}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
