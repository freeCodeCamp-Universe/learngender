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

export function getMastery(card: Card | null): number {
  if (!card || card.reps === 0) return 0
  const stability = card.stability
  if (!stability || stability <= 0) return 0
  const lastReview = card.last_review ? new Date(card.last_review) : null
  if (!lastReview) return 0
  const t = (Date.now() - lastReview.getTime()) / (1000 * 60 * 60 * 24) // days
  const retrievability = Math.exp(-t / stability)
  return Math.round(Math.min(100, Math.max(0, retrievability * 100)))
}

export function isDue(card: Card | null): boolean {
  if (!card) return false
  return new Date(card.due) <= new Date()
}
