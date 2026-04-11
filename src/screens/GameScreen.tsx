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
  onHome: () => void
}

export function GameScreen({ language, onRoundEnd, onHome }: GameScreenProps) {
  const settings = getSettings()
  const { state, currentWord, answer } = useRound(language, onRoundEnd)
  const labels = LANGUAGE_LABELS[language]

  if (state.phase === 'loading' || !currentWord) {
    return (
      <div className="game-screen game-screen--loading">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={`game-screen ${state.isShaking ? 'game-screen--shake' : ''}`}>
      <MountainBackground rows={state.rows} />

      {/* Top bar */}
      <div className="game-screen__topbar">
        <button
          className="icon-btn"
          onClick={onHome}
          aria-label="Return to home"
        >
          ☰
        </button>
        <Lives count={state.lives} />
      </div>

      {/* Gender bands */}
      <div className="gender-band gender-band--left" aria-label={`Feminine: ${labels.feminine}`}>
        <span className="gender-band__article">{labels.feminine}</span>
      </div>
      <div className="gender-band gender-band--right" aria-label={`Masculine: ${labels.masculine}`}>
        <span className="gender-band__article">{labels.masculine}</span>
      </div>

      {/* Card area */}
      <div className="game-screen__card-area">
        <WordCard
          word={currentWord}
          onSwipe={answer}
          showTranslationByDefault={settings.showTranslationByDefault}
        />

        <p className="swipe-hint" aria-hidden="true">
          ← {labels.feminine} &nbsp;&nbsp; {labels.masculine} →
        </p>
      </div>

      {/* Progress indicator */}
      <div className="game-screen__progress" aria-label={`${state.score} correct`}>
        {state.score} / 10
      </div>
    </div>
  )
}
