import { useState } from 'react'
import type { Language } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getScore, getStreak } from '../lib/storage'
import { getLevelProgress } from '../lib/levels'
import { SettingsPanel } from './SettingsPanel'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']

interface HomeScreenProps {
  onStartRound: (language: Language) => void
  onMyWords: () => void
}

export function HomeScreen({ onStartRound, onMyWords }: HomeScreenProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const streak = getStreak()

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="home-screen__header">
        <button
          className="icon-btn"
          onClick={onMyWords}
          aria-label="My words"
        >
          ☰
        </button>
        <div className="home-screen__title">
          <h1>LearnNounGender</h1>
          <p className="home-screen__tagline">Master noun gender in 4 languages</p>
        </div>
        <button
          className="icon-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Streak */}
      <div className="home-screen__streak" aria-label={`${streak.count} day streak`}>
        🔥 <span className="streak-count">{streak.count}</span>
        <span className="streak-label">day streak</span>
      </div>

      {/* Language bars */}
      <div className="home-screen__languages">
        {LANGUAGES.map((lang) => {
          const labels = LANGUAGE_LABELS[lang]
          const scoreData = getScore(lang)
          const hasPlayed = scoreData.score > 0
          const progress = getLevelProgress(scoreData.score)

          return (
            <button
              key={lang}
              className="language-bar"
              onClick={() => onStartRound(lang)}
              aria-label={`Play ${labels.name}`}
            >
              <div className="language-bar__info">
                <span className="language-bar__flag">{labels.flag}</span>
                <span className="language-bar__name">{labels.name}</span>
                {hasPlayed ? (
                  <span className="language-bar__level">{progress.name}</span>
                ) : (
                  <span className="language-bar__start">Start</span>
                )}
              </div>

              {hasPlayed && (
                <div className="language-bar__progress">
                  <div className="language-bar__score">{scoreData.score} pts</div>
                  <div className="language-bar__track">
                    <div
                      className="language-bar__fill"
                      style={{ width: `${progress.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
