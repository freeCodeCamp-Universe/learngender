import type { Language, Word } from '../types'
import { getManuallyMastered, getSRSCard } from './storage'
import { getMastery } from './srs'

// Dynamically import word JSON files (bundled at build time)
const wordFiles: Record<Language, () => Promise<{ default: unknown[] }>> = {
  pt: () => import('../data/words_pt.json'),
  es: () => import('../data/words_es.json'),
  fr: () => import('../data/words_fr.json'),
  it: () => import('../data/words_it.json'),
}

const cache: Partial<Record<Language, Word[]>> = {}

export async function getWords(language: Language): Promise<Word[]> {
  if (cache[language]) return cache[language]!
  const mod = await wordFiles[language]()
  cache[language] = mod.default as Word[]
  return cache[language]!
}

export async function drawRound(language: Language): Promise<Word[]> {
  const allWords = await getWords(language)
  const manuallyMastered = getManuallyMastered(language)

  const dueWords: { word: Word; dueDate: Date }[] = []
  const notYetDueWords: { word: Word; dueDate: Date }[] = []
  const newWords: Word[] = []

  for (const word of allWords) {
    if (manuallyMastered.has(word.word)) continue
    const card = getSRSCard(language, word.word)
    if (card && card.reps > 0) {
      if (getMastery(card) >= 80) continue // SRS mastered — skip
      const due = new Date(card.due)
      if (due <= new Date()) {
        dueWords.push({ word, dueDate: due })
      } else {
        notYetDueWords.push({ word, dueDate: due })
      }
    } else {
      newWords.push(word) // never seen, ordered by rank (most frequent first)
    }
  }

  // Due words: oldest due date first
  dueWords.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  const combined: Word[] = [...dueWords.map((d) => d.word), ...newWords]

  // Fallback: if not enough cards, fill with soonest-due words
  if (combined.length < 10) {
    notYetDueWords.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    const needed = 10 - combined.length
    combined.push(...notYetDueWords.slice(0, needed).map((d) => d.word))
  }

  return combined.slice(0, 10)
}
