import type { Language, Word } from '../types'
import { ACTIVE_ROTATION_MASTERY_THRESHOLD } from './mastery'
import { getManuallyMastered, getSRSCard, getWordMastery } from './storage'

// Dynamically import word JSON files (bundled at build time)
const wordFiles: Record<Language, () => Promise<{ default: unknown[] }>> = {
  pt: () => import('../data/words_pt.json'),
  es: () => import('../data/words_es.json'),
  fr: () => import('../data/words_fr.json'),
  it: () => import('../data/words_it.json'),
}

const cache: Partial<Record<Language, Word[]>> = {}
const ROUND_SIZE = 10
const RECENT_REVIEW_SLOTS = 3

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
    if (manuallyMastered.has(word.id)) continue
    const card = getSRSCard(language, word.id)
    if (card && card.reps > 0) {
      // Keep recently learned words in the active rotation a little longer
      // so short play sessions feel more responsive.
      if (getWordMastery(language, word.id, card) >= ACTIVE_ROTATION_MASTERY_THRESHOLD) continue
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
  notYetDueWords.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  const combined: Word[] = dueWords.slice(0, ROUND_SIZE).map((d) => d.word)

  // Reserve a few slots for near-due review so cards come back sooner
  // even when there are plenty of unseen words available.
  const recentReviewCount = Math.min(
    RECENT_REVIEW_SLOTS,
    Math.max(0, ROUND_SIZE - combined.length),
    notYetDueWords.length
  )
  combined.push(...notYetDueWords.slice(0, recentReviewCount).map((d) => d.word))
  combined.push(...newWords.slice(0, ROUND_SIZE - combined.length))

  // Fallback tier 2: more not-yet-due SRS words, soonest first
  if (combined.length < ROUND_SIZE) {
    combined.push(
      ...notYetDueWords
        .slice(recentReviewCount, recentReviewCount + (ROUND_SIZE - combined.length))
        .map((d) => d.word)
    )
  }

  // Fallback tier 3: SRS-mastered words, nearest due first (last resort)
  if (combined.length < ROUND_SIZE) {
    const masteredWords: { word: Word; dueDate: Date }[] = []
    for (const word of allWords) {
      if (manuallyMastered.has(word.id)) continue
      const card = getSRSCard(language, word.id)
      if (card && getWordMastery(language, word.id, card) >= ACTIVE_ROTATION_MASTERY_THRESHOLD) {
        masteredWords.push({ word, dueDate: new Date(card.due) })
      }
    }
    masteredWords.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    combined.push(...masteredWords.slice(0, ROUND_SIZE - combined.length).map((d) => d.word))
  }

  return combined.slice(0, ROUND_SIZE)
}
