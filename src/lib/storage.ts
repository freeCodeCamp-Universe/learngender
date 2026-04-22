import type { Card } from 'ts-fsrs'
import type { Language, LanguageScore, Settings, StreakData } from '../types'
import { getMastery } from './srs'

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
  masteredCount: 0,
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
export function getSRSCard(language: Language, wordId: string): Card | null {
  return safeGet<Card | null>(`lng_srs_${language}_${wordId}`, null)
}

export function setSRSCard(language: Language, wordId: string, card: Card): void {
  safeSet(`lng_srs_${language}_${wordId}`, card)
}

// Count words with mastery ≥ 80% (SRS) OR manually mastered
export function getMasteredCount(language: Language, wordIds: string[]): number {
  const manual = getManuallyMastered(language)
  let count = 0
  for (const wordId of wordIds) {
    if (manual.has(wordId)) { count++; continue }
    const card = getSRSCard(language, wordId)
    if (getMastery(card) >= 80) count++
  }
  return count
}

// Score / level
export function getScore(language: Language): LanguageScore {
  return safeGet(`lng_score_${language}`, DEFAULT_SCORE)
}

export function setScore(language: Language, data: LanguageScore): void {
  safeSet(`lng_score_${language}`, data)
}

export function addScore(language: Language, points: number, masteredCount?: number, level?: number): LanguageScore {
  const current = getScore(language)
  const updated: LanguageScore = {
    score: current.score + points,
    level: level ?? current.level,
    masteredCount: masteredCount ?? current.masteredCount ?? 0,
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

export function markWordSeen(language: Language, wordId: string): void {
  const seen = getSeenWords(language)
  seen.add(wordId)
  safeSet(`lng_seen_${language}`, Array.from(seen))
}

export function getSeenCount(language: Language): number {
  return getSeenWords(language).size
}

// Manually mastered words
export function getManuallyMastered(language: Language): Set<string> {
  const arr = safeGet<string[]>(`lng_manual_mastered_${language}`, [])
  return new Set(arr)
}

export function toggleManuallyMastered(language: Language, wordId: string): boolean {
  const set = getManuallyMastered(language)
  if (set.has(wordId)) {
    set.delete(wordId)
  } else {
    set.add(wordId)
  }
  safeSet(`lng_manual_mastered_${language}`, Array.from(set))
  return set.has(wordId)
}

export function isManuallyMastered(language: Language, wordId: string): boolean {
  return getManuallyMastered(language).has(wordId)
}
