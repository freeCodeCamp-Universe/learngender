import { createEmptyCard, fsrs, generatorParameters, Rating, type Card } from 'ts-fsrs'

const params = generatorParameters()
const f = fsrs(params)

export { type Card }

export function createCard(): Card {
  return createEmptyCard()
}

export function rateCard(card: Card, correct: boolean): Card {
  const rating = correct ? Rating.Good : Rating.Again
  const now = new Date()
  const schedulingCards = f.repeat(card, now)
  return schedulingCards[rating].card
}

// Mastery is based on FSRS stability (how long the memory lasts).
// stability ~1 day = just learned, stability ~30 days = well consolidated.
// We cap at 30 days → 100%, giving an honest picture independent of when
// the card was last reviewed.
const MASTERY_STABILITY_CAP = 30 // days

export function getMastery(card: Card | null): number {
  if (!card || card.reps === 0) return 0
  const stability = card.stability
  if (!stability || stability <= 0) return 0
  return Math.round(Math.min(100, (stability / MASTERY_STABILITY_CAP) * 100))
}

export function isDue(card: Card | null): boolean {
  if (!card) return false
  return new Date(card.due) <= new Date()
}
