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

export function isDue(card: Card | null): boolean {
  if (!card) return false
  return new Date(card.due) <= new Date()
}
