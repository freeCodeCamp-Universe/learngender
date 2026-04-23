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

export function getMasteryTierProgress(mastered: number, learning: number): {
  level: number
  name: LevelName
  tierStart: number
  tierEnd: number | null
  tierSpan: number
  masteredInTier: number
  learningVisible: number
  remaining: number
  masteredPct: number
  learningPct: number
} {
  const level = getLevelFromMastered(mastered)
  const current = LEVEL_THRESHOLDS[level - 1]
  const next = LEVEL_THRESHOLDS[level] ?? null

  if (!next) {
    return {
      level,
      name: current.name,
      tierStart: current.mastered,
      tierEnd: null,
      tierSpan: 1,
      masteredInTier: 1,
      learningVisible: 0,
      remaining: 0,
      masteredPct: 100,
      learningPct: 0,
    }
  }

  const tierStart = current.mastered
  const tierEnd = next.mastered
  const tierSpan = Math.max(1, tierEnd - tierStart)
  const masteredInTier = Math.min(tierSpan, Math.max(0, mastered - tierStart))
  const learningVisible = Math.min(Math.max(0, learning), Math.max(0, tierSpan - masteredInTier))
  const remaining = Math.max(0, tierSpan - masteredInTier - learningVisible)

  return {
    level,
    name: current.name,
    tierStart,
    tierEnd,
    tierSpan,
    masteredInTier,
    learningVisible,
    remaining,
    masteredPct: Math.round((masteredInTier / tierSpan) * 100),
    learningPct: Math.round((learningVisible / tierSpan) * 100),
  }
}
