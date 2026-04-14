import { useState } from 'react'
import translateIcon from '../components/icons/translate.svg'
import type { Language, RoundSummary } from '../types'
import { useRound, TOTAL_LIVES } from '../hooks/useRound'
import { MountainBackground } from '../components/MountainBackground'
import { WordCard } from '../components/WordCard'
import { Lives } from '../components/Lives'
import { SummitDrawer } from '../components/SummitDrawer'
import { getSettings } from '../lib/storage'
import { LANGUAGE_LABELS } from '../types'

interface GameScreenProps {
  language: Language
  onRoundEnd: (summary: RoundSummary) => void
  onPlayAgain: () => void
  onHome: () => void
}

export function GameScreen({ language, onRoundEnd, onPlayAgain, onHome }: GameScreenProps) {
  const settings = getSettings()
  const { state, currentWord, answer } = useRound(language, onRoundEnd)
  const labels = LANGUAGE_LABELS[language]
  const [showTranslation, setShowTranslation] = useState(settings.showTranslationByDefault)

  const isSummit = state.phase === 'summit'
  const isDone   = state.phase === 'done'

  if (state.phase === 'loading' || (!currentWord && !isSummit && !isDone)) {
    return (
      <div className="game-screen game-screen--loading">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={`game-screen ${state.isShaking ? 'game-screen--shake' : ''}`}>
      <MountainBackground hikerStep={state.hikerStep} isSummit={isSummit} />

      {/* Top bar */}
      <div className="game-screen__topbar">
        <button className="icon-btn icon-btn--dark" onClick={onHome} aria-label="Return to home">☰</button>
        <Lives count={state.lives} total={TOTAL_LIVES} />
      </div>

      {/* Translate toggle — below topbar, right-aligned */}
      <div className="game-screen__translate-row">
        <button
          className={`icon-btn icon-btn--dark game-screen__translate-btn${showTranslation ? ' game-screen__translate-btn--active' : ''}`}
          onClick={() => setShowTranslation(v => !v)}
          aria-label="Toggle translation"
        >
          <img src={translateIcon} alt="" width="16" height="16" />
        </button>
      </div>

      {!isSummit && !isDone && (
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
                  showTranslation={showTranslation}
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

        </>
      )}

      {/* Summit drawer */}
      {isSummit && state.summary && (
        <SummitDrawer
          summary={state.summary}
          language={language}
          onNext={onPlayAgain}
          onExit={onHome}
        />
      )}
    </div>
  )
}
