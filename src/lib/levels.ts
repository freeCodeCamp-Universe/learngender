import type { LevelName } from '../types'
import { LEVEL_THRESHOLDS } from '../types'

export function getLevelFromScore(score: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (score >= LEVEL_THRESHOLDS[i].xp) level = i + 1
  }
  return level
}

export function getLevelName(level: number): LevelName {
  return LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)].name
}

export function getLevelProgress(score: number): {
  level: number
  name: LevelName
  currentXP: number
  nextXP: number | null
  pct: number
} {
  const level = getLevelFromScore(score)
  const current = LEVEL_THRESHOLDS[level - 1]
  const next = LEVEL_THRESHOLDS[level] ?? null

  const currentXP = score - current.xp
  const rangeXP = next ? next.xp - current.xp : 1
  const pct = next ? Math.min(100, Math.round((currentXP / rangeXP) * 100)) : 100

  return {
    level,
    name: current.name,
    currentXP: score,
    nextXP: next?.xp ?? null,
    pct,
  }
}
