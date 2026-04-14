import { useState } from 'react'
import type { Language, RoundSummary } from './types'
import { HomeScreen } from './screens/HomeScreen'
import { GameScreen } from './screens/GameScreen'
import { ResultScreen } from './screens/ResultScreen'
import { MyWordsScreen } from './screens/MyWordsScreen'
import { updateStreak } from './lib/storage'
import { playCorrect, playIncorrect, playLevelUp } from './lib/sounds'
import './App.css'

type Screen = 'home' | 'game' | 'result' | 'words'

interface AppState {
  screen: Screen
  language: Language | null
  lastSummary: RoundSummary | null
  roundKey: number
}

export default function App() {
  const [state, setState] = useState<AppState>({
    screen: 'home',
    language: null,
    lastSummary: null,
    roundKey: 0,
  })

  function startRound(language: Language) {
    setState((s) => ({ screen: 'game', language, lastSummary: null, roundKey: s.roundKey + 1 }))
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

    setState((s) => ({ ...s, screen: 'result', lastSummary: summary }))
  }

  function goHome() {
    setState((s) => ({ ...s, screen: 'home', language: null, lastSummary: null }))
  }

  function goMyWords() {
    setState((s) => ({ ...s, screen: 'words' }))
  }

  return (
    <div className="app">
      {state.screen === 'home' && (
        <HomeScreen onStartRound={startRound} onMyWords={goMyWords} />
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

      {state.screen === 'result' && state.lastSummary && (
        <ResultScreen
          summary={state.lastSummary}
          onPlayAgain={() => startRound(state.lastSummary!.language)}
          onHome={goHome}
        />
      )}

      {state.screen === 'words' && (
        <MyWordsScreen onHome={goHome} />
      )}
    </div>
  )
}
