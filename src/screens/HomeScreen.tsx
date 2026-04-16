import { useState } from 'react'
import homeIcon from '../components/icons/home.svg'
import starIcon from '../components/icons/star.svg'
import settingsIcon from '../components/icons/settings.svg'
import type { Language } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getScore, getSeenCount, getStreak } from '../lib/storage'
import { getLevelProgressFromMastered } from '../lib/levels'
import { SettingsPanel } from './SettingsPanel'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']
const SEGMENT_COUNT = 5

const LANG_COLOR: Record<Language, string> = {
  pt: '#6c63ff',
  es: '#3b8beb',
  fr: '#34a85a',
  it: '#e8a020',
}

const LEVEL_COLOR: Record<string, string> = {
  New:        '#aaaaaa',
  Rookie:     '#34a85a',
  Apprentice: '#3b8beb',
  Scholar:    '#6c63ff',
  Linguist:   '#e8630a',
  Polyglot:   '#e8a020',
}

interface HomeScreenProps {
  onStartRound: (language: Language) => void
  onMyWords: () => void
  onTheory: () => void
}

export function HomeScreen({ onStartRound, onMyWords, onTheory }: HomeScreenProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const streak = getStreak()
  const totalXP = LANGUAGES.reduce((sum, lang) => sum + getScore(lang).score, 0)

  return (
    <div className="home-screen">
      {/* Top bar */}
      <div className="home-screen__topbar">
        <div className="home-screen__xp-pill">
          <span className="home-screen__flame">🔥</span>
          <span className="home-screen__streak-count">{streak.count}</span>
          <span className="home-screen__xp-sep">·</span>
          <span className="home-screen__xp-count">{totalXP.toLocaleString()}</span>
          <span className="home-screen__xp-label">xp</span>
        </div>
        <button className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label="Settings">
          <img src={settingsIcon} alt="" width="22" height="22" className="home-screen__settings-icon" />
        </button>
      </div>

      {/* Title */}
      <div className="home-screen__title">
        <h1>LearnNounGender</h1>
        <p className="home-screen__tagline">choose a language to practice</p>
      </div>

      {/* Language cards */}
      <div className="skill-list">
        {LANGUAGES.map((lang) => {
          const labels = LANGUAGE_LABELS[lang]
          const scoreData = getScore(lang)
          const seenCount = getSeenCount(lang)
          const masteredCount = scoreData.masteredCount ?? 0
          const isNew = seenCount === 0
          const progress = getLevelProgressFromMastered(masteredCount)
          const levelName = isNew ? 'New' : progress.name
          const color = LANG_COLOR[lang]
          const levelColor = LEVEL_COLOR[levelName] ?? '#aaaaaa'
          const completedSegments = progress.level - 1

          return (
            <div key={lang} className="skill-card">
              {/* Card header: flag + name | level badge */}
              <div className="skill-card__header">
                <span className="skill-card__flag">{labels.flag}</span>
                <span className="skill-card__name">{labels.name}</span>
                <span
                  className="skill-card__level-badge"
                  style={{ background: `${levelColor}22`, color: levelColor, borderColor: `${levelColor}55` }}
                >
                  {levelName}
                </span>
              </div>

              {/* Progress bar — 5 segments based on seen words */}
              {!isNew && (
                <div className="skill-card__segments" aria-hidden="true">
                  {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
                    const full   = i < completedSegments
                    const active = i === completedSegments
                    return (
                      <div key={i} className="skill-card__seg">
                        {(full || active) && (
                          <div
                            className="skill-card__seg-fill"
                            style={{
                              background: color,
                              width: full ? '100%' : `${progress.pct}%`,
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {isNew && (
                <div className="skill-card__segments skill-card__segments--empty" aria-hidden="true">
                  {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
                    <div key={i} className="skill-card__seg" />
                  ))}
                </div>
              )}

              {/* Footer: mastered count | Practice/Start button */}
              <div className="skill-card__footer">
                <span className="skill-card__mastered">
                  <strong>{seenCount - masteredCount}</strong> learning · <strong>{masteredCount}</strong> mastered
                </span>
                <button
                  className="skill-card__cta"
                  onClick={() => onStartRound(lang)}
                >
                  {isNew ? 'Start' : 'Play'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom nav */}
      <div className="home-screen__bottom-nav">
        <button className="bottom-nav__btn bottom-nav__btn--active" aria-label="Home">
          <img src={homeIcon} alt="" width="22" height="22" className="bottom-nav__icon bottom-nav__icon--home" />
          <span>Home</span>
        </button>
        <button className="bottom-nav__btn" onClick={onTheory} aria-label="Theory">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
          <span>Theory</span>
        </button>
        <button className="bottom-nav__btn" onClick={onMyWords} aria-label="My Words">
          <img src={starIcon} alt="" width="22" height="22" className="bottom-nav__icon" />
          <span>Words</span>
        </button>
      </div>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
