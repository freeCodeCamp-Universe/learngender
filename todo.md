# TODO Plan: LearnNounGender

---

## Phase 1 — Data Extraction

- [x] TASK: Extract top-1000 nouns per language from kaikki.org Wiktionary dumps
  - [x] Download dumps for PT, ES, FR, IT (script: `scripts/extract-words.mjs`)
  - [x] Filter nouns with confirmed masculine/feminine gender, cross-reference frequency lists
  - [x] Output: `src/data/words_pt.json`, `words_es.json`, `words_fr.json`, `words_it.json`
  - [x] 1000 entries per file ✓

- [x] TASK: Generate gender pattern explanations (no API — rule-based, `scripts/add-pattern-notes.mjs`)
  - [x] Writes `patternNote` field to each word entry
  - [x] 90% coverage (3584/4000 words); fallback: "No simple rule — must be memorised"
  - [x] Acceptance: Every entry has a non-empty `patternNote`. No runtime API calls. ✓

---

## Phase 2 — Project Scaffold

- [x] CODE: Initialise project
  - [x] React + TypeScript project with Vite, ESLint, Prettier
  - [x] Dependencies: `ts-fsrs`, `@anthropic-ai/sdk` (devDep), React, Vite
  - [x] Build passes: 60kb gzipped ✓

- [x] CODE: Static word list loader (`src/lib/wordLoader.ts`)
  - [x] `getWords(language)` — full 1000-word list
  - [x] `drawRound(language)` — 10 words, due SRS cards first, then new by frequency rank

- [x] CODE: localStorage persistence layer (`src/lib/storage.ts`)
  - [x] `getSRSCard` / `setSRSCard`, `getScore` / `addScore`, `getStreak` / `updateStreak`
  - [x] `getSettings` / `setSettings`, `getSeenWords` / `markWordSeen`
  - [x] All typed, no `any`, graceful defaults

---

## Phase 3 — SRS Integration

- [x] CODE: ts-fsrs integration (`src/lib/srs.ts`)
  - [x] `createCard()`, `rateCard(card, correct)`, `getMastery(card)`, `isDue(card)`
  - [x] Mastery: `e^(-t/stability) × 100`, clamped 0–100

---

## Phase 4 — Game Screen

- [x] CODE: Mountain background component (`<MountainBackground rows={number} />`)
  - [x] SVG mountain, 8-row block wall overlay, flag at summit
  - [x] Animate row removal (fall) / addition (rise)
  - [x] Purely presentational ✓

- [x] CODE: Word card component (`<WordCard word onSwipe showTranslation />`)
  - [x] Swipe left (feminine), swipe right (masculine), arrow key support
  - [x] 👁️ icon to reveal translation inline
  - [x] Gender article bands on left/right edges of screen

- [x] CODE: Lives component (`<Lives count={number} />`)
  - [x] 3 hearts, coloured when active, grey when lost

- [x] CODE: Error feedback
  - [x] Screen shake animation (CSS) on incorrect answer
  - [x] `navigator.vibrate(200)` on mobile if available
  - [x] Incorrect word re-inserted into deck after 2 cards

- [x] CODE: Round controller (`useRound` hook)
  - [x] Draws 10 cards, tracks score/lives/rows, ends on 10 cards or 0 lives
  - [x] SRS persisted after every answer, markWordSeen called

- [x] CODE: Points calculation (`src/lib/scoring.ts`)
  - [x] Correct: +10. No translation: +5 bonus. Pass: +20. Perfect: +50.

---

## Phase 5 — Result Screen

- [x] CODE: Result screen (`<ResultScreen summary={RoundSummary} />`)
  - [x] Performance badge: Excellent (9–10), Great (7–8), Good (<7)
  - [x] Score + pass/fail label, animated level progress bar, level-up celebration
  - [x] Word list: noun, article, translation, pattern note, mastery circle
  - [x] "Play Again" and "Home" buttons

---

## Phase 6 — Home Screen

- [x] CODE: Home screen (`<HomeScreen />`)
  - [x] App name, tagline, streak counter, 4 language bars (name, flag, score, level, segmented progress)
  - [x] "Start" label for languages with no rounds, ⚙️ gear and ☰ hamburger icons

- [x] CODE: Settings panel (`<SettingsPanel />`)
  - [x] Sound ON/OFF, Show translation ON/OFF (defaults: ON, OFF)
  - [x] Closes on outside tap or Escape

---

## Phase 7 — My Words Screen

- [x] CODE: My Words screen (`<MyWordsScreen />`)
  - [x] Language tabs, summary "X seen · Y mastered", word list ordered by mastery ascending
  - [x] Mastery circles, translation visibility from settings, unseen words hidden

---

## Phase 8 — Sound

- [x] CODE: Sound effects (`src/lib/sounds.ts`)
  - [x] `playCorrect()`, `playIncorrect()`, `playLevelUp()` — via Web Audio API, no files needed
  - [x] Respects mute setting from localStorage

---

## Phase 9 — Quality & Launch

- [ ] TASK: Keyboard navigation audit
- [ ] TASK: Mobile usability check (iOS Safari, Android Chrome)
- [ ] TASK: Cross-browser smoke test (Chrome, Firefox, Safari latest 2)
- [ ] TASK: Performance check (TTI ≤ 3s, bundle ≤ 500kb gzipped)
- [ ] TASK: Offline verification

---

## Stretch

- [ ] CODE: Onboarding screen (first-launch only, animated demo)
- [ ] CODE: Streak freeze (24h grace period)
