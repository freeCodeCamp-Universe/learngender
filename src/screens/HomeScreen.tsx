import { useEffect, useState } from 'react'
import settingsIcon from '../components/icons/settings.svg'
import type { Language } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getScore, getSeenCount, getStreak } from '../lib/storage'
import { getLevelProgressFromMastered, getXPProgress } from '../lib/levels'
import { SettingsPanel } from './SettingsPanel'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']
const SEGMENT_COUNT = 5

const LANG_COLOR: Record<Language, string> = {
  pt: '#6c63ff',
  es: '#3b8beb',
  fr: '#7fd96b',
  it: '#ffd75a',
}

const LEVEL_COLOR: Record<string, string> = {
  New:        '#aaaaaa',
  Rookie:     '#7fd96b',
  Apprentice: '#3b8beb',
  Scholar:    '#6c63ff',
  Linguist:   '#e8630a',
  Polyglot:   '#ffd75a',
}

interface HomeScreenProps {
  onStartRound: (language: Language) => void
  onMyWords: () => void
  onTheory: () => void
}

export function HomeScreen({ onStartRound, onMyWords, onTheory }: HomeScreenProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeTip, setActiveTip] = useState<'streak' | 'xp' | null>(null)
  const streak = getStreak()
  const totalXP = LANGUAGES.reduce((sum, lang) => sum + getScore(lang).score, 0)
  const streakUnit = streak.count === 1 ? 'day' : 'days'

  useEffect(() => {
    if (!activeTip) return
    function onOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as HTMLElement | null
      if (!target?.closest('.home-chip')) setActiveTip(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveTip(null)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('touchstart', onOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('touchstart', onOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [activeTip])

  function chipHandlers(id: 'streak' | 'xp') {
    return {
      onMouseEnter: () => setActiveTip(id),
      onMouseLeave: () => setActiveTip((cur) => (cur === id ? null : cur)),
      onFocus:      () => setActiveTip(id),
      onBlur:       () => setActiveTip((cur) => (cur === id ? null : cur)),
      onClick:      () => setActiveTip((cur) => (cur === id ? null : id)),
    }
  }

  return (
    <div className="home-screen">
      {/* Top bar */}
      <div className="home-screen__topbar">
        <div className="home-screen__chips">
          <button
            type="button"
            className="home-chip"
            aria-describedby="tip-streak"
            {...chipHandlers('streak')}
          >
            <span className={`home-screen__flame${streak.count === 0 ? ' home-screen__flame--inactive' : ''}`}>🔥</span>
            <span className="home-screen__streak-count">{streak.count}</span>
            <span className="home-screen__chip-label">{streakUnit}</span>
            {activeTip === 'streak' && (
              <span id="tip-streak" role="tooltip" className="home-tooltip">Current streak</span>
            )}
          </button>

          <button
            type="button"
            className="home-chip"
            aria-describedby="tip-xp"
            {...chipHandlers('xp')}
          >
            <span className="home-screen__xp-count">{totalXP.toLocaleString()}</span>
            <span className="home-screen__chip-label">xp</span>
            {activeTip === 'xp' && (
              <span id="tip-xp" role="tooltip" className="home-tooltip">Total XP</span>
            )}
          </button>
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
          const xpProgress = getXPProgress(scoreData.score)
          const levelName = isNew ? 'New' : progress.name
          const color = LANG_COLOR[lang]
          const levelColor = LEVEL_COLOR[levelName] ?? '#aaaaaa'
          const completedSegments = progress.level - 1

          return (
            <div key={lang} className="skill-card">
              {/* Card header: flag + level ring + name | level badge */}
              <div className="skill-card__header">
                {!isNew && (() => {
                  const size = 28, r = (size - 4) / 2, cx = size / 2, cy = size / 2
                  const circ = 2 * Math.PI * r
                  const xpColor = '#e8a020'
                  const filled = (xpProgress.pct / 100) * circ
                  return (
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="skill-card__level-ring" aria-label={`Level ${xpProgress.level}`}>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${xpColor}33`} strokeWidth="2.5" />
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke={xpColor} strokeWidth="2.5"
                        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
                        transform={`rotate(-90 ${cx} ${cy})`} />
                      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">{xpProgress.level}</text>
                    </svg>
                  )
                })()}
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
        <button className="bottom-nav__btn bottom-nav__btn--active bottom-nav__btn--home" aria-label="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Home</span>
        </button>
        <button className="bottom-nav__btn bottom-nav__btn--theory" onClick={onTheory} aria-label="Theory">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <span>Theory</span>
        </button>
        <button className="bottom-nav__btn bottom-nav__btn--words" onClick={onMyWords} aria-label="My Words">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>Words</span>
        </button>
      </div>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
