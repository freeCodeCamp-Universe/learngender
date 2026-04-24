import { useEffect, useState } from 'react'
import type { Language, Word } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { addScore, getSeenWords, getMasteredCount, getWordMastery, isManuallyMastered, toggleManuallyMastered } from '../lib/storage'
import { getWords } from '../lib/wordLoader'
import { MasteryCircle } from '../components/MasteryCircle'
import { getMasteryTierOverview } from '../lib/levels'
import { MASTERED_THRESHOLD } from '../lib/mastery'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']
const SEGMENT_COUNT = 5

const LANG_COLOR: Record<Language, string> = {
  pt: '#6c63ff',
  es: '#3b8beb',
  fr: '#7fd96b',
  it: '#ffd75a',
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
      .filter((w) => seen.has(w.id))
      .map((w) => {
        return {
          word: w,
          masteryPct: getWordMastery(lang, w.id),
          manuallyMastered: isManuallyMastered(lang, w.id),
        }
      })
      .sort((a, b) => b.masteryPct - a.masteryPct)

    setEntries(wordEntries)
  }

  useEffect(() => {
    let cancelled = false

    getWords(selectedLang).then((allWords) => {
      if (cancelled) return
      const seen = getSeenWords(selectedLang)
      const wordEntries: WordEntry[] = allWords
        .filter((w) => seen.has(w.id))
        .map((w) => {
          return {
            word: w,
            masteryPct: getWordMastery(selectedLang, w.id),
            manuallyMastered: isManuallyMastered(selectedLang, w.id),
          }
        })
        .sort((a, b) => b.masteryPct - a.masteryPct)

      setEntries(wordEntries)
    })

    return () => {
      cancelled = true
    }
  }, [selectedLang])

  async function handleToggleMastered(wordId: string) {
    toggleManuallyMastered(selectedLang, wordId)
    // Recalculate and persist masteredCount so home screen mastery bar updates
    const allWords = await getWords(selectedLang)
    const wordIds = allWords.map(w => w.id)
    const newMasteredCount = getMasteredCount(selectedLang, wordIds)
    addScore(selectedLang, 0, newMasteredCount)
    load(selectedLang)
  }

  const learningEntries = entries.filter(e => !e.manuallyMastered && e.masteryPct < MASTERED_THRESHOLD)
  const masteredEntries = entries.filter(e => e.manuallyMastered || e.masteryPct >= MASTERED_THRESHOLD)
  const masteredCount = masteredEntries.length
  const masteryTier = getMasteryTierOverview(masteredCount)

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
          <span className="my-words-progress__level">{masteryTier.name.toUpperCase()}</span>
          <span className="my-words-progress__count">
            {masteredCount}{masteryTier.nextThreshold ? ` / ${masteryTier.nextThreshold}` : ''} mastered
          </span>
        </div>
        <div className="my-words-progress__segments" aria-hidden="true">
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
            const full = i < masteryTier.tier - 1
            const active = i === masteryTier.tier - 1
            return (
              <div key={i} className="my-words-progress__seg">
                {(full || active) && (
                  <div
                    className="my-words-progress__seg-fill"
                    style={{ width: full ? '100%' : `${masteryTier.pct}%`, background: LANG_COLOR[selectedLang] }}
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
                  key={word.id}
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
                  key={word.id}
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
  onToggle: (wordId: string) => void
}

function WordRow({ word, masteryPct, isMastered, onToggle }: WordRowProps) {
  const article = word.article

  return (
    <li className="my-words-item">
      <MasteryCircle pct={masteryPct} size={34} />
      <span className="my-words-item__article">{article}</span>
      <span className="my-words-item__noun">{word.word}</span>
      <span className="my-words-item__translation">{word.translation}</span>
      <button
        className="my-words-item__toggle"
        onClick={() => onToggle(word.id)}
      >
        {isMastered ? 'Move to learning' : 'Mark as mastered'}
      </button>
    </li>
  )
}
