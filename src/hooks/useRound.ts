import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardResult, Gender, Language, RoundSummary, Word } from '../types'
import { drawRound } from '../lib/wordLoader'
import { createCard, getMastery, rateCard } from '../lib/srs'
import { addScore, getScore, getSRSCard, markWordSeen, setSRSCard } from '../lib/storage'
import { scoreCard, scoreRound } from '../lib/scoring'
import { getLevelFromScore } from '../lib/levels'

const TOTAL_LIVES = 3
const TOTAL_ROWS = 8

export type RoundPhase = 'loading' | 'playing' | 'done'

export interface RoundState {
  phase: RoundPhase
  deck: Word[]
  currentIndex: number
  score: number
  lives: number
  rows: number
  results: CardResult[]
  isShaking: boolean
  summary: RoundSummary | null
}

export function useRound(language: Language, onDone: (summary: RoundSummary) => void) {
  const [state, setState] = useState<RoundState>({
    phase: 'loading',
    deck: [],
    currentIndex: 0,
    score: 0,
    lives: TOTAL_LIVES,
    rows: TOTAL_ROWS,
    results: [],
    isShaking: false,
    summary: null,
  })

  const cardScoresRef  = useRef<ReturnType<typeof scoreCard>[]>([])
  const resultsRef     = useRef<CardResult[]>([])
  const scoreBeforeRef = useRef(0)
  const levelBeforeRef = useRef(1)

  useEffect(() => {
    async function init() {
      const scoreBefore = getScore(language)
      scoreBeforeRef.current = scoreBefore.score
      levelBeforeRef.current = getLevelFromScore(scoreBefore.score)
      const deck = await drawRound(language)
      setState((s) => ({ ...s, phase: 'playing', deck }))
    }
    init()
  }, [language])

  // Returns whether the answer was correct — WordCard uses this to decide fly vs bounce
  const answer = useCallback(
    (gender: Gender, translationUsed: boolean): boolean => {
      let correct = false

      setState((prev) => {
        if (prev.phase !== 'playing') return prev

        const currentWord = prev.deck[prev.currentIndex]
        correct = currentWord.gender === gender

        // SRS update
        const existingCard = getSRSCard(language, currentWord.word) ?? createCard()
        const updatedCard = rateCard(existingCard, correct)
        setSRSCard(language, currentWord.word, updatedCard)
        markWordSeen(language, currentWord.word)

        const masteryPct = getMastery(updatedCard)
        const cardScore  = scoreCard(correct, translationUsed)

        if (!correct) {
          // Haptic
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(200)
          }

          // Keep the word at current position; also queue a copy to reappear 2 cards later
          const newDeck = [...prev.deck]
          const insertAt = Math.min(prev.currentIndex + 3, newDeck.length)
          newDeck.splice(insertAt, 0, currentWord)

          const newLives = prev.lives - 1
          const newRows  = Math.min(TOTAL_ROWS, prev.rows + 1)

          // If out of lives — end round
          if (newLives <= 0) {
            cardScoresRef.current.push(cardScore)
            resultsRef.current.push({ word: currentWord, correct, translationUsed, masteryPct })
            const { points, passed } = scoreRound(prev.score, cardScoresRef.current)
            const scoreAfterData = addScore(language, points)
            const levelAfter = getLevelFromScore(scoreAfterData.score)
            const summary: RoundSummary = {
              language,
              cards: resultsRef.current,
              score: prev.score,
              pointsEarned: points,
              scoreBefore: scoreBeforeRef.current,
              scoreAfter: scoreAfterData.score,
              levelBefore: levelBeforeRef.current,
              levelAfter,
              passed,
            }
            setTimeout(() => onDone(summary), 0)
            return { ...prev, lives: 0, rows: newRows, deck: newDeck, isShaking: true, phase: 'done', summary }
          }

          // Otherwise: bounce — word stays current (index unchanged), deck requeued
          setTimeout(() => setState((s) => ({ ...s, isShaking: false })), 500)
          return { ...prev, lives: newLives, rows: newRows, deck: newDeck, isShaking: true }
        }

        // Correct answer — update score/rows immediately, but delay the word advance
        // so the fly-off animation has time to play (260ms) before the new word appears.
        cardScoresRef.current.push(cardScore)
        resultsRef.current.push({ word: currentWord, correct: true, translationUsed, masteryPct })

        const newScore = prev.score + 1
        const newRows  = Math.max(0, prev.rows - 1)
        const newIndex = prev.currentIndex + 1
        const roundEnded = newIndex >= prev.deck.length
        const deckSnapshot = prev.deck

        setTimeout(() => {
          setState((s) => {
            if (s.phase === 'done') return s
            if (roundEnded) {
              const { points, passed } = scoreRound(newScore, cardScoresRef.current)
              const scoreAfterData = addScore(language, points)
              const levelAfter = getLevelFromScore(scoreAfterData.score)
              const summary: RoundSummary = {
                language,
                cards: resultsRef.current,
                score: newScore,
                pointsEarned: points,
                scoreBefore: scoreBeforeRef.current,
                scoreAfter: scoreAfterData.score,
                levelBefore: levelBeforeRef.current,
                levelAfter,
                passed,
              }
              setTimeout(() => onDone(summary), 0)
              return { ...s, currentIndex: newIndex, deck: deckSnapshot, phase: 'done', summary }
            }
            return { ...s, currentIndex: newIndex, deck: deckSnapshot }
          })
        }, 290) // fly animation is 260ms; 290ms gives a clean gap

        // Return immediately with score/rows updated but index unchanged
        return { ...prev, score: newScore, rows: newRows, results: resultsRef.current }
      })

      return correct
    },
    [language, onDone]
  )

  const currentWord = state.deck[state.currentIndex] ?? null
  return { state, currentWord, answer }
}
