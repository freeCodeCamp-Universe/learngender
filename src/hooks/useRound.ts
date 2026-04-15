import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardResult, Gender, Language, RoundSummary, Word } from '../types'
import { drawRound } from '../lib/wordLoader'
import { createCard, getMastery, rateCard } from '../lib/srs'
import { addScore, getMasteredCount, getScore, getSRSCard, markWordSeen, setSRSCard } from '../lib/storage'
import { getRoundScoreBreakdown } from '../lib/scoring'
import { getLevelFromXP } from '../lib/levels'
import { getWords } from '../lib/wordLoader'

export const TOTAL_LIVES = 5
export const SUMMIT_STEP = 8   // hiker must reach this step to win

export type RoundPhase = 'loading' | 'playing' | 'summit' | 'done' | 'init_failed'

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

function getScoredResults(results: CardResult[]): CardResult[] {
  return results.reduce<CardResult[]>((acc, result) => {
    if (!acc.find((entry) => entry.word.word === result.word.word)) acc.push(result)
    return acc
  }, [])
}

export function useRound(language: Language, initialDeck?: Word[]) {
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

  const resultsRef        = useRef<CardResult[]>([])
  const masteredBeforeRef = useRef(0)
  const levelBeforeRef    = useRef(1)
  const wordListRef       = useRef<string[]>([])

  useEffect(() => {
    async function attempt(): Promise<boolean> {
      try {
        const allWords = await getWords(language)
        wordListRef.current = allWords.map(w => w.word)
        const masteredBefore = getMasteredCount(language, wordListRef.current)
        masteredBeforeRef.current = masteredBefore
        const xpBefore = getScore(language).score
        levelBeforeRef.current = getLevelFromXP(xpBefore)
        resultsRef.current = []
        const deck = initialDeck ?? await drawRound(language)
        if (deck.length < SUMMIT_STEP) return false
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
        return true
      } catch {
        return false
      }
    }

    async function init() {
      const ok = await attempt()
      if (!ok) {
        const retry = await attempt()
        if (!retry) setState((s) => ({ ...s, phase: 'init_failed' }))
      }
    }

    init()
  }, [language, initialDeck])

  const buildSummary = useCallback((options?: { pointsOverride?: number }): RoundSummary => {
    const scoredResults = getScoredResults(resultsRef.current)
    const breakdown = getRoundScoreBreakdown(scoredResults, { perfectTarget: SUMMIT_STEP })
    const masteredAfter = getMasteredCount(language, wordListRef.current)
    const pointsEarned = options?.pointsOverride ?? breakdown.points
    const xpAfter = getScore(language).score + pointsEarned
    return {
      language,
      cards: resultsRef.current,
      score: breakdown.correctCount,
      pointsEarned,
      masteredBefore: masteredBeforeRef.current,
      masteredAfter,
      levelBefore: levelBeforeRef.current,
      levelAfter: getLevelFromXP(xpAfter),
      passed: breakdown.passed,
    }
  }, [language])

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

          // BOUNCE_DURATION (580ms) + dismiss fly (290ms) = 870ms before next card
          const DISMISS_DELAY = 870

          if (newLives <= 0) {
            const summary = buildSummary({ pointsOverride: 0 })
            addScore(language, 0, summary.masteredAfter, summary.levelAfter)
            setTimeout(() => {
              setState((s) => ({
                ...s,
                currentIndex: prev.currentIndex + 1,
                lives: 0,
                hikerStep: newHikerStep,
                deck: newDeck,
                isShaking: false,
                phase: 'done',
                summary,
              }))
            }, DISMISS_DELAY)
            return { ...prev, lives: 0, hikerStep: newHikerStep, deck: newDeck, isShaking: true, phase: 'done', summary }
          }

          // Advance to next card after dismiss animation completes
          const nextIndex = prev.currentIndex + 1
          setTimeout(() => {
            setState((s) => {
              if (s.phase === 'done' || s.phase === 'summit') return s
              return { ...s, currentIndex: nextIndex, isShaking: false }
            })
          }, DISMISS_DELAY)

          return { ...prev, lives: newLives, hikerStep: newHikerStep, deck: newDeck, isShaking: true }
        }

        // Correct answer
        const newScore     = prev.score + 1
        const newHikerStep = prev.hikerStep + 1
        const newIndex     = prev.currentIndex + 1

        // Reached the summit — show summit overlay (don't call onDone yet)
        if (newHikerStep >= SUMMIT_STEP) {
          const summary = buildSummary()
          addScore(language, summary.pointsEarned, summary.masteredAfter, summary.levelAfter)
          setTimeout(() => setState((s) => ({
            ...s, currentIndex: newIndex,
            phase: 'summit', summary, hikerStep: SUMMIT_STEP,
          })), 290)
          return { ...prev, score: newScore, hikerStep: newHikerStep }
        }

        // Normal correct — delay index advance for fly animation
        setTimeout(() => {
          setState((s) => {
            if (s.phase === 'done' || s.phase === 'summit') return s
            return { ...s, currentIndex: newIndex }
          })
        }, 290)

        return { ...prev, score: newScore, hikerStep: newHikerStep }
      })

      return correct
    },
    [buildSummary, language]
  )

  const currentWord = state.deck[state.currentIndex] ?? null
  return { state, currentWord, answer }
}
