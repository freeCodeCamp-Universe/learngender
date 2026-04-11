import { useEffect, useState } from 'react'
import type { Language, Word } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getMastery } from '../lib/srs'
import { getSeenWords, getSRSCard, getSettings } from '../lib/storage'
import { getWords } from '../lib/wordLoader'
import { MasteryCircle } from '../components/MasteryCircle'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']

interface WordEntry {
  word: Word
  masteryPct: number
}

interface MyWordsScreenProps {
  onHome: () => void
}

export function MyWordsScreen({ onHome }: MyWordsScreenProps) {
  const [selectedLang, setSelectedLang] = useState<Language>('pt')
  const [entries, setEntries] = useState<WordEntry[]>([])
  const settings = getSettings()

  useEffect(() => {
    async function load() {
      const allWords = await getWords(selectedLang)
      const seen = getSeenWords(selectedLang)

      const wordEntries: WordEntry[] = allWords
        .filter((w) => seen.has(w.word))
        .map((w) => {
          const card = getSRSCard(selectedLang, w.word)
          return { word: w, masteryPct: getMastery(card) }
        })
        .sort((a, b) => a.masteryPct - b.masteryPct) // least mastered first

      setEntries(wordEntries)
    }
    load()
  }, [selectedLang])

  const mastered = entries.filter((e) => e.masteryPct >= 80).length

  return (
    <div className="my-words-screen">
      {/* Header */}
      <div className="my-words-screen__header">
        <button className="icon-btn" onClick={onHome} aria-label="Home">
          ☰
        </button>
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
            onClick={() => setSelectedLang(lang)}
          >
            {LANGUAGE_LABELS[lang].flag} {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Summary */}
      <p className="my-words-summary">
        {entries.length} words seen · {mastered} mastered
      </p>

      {/* Word list */}
      {entries.length === 0 ? (
        <p className="my-words-empty">
          No words yet — play a round in {LANGUAGE_LABELS[selectedLang].name} to get started!
        </p>
      ) : (
        <ul className="my-words-list">
          {entries.map(({ word, masteryPct }) => {
            const labels = LANGUAGE_LABELS[selectedLang]
            const article = word.gender === 'feminine' ? labels.feminine : labels.masculine

            return (
              <li key={word.word} className="my-words-item">
                <MasteryCircle pct={masteryPct} size={40} />
                <div className="my-words-item__info">
                  <span className="my-words-item__article">{article}</span>
                  <span className="my-words-item__noun">{word.word}</span>
                  {settings.showTranslationByDefault && (
                    <span className="my-words-item__translation">{word.translation}</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
