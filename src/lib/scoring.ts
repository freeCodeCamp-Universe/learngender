/**
 * Points calculation for summit rounds:
 *   Correct answer:                    +10
 *   Correct without translation:       +5 bonus
 *   First-try error in a passed round: -5 penalty
 *   Round pass (≥7 first-try correct): +20 bonus
 *   Perfect summit round:              +50 bonus
 *
 * Perfect no-translation summit: (10+5)×8 + 20 + 50 = 190
 */

export const SCORE_CORRECT_POINTS = 10
export const SCORE_NO_TRANSLATION_BONUS = 5
export const SCORE_FIRST_ERROR_PENALTY = 5
export const SCORE_PASS_BONUS = 20
export const SCORE_PERFECT_BONUS = 50

export interface CardScore {
  base: number
  translationBonus: number
  total: number
}

export interface RoundScoreCardLike {
  correct: boolean
  translationUsed: boolean
}

export interface RoundScoreBreakdown {
  correctCount: number
  correctPoints: number
  noTranslationCount: number
  noTranslationBonus: number
  errorCount: number
  errorPenalty: number
  passBonus: number
  perfectBonus: number
  points: number
  passed: boolean
  perfect: boolean
}

interface RoundScoreOptions {
  passTarget?: number
  perfectTarget?: number
}

export function scoreCard(correct: boolean, translationUsed: boolean): CardScore {
  if (!correct) return { base: 0, translationBonus: 0, total: 0 }
  const base = SCORE_CORRECT_POINTS
  const translationBonus = translationUsed ? 0 : SCORE_NO_TRANSLATION_BONUS
  return { base, translationBonus, total: base + translationBonus }
}

export function getRoundPointCap(
  correctTarget: number,
  options: { includePerfectBonus?: boolean } = {}
): number {
  const includePerfectBonus = options.includePerfectBonus ?? correctTarget >= 10
  return (
    correctTarget * (SCORE_CORRECT_POINTS + SCORE_NO_TRANSLATION_BONUS) +
    SCORE_PASS_BONUS +
    (includePerfectBonus ? SCORE_PERFECT_BONUS : 0)
  )
}

export function getRecoverableRoundPointCap(
  correctTarget: number,
  recoverableMistakes: number,
  options: { includePerfectBonus?: boolean } = {}
): number {
  return getRoundPointCap(correctTarget + recoverableMistakes, options)
}

export function getRoundScoreBreakdown(
  cards: RoundScoreCardLike[],
  options: RoundScoreOptions = {}
): RoundScoreBreakdown {
  const passTarget = options.passTarget ?? 7
  const perfectTarget = options.perfectTarget ?? 10
  const correctCards = cards.filter((card) => card.correct)
  const correctCount = correctCards.length
  const noTranslationCount = correctCards.filter((card) => !card.translationUsed).length
  const errorCount = cards.length - correctCount
  const passed = correctCount >= passTarget
  const perfect = correctCount === perfectTarget && cards.length === perfectTarget && cards.every((card) => card.correct)
  const correctPoints = correctCount * SCORE_CORRECT_POINTS
  const noTranslationBonus = noTranslationCount * SCORE_NO_TRANSLATION_BONUS
  const errorPenalty = passed ? errorCount * SCORE_FIRST_ERROR_PENALTY : 0
  const passBonus = passed ? SCORE_PASS_BONUS : 0
  const perfectBonus = perfect ? SCORE_PERFECT_BONUS : 0

  return {
    correctCount,
    correctPoints,
    noTranslationCount,
    noTranslationBonus,
    errorCount,
    errorPenalty,
    passBonus,
    perfectBonus,
    points: correctPoints + noTranslationBonus + passBonus + perfectBonus - errorPenalty,
    passed,
    perfect,
  }
}

export function scoreRound(
  correctCount: number,
  cardScores: CardScore[],
  options: RoundScoreOptions = {}
): { points: number; passed: boolean; perfect: boolean } {
  const passTarget = options.passTarget ?? 7
  const perfectTarget = options.perfectTarget ?? 8
  const passed = correctCount >= passTarget
  const perfect = correctCount === perfectTarget && cardScores.length === perfectTarget && cardScores.every((s) => s.base > 0)
  const cardTotal = cardScores.reduce((acc, s) => acc + s.total, 0)
  const errorPenalty = passed ? cardScores.filter((s) => s.base === 0).length * SCORE_FIRST_ERROR_PENALTY : 0
  const passBonus = passed ? SCORE_PASS_BONUS : 0
  const perfectBonus = perfect ? SCORE_PERFECT_BONUS : 0
  return {
    points: cardTotal + passBonus + perfectBonus - errorPenalty,
    passed,
    perfect,
  }
}
