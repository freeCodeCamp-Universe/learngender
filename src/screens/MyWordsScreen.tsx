import { useEffect, useState } from 'react'
import type { Language, Word } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getMastery } from '../lib/srs'
import { addScore, getSeenWords, getSRSCard, getMasteredCount, isManuallyMastered, toggleManuallyMastered } from '../lib/storage'
import { getWords } from '../lib/wordLoader'
import { MasteryCircle } from '../components/MasteryCircle'
import { getLevelProgressFromMastered } from '../lib/levels'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']
const SEGMENT_COUNT = 5

const LANG_COLOR: Record<Language, string> = {
  pt: '#6c63ff',
  es: '#3b8beb',
  fr: '#34a85a',
  it: '#e8a020',
}

interface WordEntry {
  word: Word
  masteryPct: number
  manuallyMastered: boolean
}

interface MyWordsScreenProps {
  onHome: () => void
  onTheory: () => void
}

export function MyWordsScreen({ onHome, onTheory }: MyWordsScreenProps) {
  const [selectedLang, setSelectedLang] = useState<Language>('pt')
  const [tab, setTab] = useState<'learning' | 'mastered'>('learning')
  const [entries, setEntries] = useState<WordEntry[]>([])
  async function load(lang: Language) {
    const allWords = await getWords(lang)
    const seen = getSeenWords(lang)

    const wordEntries: WordEntry[] = allWords
      .filter((w) => seen.has(w.word))
      .map((w) => {
        const card = getSRSCard(lang, w.word)
        return {
          word: w,
          masteryPct: getMastery(card),
          manuallyMastered: isManuallyMastered(lang, w.word),
        }
      })
      .sort((a, b) => a.masteryPct - b.masteryPct)

    setEntries(wordEntries)
  }

  useEffect(() => {
    let cancelled = false

    getWords(selectedLang).then((allWords) => {
      if (cancelled) return
      const seen = getSeenWords(selectedLang)
      const wordEntries: WordEntry[] = allWords
        .filter((w) => seen.has(w.word))
        .map((w) => {
          const card = getSRSCard(selectedLang, w.word)
          return {
            word: w,
            masteryPct: getMastery(card),
            manuallyMastered: isManuallyMastered(selectedLang, w.word),
          }
        })
        .sort((a, b) => a.masteryPct - b.masteryPct)

      setEntries(wordEntries)
    })

    return () => {
      cancelled = true
    }
  }, [selectedLang])

  async function handleToggleMastered(word: string) {
    toggleManuallyMastered(selectedLang, word)
    // Recalculate and persist masteredCount so home screen level bar updates
    const allWords = await getWords(selectedLang)
    const wordList = allWords.map(w => w.word)
    const newMasteredCount = getMasteredCount(selectedLang, wordList)
    const { level: newLevel } = getLevelProgressFromMastered(newMasteredCount)
    addScore(selectedLang, 0, newMasteredCount, newLevel)
    load(selectedLang)
  }

  const learningEntries = entries.filter(e => !e.manuallyMastered && e.masteryPct < 80)
  const masteredEntries = entries.filter(e => e.manuallyMastered || e.masteryPct >= 80)
  const masteredCount = masteredEntries.length
  const masteredProgress = getLevelProgressFromMastered(masteredCount)

  return (
    <div className="my-words-screen">
      {/* Header */}
      <div className="my-words-screen__header">
        <h1>My Words</h1>
      </div>

      {/* Language tabs */}
      <div className="lang-tabs" role="tablist">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            role="tab"
            aria-selected={selectedLang === lang}
            className={`lang-tab ${selectedLang === lang ? 'lang-tab--active' : ''}`}
            onClick={() => {
              if (selectedLang === lang) return
              setEntries([])
              setSelectedLang(lang)
            }}
          >
            {LANGUAGE_LABELS[lang].flag} {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Mastered progress bar */}
      <div className="my-words-progress">
        <div className="my-words-progress__header">
          <span className="my-words-progress__level">{masteredProgress.name.toUpperCase()}</span>
          <span className="my-words-progress__count">
            {masteredCount}{masteredProgress.nextThreshold ? ` / ${masteredProgress.nextThreshold}` : ''} mastered
          </span>
        </div>
        <div className="my-words-progress__segments" aria-hidden="true">
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
            const full = i < masteredProgress.level - 1
            const active = i === masteredProgress.level - 1
            return (
              <div key={i} className="my-words-progress__seg">
                {(full || active) && (
                  <div
                    className="my-words-progress__seg-fill"
                    style={{ width: full ? '100%' : `${masteredProgress.pct}%`, background: LANG_COLOR[selectedLang] }}
                  />
                )}
              </div>
            )
          })}
        </div>
        <p className="my-words-summary">{entries.length} seen · {masteredCount} mastered</p>
      </div>

      {/* Learning / Mastered tabs */}
      <div className="my-words-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'learning'}
          className={`my-words-tab ${tab === 'learning' ? 'my-words-tab--active' : ''}`}
          onClick={() => setTab('learning')}
        >
          Learning ({learningEntries.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'mastered'}
          className={`my-words-tab ${tab === 'mastered' ? 'my-words-tab--active' : ''}`}
          onClick={() => setTab('mastered')}
        >
          Mastered ({masteredEntries.length})
        </button>
      </div>

      {tab === 'learning' && (
        learningEntries.length === 0
          ? <p className="my-words-empty">No words in learning yet — play a round in {LANGUAGE_LABELS[selectedLang].name}!</p>
          : <ul className="my-words-list">
              {learningEntries.map(({ word, masteryPct }) => (
                <WordRow
                  key={word.word}
                  word={word}
                  masteryPct={masteryPct}
                  isMastered={false}

                  language={selectedLang}
                  onToggle={handleToggleMastered}
                />
              ))}
            </ul>
      )}

      {tab === 'mastered' && (
        masteredEntries.length === 0
          ? <p className="my-words-empty">No mastered words yet — keep playing!</p>
          : <ul className="my-words-list">
              {masteredEntries.map(({ word, masteryPct, manuallyMastered }) => (
                <WordRow
                  key={word.word}
                  word={word}
                  masteryPct={masteryPct}
                  isMastered={true}
                  isManual={manuallyMastered}

                  language={selectedLang}
                  onToggle={handleToggleMastered}
                />
              ))}
            </ul>
      )}
      {/* Bottom nav */}
      <div className="home-screen__bottom-nav">
        <button className="bottom-nav__btn bottom-nav__btn--home" onClick={onHome} aria-label="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </button>
        <button className="bottom-nav__btn bottom-nav__btn--theory" onClick={onTheory} aria-label="Theory">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <span>Theory</span>
        </button>
        <button className="bottom-nav__btn bottom-nav__btn--active bottom-nav__btn--words" aria-label="My Words">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>Words</span>
        </button>
      </div>
    </div>
  )
}

interface WordRowProps {
  word: Word
  masteryPct: number
  isMastered: boolean
  isManual?: boolean
  language: Language
  onToggle: (word: string) => void
}

function WordRow({ word, masteryPct, isMastered, language, onToggle }: WordRowProps) {
  const labels = LANGUAGE_LABELS[language]
  const article = word.gender === 'feminine' ? labels.feminine : labels.masculine

  return (
    <li className="my-words-item">
      <MasteryCircle pct={masteryPct} size={34} />
      <span className="my-words-item__article">{article}</span>
      <span className="my-words-item__noun">{word.word}</span>
      <span className="my-words-item__translation">{word.translation}</span>
      <button
        className="my-words-item__toggle"
        onClick={() => onToggle(word.word)}
      >
        {isMastered ? 'Move to learning' : 'Mark as mastered'}
      </button>
    </li>
  )
}
