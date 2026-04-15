import { useState } from 'react'
import homeIcon from '../components/icons/home.svg'
import translateIcon from '../components/icons/translate.svg'
import type { Language, RoundSummary } from '../types'
import { useRound, TOTAL_LIVES } from '../hooks/useRound'
import { getSettings } from '../lib/storage'
import { MountainBackground } from '../components/MountainBackground'
import { WordCard } from '../components/WordCard'
import { Lives } from '../components/Lives'
import { LevelBadge } from '../components/LevelBadge'
import { SummitDrawer } from '../components/SummitDrawer'
import { LANGUAGE_LABELS } from '../types'

interface GameScreenProps {
  language: Language
  onRoundEnd: (summary: RoundSummary) => void
  onPlayAgain: () => void
  onHome: () => void
}

export function GameScreen({ language, onRoundEnd, onPlayAgain, onHome }: GameScreenProps) {
  const { state, currentWord, answer } = useRound(language, onRoundEnd)
  const labels = LANGUAGE_LABELS[language]
  const [showTranslation, setShowTranslation] = useState(() => getSettings().showTranslationByDefault)

  const isSummit = state.phase === 'summit'
  const isDone   = state.phase === 'done'
  const levelBadgeKey = isSummit && state.summary
    ? `${language}-summit-${state.summary.pointsEarned}-${state.summary.levelAfter}`
    : `${language}-live`

  if (state.phase === 'init_failed') {
    return (
      <div className="game-screen game-screen--loading">
        <p>Couldn't start the next round.</p>
        <button onClick={onHome}>Home</button>
      </div>
    )
  }

  if (state.phase === 'loading') {
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
        <div className="game-screen__topbar-left">
          <button className="game-screen__home-btn" onClick={onHome} aria-label="Return to home">
            <img src={homeIcon} alt="" width="20" height="20" />
          </button>
          <LevelBadge
            key={levelBadgeKey}
            language={language}
            summary={isSummit ? state.summary : null}
          />
        </div>
        <Lives count={state.lives} total={TOTAL_LIVES} />
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
            <button
              className={`game-screen__translate-btn${showTranslation ? ' game-screen__translate-btn--active' : ''}`}
              onClick={() => setShowTranslation(v => !v)}
              aria-label="Toggle translation"
            >
              <img src={translateIcon} alt="" width="20" height="20" />
            </button>
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
