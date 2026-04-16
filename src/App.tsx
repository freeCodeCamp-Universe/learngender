import { useState } from 'react'
import type { Language, RoundSummary } from './types'
import { HomeScreen } from './screens/HomeScreen'
import { GameScreen } from './screens/GameScreen'
import { MyWordsScreen } from './screens/MyWordsScreen'
import { TheoryScreen } from './screens/TheoryScreen'
import { updateStreak } from './lib/storage'
import { playCorrect, playIncorrect, playLevelUp } from './lib/sounds'
import './App.css'

type Screen = 'home' | 'game' | 'words' | 'theory'

interface AppState {
  screen: Screen
  language: Language | null
  roundKey: number
}

export default function App() {
  const [state, setState] = useState<AppState>({
    screen: 'home',
    language: null,
    roundKey: 0,
  })

  function startRound(language: Language) {
    setState((s) => ({ screen: 'game', language, roundKey: s.roundKey + 1 }))
  }

  function onRoundEnd(summary: RoundSummary) {
    updateStreak()

    // Play sound based on result
    if (summary.levelAfter > summary.levelBefore) {
      playLevelUp()
    } else if (summary.passed) {
      playCorrect()
    } else {
      playIncorrect()
    }
  }

  function goHome() {
    setState((s) => ({ ...s, screen: 'home', language: null }))
  }

  function goMyWords() {
    setState((s) => ({ ...s, screen: 'words' }))
  }

  function goTheory() {
    setState((s) => ({ ...s, screen: 'theory' }))
  }

  return (
    <div className="app">
      {state.screen === 'home' && (
        <HomeScreen onStartRound={startRound} onMyWords={goMyWords} onTheory={goTheory} />
      )}

      {state.screen === 'game' && state.language && (
        <GameScreen
          key={state.roundKey}
          language={state.language}
          onRoundEnd={onRoundEnd}
          onPlayAgain={() => startRound(state.language!)}
          onHome={goHome}
        />
      )}

      {state.screen === 'words' && (
        <MyWordsScreen onHome={goHome} onTheory={goTheory} />
      )}

      {state.screen === 'theory' && (
        <TheoryScreen onHome={goHome} onMyWords={goMyWords} />
      )}
    </div>
  )
}
