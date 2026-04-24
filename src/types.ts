export type Language = 'pt' | 'es' | 'fr' | 'it'

export type Gender = 'masculine' | 'feminine'

export interface Word {
  id: string
  word: string
  translation: string
  gender: Gender
  article: string    // definite article for this word (e.g. 'l\'', 'lo', 'il', 'la')
  hint?: string      // disambiguation for dual-gender words (e.g. 'purpose')
  rank: number
  patternNote?: string
}

export interface Settings {
  soundEnabled: boolean
  hapticsEnabled: boolean
  showTranslationByDefault: boolean
}

export interface StreakData {
  count: number
  lastPlayedDate: string // ISO date string YYYY-MM-DD
}

export interface LanguageScore {
  score: number         // accumulated decorative points
  level: number         // cached XP level for convenience in a few write paths
  masteredCount: number // words with learner-facing mastery ≥ 80%
}

export type LevelName = 'Rookie' | 'Apprentice' | 'Scholar' | 'Linguist' | 'Polyglot'

// Thresholds based on number of words with learner-facing mastery ≥ 80% per language
export const LEVEL_THRESHOLDS: { mastered: number; name: LevelName }[] = [
  { mastered: 0,     name: 'Rookie' },
  { mastered: 50,    name: 'Apprentice' },
  { mastered: 200,   name: 'Scholar' },
  { mastered: 600,   name: 'Linguist' },
  { mastered: 1500,  name: 'Polyglot' },
]

export const LANGUAGE_LABELS: Record<
  Language,
  { name: string; flag: string }
> = {
  pt: { name: 'Portuguese', flag: '🇧🇷' },
  es: { name: 'Spanish',    flag: '🇪🇸' },
  fr: { name: 'French',     flag: '🇫🇷' },
  it: { name: 'Italian',    flag: '🇮🇹' },
}

export interface CardResult {
  word: Word
  correct: boolean
  translationUsed: boolean
  masteryBefore: number
  masteryAfter: number
}

export interface RoundSummary {
  language: Language
  cards: CardResult[]
  score: number // first-try correct count across unique words answered in the round
  pointsEarned: number
  masteredBefore: number  // words mastered before the round
  masteredAfter: number   // words mastered after the round
  levelBefore: number     // XP level before the round
  levelAfter: number      // XP level after the round
  passed: boolean
}
