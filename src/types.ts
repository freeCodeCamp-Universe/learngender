export type Language = 'pt' | 'es' | 'fr' | 'it'

export type Gender = 'masculine' | 'feminine'

export interface Word {
  word: string
  translation: string
  gender: Gender
  rank: number
  patternNote?: string
}

export interface Settings {
  soundEnabled: boolean
  showTranslationByDefault: boolean
}

export interface StreakData {
  count: number
  lastPlayedDate: string // ISO date string YYYY-MM-DD
}

export interface LanguageScore {
  score: number         // accumulated decorative points
  level: number         // 1–5, derived from masteredCount
  masteredCount: number // words with mastery ≥ 80%
}

export type LevelName = 'Rookie' | 'Apprentice' | 'Scholar' | 'Linguist' | 'Polyglot'

// Thresholds based on number of mastered words (mastery ≥ 80%) per language
export const LEVEL_THRESHOLDS: { mastered: number; name: LevelName }[] = [
  { mastered: 0,     name: 'Rookie' },
  { mastered: 50,    name: 'Apprentice' },
  { mastered: 200,   name: 'Scholar' },
  { mastered: 600,   name: 'Linguist' },
  { mastered: 1500,  name: 'Polyglot' },
]

export const LANGUAGE_LABELS: Record<
  Language,
  { name: string; flag: string; feminine: string; masculine: string }
> = {
  pt: { name: 'Portuguese', flag: '🇧🇷', feminine: 'a', masculine: 'o' },
  es: { name: 'Spanish', flag: '🇪🇸', feminine: 'la', masculine: 'el' },
  fr: { name: 'French', flag: '🇫🇷', feminine: 'la', masculine: 'le' },
  it: { name: 'Italian', flag: '🇮🇹', feminine: 'la', masculine: 'il' },
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
  score: number // correct count out of 10
  pointsEarned: number
  masteredBefore: number  // words mastered before the round
  masteredAfter: number   // words mastered after the round
  levelBefore: number
  levelAfter: number
  passed: boolean
}
