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
  score: number
  level: number // 1–5
}

export type LevelName = 'Rookie' | 'Apprentice' | 'Scholar' | 'Linguist' | 'Polyglot'

export const LEVEL_THRESHOLDS: { xp: number; name: LevelName }[] = [
  { xp: 0, name: 'Rookie' },
  { xp: 500, name: 'Apprentice' },
  { xp: 2000, name: 'Scholar' },
  { xp: 6000, name: 'Linguist' },
  { xp: 16000, name: 'Polyglot' },
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
  masteryPct: number
}

export interface RoundSummary {
  language: Language
  cards: CardResult[]
  score: number // correct count out of 10
  pointsEarned: number
  scoreBefore: number
  scoreAfter: number
  levelBefore: number
  levelAfter: number
  passed: boolean
}
