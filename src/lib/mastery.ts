import type { Card } from './srs'

export const MASTERED_THRESHOLD = 80
export const ACTIVE_ROTATION_MASTERY_THRESHOLD = 90

const LEGACY_MASTERY_STABILITY_CAP = 30 // days
const MASTERY_MAX = 100

const CORRECT_GAIN = 6
const NO_TRANSLATION_BONUS = 3
const DUE_REVIEW_BONUS = 2

const INCORRECT_PENALTY = 8
const INCORRECT_WITH_TRANSLATION_PENALTY = 5

function clampMastery(value: number): number {
  return Math.max(0, Math.min(MASTERY_MAX, Math.round(value)))
}

// Transitional fallback for existing users who already have FSRS history but
// no learner-facing mastery score stored yet.
export function getLegacyMastery(card: Card | null): number {
  if (!card || card.reps === 0) return 0
  const stability = card.stability
  if (!stability || stability <= 0) return 0
  return clampMastery((stability / LEGACY_MASTERY_STABILITY_CAP) * 100)
}

interface MasteryReviewInput {
  correct: boolean
  translationUsed: boolean
  wasDueReview: boolean
}

export function getUpdatedMastery(
  currentMastery: number,
  { correct, translationUsed, wasDueReview }: MasteryReviewInput
): number {
  if (correct) {
    let gain = CORRECT_GAIN
    if (!translationUsed) gain += NO_TRANSLATION_BONUS
    if (wasDueReview) gain += DUE_REVIEW_BONUS
    return clampMastery(currentMastery + gain)
  }

  const penalty = translationUsed ? INCORRECT_WITH_TRANSLATION_PENALTY : INCORRECT_PENALTY
  return clampMastery(currentMastery - penalty)
}
