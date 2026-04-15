import { useEffect, useState } from 'react'
import homeIcon from '../components/icons/home.svg'
import starIcon from '../components/icons/star.svg'
import type { Language, Word } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getMastery } from '../lib/srs'
import { addScore, getSeenWords, getSRSCard, getMasteredCount, isManuallyMastered, toggleManuallyMastered } from '../lib/storage'
import { getWords } from '../lib/wordLoader'
import { MasteryCircle } from '../components/MasteryCircle'
import { getLevelProgressFromMastered } from '../lib/levels'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']
const SEGMENT_COUNT = 5

interface WordEntry {
  word: Word
  masteryPct: number
  manuallyMastered: boolean
}

interface MyWordsScreenProps {
  onHome: () => void
}

export function MyWordsScreen({ onHome }: MyWordsScreenProps) {
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
                    style={{ width: full ? '100%' : `${masteredProgress.pct}%` }}
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
        <button className="bottom-nav__btn" onClick={onHome} aria-label="Home">
          <img src={homeIcon} alt="" width="22" height="22" className="bottom-nav__icon bottom-nav__icon--home" />
          <span>Home</span>
        </button>
        <button className="bottom-nav__btn bottom-nav__btn--active" aria-label="My Words">
          <img src={starIcon} alt="" width="22" height="22" className="bottom-nav__icon" />
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
