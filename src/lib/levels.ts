// XP needed to go from level n to n+1
export function xpForLevel(n: number): number {
  return Math.floor(95 * Math.pow(n, 1.70))
}

// Current level given total accumulated XP
export function getLevelFromXP(totalXP: number): number {
  let level = 1
  let spent = 0
  while (true) {
    const needed = xpForLevel(level)
    if (spent + needed > totalXP) break
    spent += needed
    level++
  }
  return level
}

// Full progress info for display
export function getXPProgress(totalXP: number): {
  level: number
  xpInLevel: number
  xpNeeded: number
  pct: number
} {
  let level = 1
  let spent = 0
  while (true) {
    const needed = xpForLevel(level)
    if (spent + needed > totalXP) {
      return {
        level,
        xpInLevel: totalXP - spent,
        xpNeeded: needed,
        pct: Math.min(100, Math.round(((totalXP - spent) / needed) * 100)),
      }
    }
    spent += needed
    level++
  }
}

// ── Legacy mastery-based helpers (used by My Words screen only) ──────────────
import type { LevelName } from '../types'
import { LEVEL_THRESHOLDS } from '../types'

export function getLevelFromMastered(mastered: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (mastered >= LEVEL_THRESHOLDS[i].mastered) level = i + 1
  }
  return level
}

export function getLevelName(level: number): LevelName {
  return LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)].name
}

export function getLevelProgressFromMastered(mastered: number): {
  level: number
  name: LevelName
  masteredCount: number
  nextThreshold: number | null
  pct: number
} {
  const level = getLevelFromMastered(mastered)
  const current = LEVEL_THRESHOLDS[level - 1]
  const next = LEVEL_THRESHOLDS[level] ?? null
  const rangeSize = next ? next.mastered - current.mastered : 1
  const earnedInLevel = mastered - current.mastered
  const pct = next ? Math.min(100, Math.round((earnedInLevel / rangeSize) * 100)) : 100
  return { level, name: current.name, masteredCount: mastered, nextThreshold: next?.mastered ?? null, pct }
}
