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

  return {
    level,
    name: current.name,
    masteredCount: mastered,
    nextThreshold: next?.mastered ?? null,
    pct,
  }
}
