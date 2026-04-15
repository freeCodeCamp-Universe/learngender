import { getXPProgress } from '../lib/levels'
import { getScore } from '../lib/storage'
import type { Language } from '../types'

interface LevelBadgeProps {
  language: Language
}

export function LevelBadge({ language }: LevelBadgeProps) {
  const totalXP = getScore(language).score
  const { level, pct } = getXPProgress(totalXP)

  return (
    <div className="level-badge">
      <div className="level-badge__circle">{level}</div>
      <div className="level-badge__bar-track">
        <div className="level-badge__bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
