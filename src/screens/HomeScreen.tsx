import { useState } from 'react'
import type { Language } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getScore, getSeenCount, getStreak } from '../lib/storage'
import { getLevelProgressFromMastered } from '../lib/levels'
import { SettingsPanel } from './SettingsPanel'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']
const SEGMENT_COUNT = 5

const LANG_COLOR: Record<Language, string> = {
  pt: 'var(--lang-pt)',
  es: 'var(--lang-es)',
  fr: 'var(--lang-fr)',
  it: 'var(--lang-it)',
}

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
        <button className="icon-btn" onClick={onMyWords} aria-label="My words">☰</button>
        <div className="home-screen__title">
          <h1>LearnNounGender</h1>
          <p className="home-screen__tagline">Master noun gender in 4 languages</p>
        </div>
        <button className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label="Settings">⚙️</button>
      </div>

      {/* Streak */}
      <div className="home-screen__streak" aria-label={`${streak.count} day streak`}>
        🔥 <span className="streak-count">{streak.count}</span>
        <span className="streak-label">day streak</span>
      </div>

      {/* Elevate-style skill rows */}
      <div className="skill-list">
        {LANGUAGES.map((lang) => {
          const labels = LANGUAGE_LABELS[lang]
          const scoreData = getScore(lang)
          const seenCount = getSeenCount(lang)
          const masteredCount = scoreData.masteredCount ?? 0
          const seenProgress = getLevelProgressFromMastered(seenCount)
          const color = LANG_COLOR[lang]
          const seenCompletedLevels = seenProgress.level - 1

          return (
            <button
              key={lang}
              className="skill-row"
              onClick={() => onStartRound(lang)}
              aria-label={`Play ${labels.name} — ${seenProgress.name}`}
            >
              <div className="skill-row__header">
                <span className="skill-row__score" style={{ color }}>{scoreData.score}</span>
                <span className="skill-row__name">{labels.name}</span>
                <span className="skill-row__level">{seenProgress.name.toUpperCase()}</span>
              </div>

              {/* Mastered count badge */}
              <div
                className="skill-row__mastered-badge"
                onClick={(e) => { e.stopPropagation(); onMyWords() }}
                role="button"
                aria-label={`${masteredCount} words mastered — view My Words`}
              >
                ⭐ {masteredCount} mastered
              </div>

              {/* Seen words bar (fast progress) */}
              <div className="skill-row__segments" aria-hidden="true">
                {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
                  const full = i < seenCompletedLevels
                  const active = i === seenCompletedLevels
                  return (
                    <div key={i} className="skill-row__seg">
                      {(full || active) && (
                        <div
                          className="skill-row__seg-fill"
                          style={{
                            background: color,
                            width: full ? '100%' : `${seenProgress.pct}%`,
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

            </button>
          )
        })}
      </div>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
