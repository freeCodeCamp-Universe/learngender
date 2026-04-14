import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardResult, Gender, Language, RoundSummary, Word } from '../types'
import { drawRound } from '../lib/wordLoader'
import { createCard, getMastery, rateCard } from '../lib/srs'
import { addScore, getMasteredCount, getSRSCard, markWordSeen, setSRSCard } from '../lib/storage'
import { scoreCard, scoreRound } from '../lib/scoring'
import { getLevelFromMastered } from '../lib/levels'
import { getWords } from '../lib/wordLoader'

export const TOTAL_LIVES = 5
const SUMMIT_STEP   = 8   // hiker must reach this step to win

export type RoundPhase = 'loading' | 'playing' | 'summit' | 'done'

export interface RoundState {
  phase: RoundPhase
  deck: Word[]
  currentIndex: number
  score: number
  lives: number
  hikerStep: number
  results: CardResult[]
  isShaking: boolean
  summary: RoundSummary | null
}

export function useRound(language: Language, onDone: (summary: RoundSummary) => void, initialDeck?: Word[]) {
  const [state, setState] = useState<RoundState>({
    phase: 'loading',
    deck: [],
    currentIndex: 0,
    score: 0,
    lives: TOTAL_LIVES,
    hikerStep: 0,
    results: [],
    isShaking: false,
    summary: null,
  })

  const cardScoresRef     = useRef<ReturnType<typeof scoreCard>[]>([])
  const resultsRef        = useRef<CardResult[]>([])
  const masteredBeforeRef = useRef(0)
  const levelBeforeRef    = useRef(1)
  const wordListRef       = useRef<string[]>([])

  useEffect(() => {
    async function init() {
      const allWords = await getWords(language)
      wordListRef.current = allWords.map(w => w.word)
      const masteredBefore = getMasteredCount(language, wordListRef.current)
      masteredBeforeRef.current = masteredBefore
      levelBeforeRef.current = getLevelFromMastered(masteredBefore)
      cardScoresRef.current = []
      resultsRef.current = []
      const deck = initialDeck ?? await drawRound(language)
      setState({
        phase: 'playing',
        deck,
        currentIndex: 0,
        score: 0,
        lives: TOTAL_LIVES,
        hikerStep: 0,
        results: [],
        isShaking: false,
        summary: null,
      })
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, initialDeck])

  const buildSummary = (score: number, points: number, passed: boolean): RoundSummary => {
    const masteredAfter = getMasteredCount(language, wordListRef.current)
    return {
      language,
      cards: resultsRef.current,
      score,
      pointsEarned: points,
      masteredBefore: masteredBeforeRef.current,
      masteredAfter,
      levelBefore: levelBeforeRef.current,
      levelAfter: getLevelFromMastered(masteredAfter),
      passed,
    }
  }

  const answer = useCallback(
    (gender: Gender, translationUsed: boolean): boolean => {
      let correct = false

      setState((prev) => {
        if (prev.phase !== 'playing') return prev

        const currentWord = prev.deck[prev.currentIndex]
        correct = currentWord.gender === gender

        // SRS update
        const existingCard = getSRSCard(language, currentWord.word) ?? createCard()
        const masteryBefore = getMastery(existingCard)
        const updatedCard  = rateCard(existingCard, correct)
        setSRSCard(language, currentWord.word, updatedCard)
        markWordSeen(language, currentWord.word)

        const masteryAfter = getMastery(updatedCard)
        const cardScore  = scoreCard(correct, translationUsed)
        cardScoresRef.current.push(cardScore)
        resultsRef.current.push({ word: currentWord, correct, translationUsed, masteryBefore, masteryAfter })

        if (!correct) {
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(200)
          }

          // Requeue word 3 positions ahead
          const newDeck = [...prev.deck]
          const insertAt = Math.min(prev.currentIndex + 3, newDeck.length)
          newDeck.splice(insertAt, 0, currentWord)

          const newLives    = prev.lives - 1
          const newHikerStep = Math.max(0, prev.hikerStep - 1)

          if (newLives <= 0) {
            const { passed } = scoreRound(prev.score, cardScoresRef.current)
            const summary = buildSummary(prev.score, 0, passed)
            addScore(language, 0, summary.masteredAfter, summary.levelAfter)
            setTimeout(() => onDone(summary), 0)
            return { ...prev, lives: 0, hikerStep: newHikerStep, deck: newDeck, isShaking: true, phase: 'done', summary }
          }

          setTimeout(() => setState((s) => ({ ...s, isShaking: false })), 500)
          return { ...prev, lives: newLives, hikerStep: newHikerStep, deck: newDeck, isShaking: true }
        }

        // Correct answer
        const newScore     = prev.score + 1
        const newHikerStep = prev.hikerStep + 1
        const newIndex     = prev.currentIndex + 1
        const deckSnapshot = prev.deck

        // Reached the summit — show summit overlay (don't call onDone yet)
        if (newHikerStep >= SUMMIT_STEP) {
          const { points, passed } = scoreRound(newScore, cardScoresRef.current)
          const summary = buildSummary(newScore, points, passed)
          addScore(language, points, summary.masteredAfter, summary.levelAfter)
          setTimeout(() => setState((s) => ({
            ...s, currentIndex: newIndex, deck: deckSnapshot,
            phase: 'summit', summary, hikerStep: SUMMIT_STEP,
          })), 290)
          return { ...prev, score: newScore, hikerStep: newHikerStep }
        }

        // Normal correct — delay index advance for fly animation
        setTimeout(() => {
          setState((s) => {
            if (s.phase === 'done' || s.phase === 'summit') return s
            return { ...s, currentIndex: newIndex, deck: deckSnapshot }
          })
        }, 290)

        return { ...prev, score: newScore, hikerStep: newHikerStep }
      })

      return correct
    },
    [language, onDone]
  )

  const currentWord = state.deck[state.currentIndex] ?? null
  return { state, currentWord, answer }
}
