import type { Card } from 'ts-fsrs'
import type { Language, LanguageScore, Settings, StreakData } from '../types'

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  showTranslationByDefault: false,
}

const DEFAULT_STREAK: StreakData = {
  count: 0,
  lastPlayedDate: '',
}

const DEFAULT_SCORE: LanguageScore = {
  score: 0,
  level: 1,
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

// SRS card state
export function getSRSCard(language: Language, word: string): Card | null {
  return safeGet<Card | null>(`lng_srs_${language}_${word}`, null)
}

export function setSRSCard(language: Language, word: string, card: Card): void {
  safeSet(`lng_srs_${language}_${word}`, card)
}

// Score / level
export function getScore(language: Language): LanguageScore {
  return safeGet(`lng_score_${language}`, DEFAULT_SCORE)
}

export function setScore(language: Language, data: LanguageScore): void {
  safeSet(`lng_score_${language}`, data)
}

export function addScore(language: Language, points: number): LanguageScore {
  const current = getScore(language)
  const updated: LanguageScore = {
    ...current,
    score: current.score + points,
  }
  setScore(language, updated)
  return updated
}

// Streak
export function getStreak(): StreakData {
  return safeGet('lng_streak', DEFAULT_STREAK)
}

export function updateStreak(): StreakData {
  const today = new Date().toISOString().slice(0, 10)
  const current = getStreak()

  if (current.lastPlayedDate === today) {
    return current // already played today, no change
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newCount = current.lastPlayedDate === yesterday ? current.count + 1 : 1
  const updated: StreakData = { count: newCount, lastPlayedDate: today }
  safeSet('lng_streak', updated)
  return updated
}

// Settings
export function getSettings(): Settings {
  return safeGet('lng_settings', DEFAULT_SETTINGS)
}

export function setSettings(settings: Settings): void {
  safeSet('lng_settings', settings)
}

// Seen words — track which words have been encountered at least once
export function getSeenWords(language: Language): Set<string> {
  const arr = safeGet<string[]>(`lng_seen_${language}`, [])
  return new Set(arr)
}

export function markWordSeen(language: Language, word: string): void {
  const seen = getSeenWords(language)
  seen.add(word)
  safeSet(`lng_seen_${language}`, Array.from(seen))
}
