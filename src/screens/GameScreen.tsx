import { useEffect, useRef, useState } from 'react'
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
import { getArticlePair } from '../lib/articles'

interface GameScreenProps {
  language: Language
  onRoundEnd: (summary: RoundSummary) => void
  onPlayAgain: () => void
  onHome: () => void
}

export function GameScreen({ language, onRoundEnd, onPlayAgain, onHome }: GameScreenProps) {
  const { state, currentWord, answer } = useRound(language)
  const [showTranslation, setShowTranslation] = useState(() => getSettings().showTranslationByDefault)
  const handledSummaryRef = useRef<RoundSummary | null>(null)

  const isSummit = state.phase === 'summit'
  const isDone   = state.phase === 'done'
  const levelBadgeKey = isSummit && state.summary
    ? `${language}-summit-${state.summary.pointsEarned}-${state.summary.levelAfter}`
    : `${language}-live`

  useEffect(() => {
    if (!state.summary || (state.phase !== 'summit' && state.phase !== 'done')) return
    if (handledSummaryRef.current === state.summary) return
    handledSummaryRef.current = state.summary
    onRoundEnd(state.summary)
  }, [onRoundEnd, state.phase, state.summary])

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
              {(() => {
                const pair = currentWord ? getArticlePair(currentWord, language) : null
                const renderLabel = (article: string, qualifier: 'fém' | 'masc' | null) => (
                  <span className="gender-band__article">
                    {article}
                    {qualifier && <span className="gender-band__article-sub">{qualifier}</span>}
                  </span>
                )
                return (
                  <>
                    <div className="gender-band gender-band--left" aria-label="Feminine">
                      {renderLabel(pair?.fem ?? '←', pair?.ambiguous ? 'fém' : null)}
                    </div>

                    {currentWord && (
                      <WordCard
                        key={`${state.currentIndex}-${currentWord.id}`}
                        word={currentWord}
                        onSwipe={answer}
                        showTranslation={showTranslation}
                      />
                    )}

                    <div className="gender-band gender-band--right" aria-label="Masculine">
                      {renderLabel(pair?.masc ?? '→', pair?.ambiguous ? 'masc' : null)}
                    </div>
                  </>
                )
              })()}
            </div>
            <p className="swipe-hint" aria-hidden="true">
              {currentWord ? (() => {
                const { fem, masc, ambiguous } = getArticlePair(currentWord, language)
                const fLabel = ambiguous ? `${fem} (fem)` : fem
                const mLabel = ambiguous ? `${masc} (masc)` : masc
                return `← ${fLabel}   ${mLabel} →`
              })() : ''}
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

      {(isSummit || isDone) && state.summary && state.drawerReady && (
        <SummitDrawer
          summary={state.summary}
          mode={isDone ? 'loss' : 'win'}
          onNext={onPlayAgain}
          onExit={onHome}
        />
      )}
    </div>
  )
}
