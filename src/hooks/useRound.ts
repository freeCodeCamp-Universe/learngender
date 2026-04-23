import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardResult, Gender, Language, RoundSummary, Word } from '../types'
import { drawRound } from '../lib/wordLoader'
import { createCard, isDue, rateCard } from '../lib/srs'
import { addScore, getMasteredCount, getScore, getSettings, getSRSCard, getWordMastery, markWordSeen, setSRSCard, setWordMastery } from '../lib/storage'
import { getRoundScoreBreakdown } from '../lib/scoring'
import { getLevelFromXP } from '../lib/levels'
import { getWords } from '../lib/wordLoader'
import { getUpdatedMastery } from '../lib/mastery'

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
  drawerReady: boolean
}

function getScoredResults(results: CardResult[]): CardResult[] {
  return results.reduce<CardResult[]>((acc, result) => {
    if (!acc.find((entry) => entry.word.id === result.word.id)) acc.push(result)
    return acc
  }, [])
}

function pickFallbackWord(deck: Word[], allWords: Word[], currentWord: Word): Word {
  const futureWords = new Set(deck.map((entry) => entry.id))
  const unseenCandidate = allWords.find(
    (entry) => entry.id !== currentWord.id && !futureWords.has(entry.id)
  )
  if (unseenCandidate) return unseenCandidate

  const alternateCandidate = deck.find((entry) => entry.id !== currentWord.id)
  if (alternateCandidate) return alternateCandidate

  return currentWord
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
    drawerReady: false,
  })

  const resultsRef        = useRef<CardResult[]>([])
  const masteredBeforeRef = useRef(0)
  const levelBeforeRef    = useRef(1)
  const wordIdListRef     = useRef<string[]>([])
  const allWordsRef       = useRef<Word[]>([])
  const stateRef          = useRef<RoundState | null>(null)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    async function attempt(): Promise<boolean> {
      try {
        const allWords = await getWords(language)
        allWordsRef.current = allWords
        wordIdListRef.current = allWords.map(w => w.id)
        const masteredBefore = getMasteredCount(language, wordIdListRef.current)
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
          drawerReady: false,
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

  const buildSummary = useCallback((options?: { pointsOverride?: number; passedOverride?: boolean }): RoundSummary => {
    const scoredResults = getScoredResults(resultsRef.current)
    const breakdown = getRoundScoreBreakdown(scoredResults, { perfectTarget: SUMMIT_STEP })
    const masteredAfter = getMasteredCount(language, wordIdListRef.current)
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
      passed: options?.passedOverride ?? false,
    }
  }, [language])

  const answer = useCallback(
    (gender: Gender, translationUsed: boolean): boolean => {
      const snapshot = stateRef.current
      if (!snapshot || snapshot.phase !== 'playing') return false

      const snapshotWord = snapshot.deck[snapshot.currentIndex]
      if (!snapshotWord) return false

      const correct = snapshotWord.gender === gender

      setState((prev) => {
        if (prev.phase !== 'playing') return prev

        const currentWord = prev.deck[prev.currentIndex]
        const isCorrect = currentWord.gender === gender

        // SRS update
        const existingCard = getSRSCard(language, currentWord.id) ?? createCard()
        const masteryBefore = getWordMastery(language, currentWord.id, existingCard)
        const wasDueReview = existingCard.reps > 0 && isDue(existingCard)
        const updatedCard  = rateCard(existingCard, isCorrect)
        setSRSCard(language, currentWord.id, updatedCard)
        markWordSeen(language, currentWord.id)

        const masteryAfter = getUpdatedMastery(masteryBefore, {
          correct: isCorrect,
          translationUsed,
          wasDueReview,
        })
        setWordMastery(language, currentWord.id, masteryAfter)
        resultsRef.current.push({ word: currentWord, correct: isCorrect, translationUsed, masteryBefore, masteryAfter })

        if (!isCorrect) {
          if (getSettings().hapticsEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(200)
          }

          // Requeue word 3 positions ahead
          const newDeck = [...prev.deck]
          const insertAt = Math.min(prev.currentIndex + 3, newDeck.length)
          newDeck.splice(insertAt, 0, currentWord)

          const newLives    = prev.lives - 1
          const newHikerStep = Math.max(0, prev.hikerStep - 1)

          // BOUNCE_DURATION (580ms) + dismiss fly (290ms) = 870ms before next card
          const DISMISS_DELAY = 770

          if (newLives <= 0) {
            const summary = buildSummary({ pointsOverride: 0, passedOverride: false })
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
                drawerReady: true,
              }))
            }, DISMISS_DELAY)
            return { ...prev, lives: 0, hikerStep: newHikerStep, deck: newDeck, isShaking: true }
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
        const nextDeck = newIndex < prev.deck.length
          ? prev.deck
          : [...prev.deck, pickFallbackWord(prev.deck, allWordsRef.current, currentWord)]

        // Reached the summit — show summit overlay (don't call onDone yet)
        if (newHikerStep >= SUMMIT_STEP) {
          const summary = buildSummary({ passedOverride: true })
          addScore(language, summary.pointsEarned, summary.masteredAfter, summary.levelAfter)
          setTimeout(() => setState((s) => ({
            ...s, currentIndex: newIndex,
            phase: 'summit', summary, hikerStep: SUMMIT_STEP,
          })), 290)
          // Let the celebration pose be visible for a beat before the drawer mounts
          setTimeout(() => setState((s) => {
            if (s.phase !== 'summit') return s
            return { ...s, drawerReady: true }
          }), 290 + 50)
          return { ...prev, score: newScore, hikerStep: newHikerStep }
        }

        // Normal correct — delay index advance for fly animation
        setTimeout(() => {
          setState((s) => {
            if (s.phase === 'done' || s.phase === 'summit') return s
            return { ...s, deck: nextDeck, currentIndex: newIndex }
          })
        }, 290)

        return { ...prev, score: newScore, hikerStep: newHikerStep }
      })

      return correct
    },
    [buildSummary, language]
  )

  useEffect(() => {
    if (state.phase !== 'playing') return
    if (state.currentIndex < state.deck.length) return

    setState((prev) => {
      if (prev.phase !== 'playing' || prev.currentIndex < prev.deck.length) return prev
      const currentWord = prev.deck[prev.deck.length - 1]
      if (!currentWord) return prev
      return {
        ...prev,
        deck: [...prev.deck, pickFallbackWord(prev.deck, allWordsRef.current, currentWord)],
      }
    })
  }, [state.currentIndex, state.deck, state.phase])

  const currentWord = state.deck[state.currentIndex] ?? null
  return { state, currentWord, answer }
}
