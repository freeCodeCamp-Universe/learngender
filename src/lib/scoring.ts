/**
 * Points calculation per the PRD:
 *   Correct answer:                    +10
 *   Correct without translation:       +5 bonus
 *   Round pass (≥7/10):                +20 bonus
 *   Perfect round (0 errors):          +50 bonus
 *
 * Perfect no-translation round: (10+5)×10 + 50 = 200
 * Min pass with translation:    7×10 + 20 = 90
 */

export interface CardScore {
  base: number
  translationBonus: number
  total: number
}

export function scoreCard(correct: boolean, translationUsed: boolean): CardScore {
  if (!correct) return { base: 0, translationBonus: 0, total: 0 }
  const base = 10
  const translationBonus = translationUsed ? 0 : 5
  return { base, translationBonus, total: base + translationBonus }
}

export function scoreRound(
  correctCount: number,
  cardScores: CardScore[]
): { points: number; passed: boolean; perfect: boolean } {
  const passed = correctCount >= 7
  const perfect = correctCount === 10 && cardScores.every((s) => s.base > 0)
  const cardTotal = cardScores.reduce((acc, s) => acc + s.total, 0)
  const passBonus = passed ? 20 : 0
  const perfectBonus = perfect ? 50 : 0
  return {
    points: cardTotal + passBonus + perfectBonus,
    passed,
    perfect,
  }
}
