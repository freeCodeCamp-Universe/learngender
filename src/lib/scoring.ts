/**
 * Points calculation for summit rounds:
 *   Correct answer:                    +10
 *   Correct without translation:       +5 bonus
 *   Perfect summit round:              +50 bonus
 *
 * Perfect no-translation summit: (10+5)×8 + 50 = 170
 */

export const SCORE_CORRECT_POINTS = 10
export const SCORE_NO_TRANSLATION_BONUS = 5
export const SCORE_PERFECT_BONUS = 50

export interface RoundScoreCardLike {
  correct: boolean
  translationUsed: boolean
}

export interface RoundScoreBreakdown {
  correctCount: number
  correctPoints: number
  noTranslationCount: number
  noTranslationBonus: number
  perfectBonus: number
  points: number
  perfect: boolean
}

interface RoundScoreOptions {
  perfectTarget?: number
}

export function getRoundPointCap(
  correctTarget: number,
  options: { includePerfectBonus?: boolean } = {}
): number {
  const includePerfectBonus = options.includePerfectBonus ?? correctTarget >= 10
  return (
    correctTarget * (SCORE_CORRECT_POINTS + SCORE_NO_TRANSLATION_BONUS) +
    (includePerfectBonus ? SCORE_PERFECT_BONUS : 0)
  )
}

export function getRoundScoreBreakdown(
  cards: RoundScoreCardLike[],
  options: RoundScoreOptions = {}
): RoundScoreBreakdown {
  const perfectTarget = options.perfectTarget ?? 10
  const correctCards = cards.filter((card) => card.correct)
  const correctCount = correctCards.length
  const noTranslationCount = correctCards.filter((card) => !card.translationUsed).length
  const perfect = correctCount === perfectTarget && cards.length === perfectTarget && cards.every((card) => card.correct)
  const correctPoints = correctCount * SCORE_CORRECT_POINTS
  const noTranslationBonus = noTranslationCount * SCORE_NO_TRANSLATION_BONUS
  const perfectBonus = perfect ? SCORE_PERFECT_BONUS : 0

  return {
    correctCount,
    correctPoints,
    noTranslationCount,
    noTranslationBonus,
    perfectBonus,
    points: correctPoints + noTranslationBonus + perfectBonus,
    perfect,
  }
}

