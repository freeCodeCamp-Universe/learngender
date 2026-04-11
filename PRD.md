# Product Requirements Document: LearnNounGender

## Overview

LearnNounGender is a browser-based flashcard game that helps intermediate English-speaking learners of Portuguese, Spanish, French, and Italian practise identifying noun gender (masculine vs. feminine) through a swipe mechanic, spaced repetition, and a progressive reveal mechanic.

## One-line Description

Master the gender of nouns in Portuguese, Spanish, French, and Italian through fast flashcard drills powered by spaced repetition.

## Full Description

LearnNounGender is a free browser-based app for intermediate learners of Portuguese, Spanish, French, and Italian who want to build an instinct for noun gender. Native English speakers have no reference point for grammatical gender — and most language apps teach it incidentally, never making it the primary focus. LearnNounGender fixes that. Choose a language, swipe through flashcards picking masculine or feminine, and see exactly which gender rules you are missing. A built-in spaced repetition system quietly tracks your weak spots and surfaces them more often, so the words that trip you up get drilled until they stick. No account needed — just open the app and start.

---

## Problem Statement

Grammatical gender does not exist in English. Learners of Romance languages must memorise the gender of every noun they encounter, yet no dedicated tool exists to drill this skill in isolation. General language apps (Duolingo, Babbel) teach gender incidentally but never make it the primary focus.

---

## Target Users

Intermediate learners of Portuguese, Spanish, French, or Italian who are native English speakers (or speakers of any language without grammatical gender) and want to improve their instinct for noun gender.

---

## User Stories

| As a… | I want to… | So that… |
|---|---|---|
| learner | choose a language and start immediately | I can practise without friction |
| learner | swipe a flashcard left or right to select feminine or masculine | the interaction is fast and intuitive |
| learner | see a mountain slowly revealed as I answer correctly | I feel a sense of progress and achievement mid-round |
| learner | lose a life when I answer incorrectly | I am motivated to stay focused |
| learner | see my score and a performance badge at the end of a round | I know how well I did |
| learner | see which words I got wrong and why after a round | I can learn the gender rule I missed |
| learner | see a mastery circle per word on the result screen | I know how well I know each word |
| learner | have difficult words appear more often in future rounds | I can improve on my weak spots without manual configuration |
| learner | see my level and score per language on the home screen | I can track my long-term progress |
| learner | maintain a daily streak | I am motivated to practise every day |
| learner | open the app in my browser immediately | I do not have to install anything |
| learner | pick up where I left off in a later session | my progress is not lost when I close the tab |
| learner | toggle sound and translation in settings | I can customise my experience |

---

## Functional Requirements

### P0 — Must Have

**F1 — Language selection**
The home screen displays four language options: Portuguese, Spanish, French, and Italian. Tapping a language starts a round in that language immediately.

**F2 — Flashcard round**
A round consists of 10 cards drawn from the top-1000 most frequent nouns for the selected language, prioritising words due for SRS review, then new words by frequency order. Each card displays a noun. The learner swipes right for masculine or left for feminine. Keyboard arrow keys must also be supported (← feminine, → masculine).

**F3 — Game mechanic — mountain reveal**
The game screen background displays a mountain SVG illustration with a wall of 8 rows of blocks overlaid on top, obscuring the mountain. Each correct answer removes one row from the bottom of the wall, revealing more of the mountain. Each incorrect answer adds one row back. If all 8 rows are removed, the mountain is fully revealed and a flag appears at the summit. The wall animates (shakes) on both correct and incorrect answers.

**F4 — Lives system**
The learner has 3 lives per round, displayed as hearts in the top-right corner. Each incorrect answer costs one life. Losing all 3 lives ends the round immediately. A word answered incorrectly is returned to the deck and may appear again in the same round.

**F5 — Gender indicators**
The article/pronoun for each gender is displayed on the left and right edges of the game screen as a persistent guide (e.g. "la" on the left, "el" on the right for Spanish; "la" / "le" for French; "a" / "o" for Portuguese; "la" / "il" for Italian). These are always visible.

**F6 — Translation toggle**
By default, no translation is shown. A small icon (👁️) on the card allows the learner to reveal the English translation inline for that specific card. A global setting (ON/OFF) on the home screen sets whether translations are shown by default on every card.

**F7 — Round result screen**
After all 10 cards are answered (or the learner runs out of lives), the result screen shows:
- A performance badge: Good Job / Great Job / Excellent Job (based on score)
- Score (e.g. 8/10) and pass/fail status (pass = ≥7/10)
- An animated level progress bar filling with points earned in the round
- A list of every word from the round with its translation, correct gender, a brief pattern explanation, and a mastery circle showing the learner's SRS mastery percentage for that word

**F8 — Spaced repetition scheduling**
The app uses ts-fsrs to schedule each word independently. Words answered incorrectly are scheduled sooner; words answered correctly are scheduled later. Scheduling state is persisted in localStorage.

**F9 — Progress persistence**
All SRS state, round history, level scores, and streak data are stored in localStorage. No account or login is required.

**F10 — Level and score system**
Each language has an independent score and level. Levels progress as: Rookie → Apprentice → Scholar → Linguist → Polyglot. Score accumulates based on correct answers and round bonuses as defined in the Levels and Score System section. The home screen displays a segmented progress bar per language showing the current score, level name, and progress toward the next level threshold.

**F11 — Daily streak**
The app tracks consecutive days on which the learner completes at least one round. The streak count is displayed on the home screen.

### P1 — Important

**F12 — Swipe animation**
Cards animate left or right on swipe or keypress, providing visual feedback before advancing to the next card.

**F13 — Haptic feedback**
On mobile, an incorrect answer triggers a vibration via the Web Vibration API.

**F14 — Sound effects**
Sound plays on correct answers, incorrect answers, and level-up events. A mute toggle is accessible via the settings menu.

**F15 — Settings menu**
A gear icon (⚙️) in the top-right corner of the home screen opens a slide-out settings panel with controls for: sound ON/OFF, and default translation display ON/OFF.

**F16 — Navigation**
A hamburger icon (☰) in the top-left corner of the game screen allows the learner to return to the home screen mid-round.

### P2 — Nice to Have

**F17 — Due-card prioritisation**
When drawing cards for a round, words whose SRS due date has passed are prioritised over new unseen words.

**F18 — Onboarding**
On first launch, a brief instructions screen explains the swipe mechanic (left = feminine, right = masculine) before the first round begins.

---

## Non-Functional Requirements

**NF1 — Performance**: The app must load and be interactive within 3 seconds on a standard broadband connection with no cached assets.

**NF2 — Offline support**: After first load, the app must function without a network connection. Word lists are bundled as static JSON, not fetched at runtime.

**NF3 — Accessibility**: All interactive elements must be keyboard-navigable. Colour is not the only indicator of gender — labels (article/pronoun) must also be present.

**NF4 — Browser support**: Must work on the latest two versions of Chrome, Firefox, and Safari on both desktop and mobile.

**NF5 — Data privacy**: No personal data is sent to any server. All state lives in localStorage.

**NF6 — Mobile-first**: The game screen must be optimised for one-handed mobile use. The lower portion of the screen must remain unobstructed to allow comfortable swiping.

---

## Word Data

Word lists are extracted from kaikki.org Wiktionary dumps (CC BY-SA licence) by the Claude Code setup script. The script downloads the dump for each language, filters for nouns with a confirmed masculine or feminine gender, sorts by frequency, and outputs the top 1000 words per language as a static JSON file bundled with the app.

Each word entry contains:
- The noun (in the target language)
- Its English translation
- Its grammatical gender (masculine / feminine)
- Its frequency rank

Gender pattern explanations (shown on the result screen) are hand-authored per language, covering the most common rules (e.g. "-tion is feminine in French", "-o is usually masculine in Italian").

---

## Screen Flow

```
Home Screen
  └── Tap language bar → Game Screen
        └── Round ends (10 cards or 0 lives) → Result Screen
              └── Tap "Play Again" → Game Screen (same language)
              └── Tap "Home" → Home Screen
  └── Tap ⚙️ → Settings Panel (slide-out overlay)
  └── Tap ☰ → My Words Screen

Game Screen
  └── Tap ☰ → My Words Screen

My Words Screen
  └── Tap ☰ → Home Screen
```

---

## Screen Specifications

### Home Screen
- App name and tagline at the top
- 🔥 Daily streak counter
- 4 segmented progress bars, one per language (PT / ES / FR / IT)
  - Each bar shows: language name, numeric score, level name (Rookie → Polyglot), and progress toward next level
  - Tapping a bar starts a round in that language
- Languages with no rounds played show "Start" instead of a score

### Game Screen
- **Top-left**: ☰ hamburger (returns to home screen)
- **Top-right**: ⚙️ gear (opens settings), 3 hearts (lives)
- **Background**: Mountain SVG with block wall overlay (8 rows)
- **Centre**: Word card
  - Large noun text
  - 👁️ icon to reveal translation inline (if default translation is OFF)
  - If default translation is ON, translation appears below the noun automatically
- **Left edge**: Feminine article/pronoun in a coloured band
- **Right edge**: Masculine article/pronoun in a coloured band
- **Bottom**: Clean swipe area with subtle ← swipe → hint (fades after first use)

### Result Screen
- Performance badge (Good Job / Great Job / Excellent Job) with icon
- Score (X/10) and pass/fail status
- Animated level progress bar showing points earned
- Word list: each word from the round showing noun, translation, correct gender article, pattern note, and mastery circle (% filled based on SRS state)
- "Play Again" and "Home" buttons

### My Words Screen
- Accessible via ☰ hamburger from any screen
- Language selector at the top (PT / ES / FR / IT)
- Only displays words the learner has encountered at least once — never-seen words are hidden
- Each word entry shows:
  - The noun in the target language
  - The correct gender article (e.g. "el", "la")
  - A mastery circle: fills progressively based on ts-fsrs retrievability; fully green at 100%
  - English translation is only shown if "Show translation" is ON in settings
- Words are ordered by mastery ascending (least mastered at the top) to surface weak spots
- A summary line at the top shows e.g. "47 words seen · 12 mastered" for the selected language

---

## Levels and Score System

Each language has an independent score and level. Score accumulates from correct answers and bonuses earned during rounds.

### Level Thresholds

| Level | Name | XP Required (cumulative) | Approximate days at 1 round/day |
|---|---|---|---|
| 1 | Rookie | 0 | Day 0 |
| 2 | Apprentice | 500 | ~5 days |
| 3 | Scholar | 2.000 | ~20 days |
| 4 | Linguist | 6.000 | ~60 days |
| 5 | Polyglot | 16.000 | ~160 days |

### Points Per Round

| Event | Points |
|---|---|
| Correct answer | +10 |
| Correct answer without using translation | +5 bonus |
| Round completed with no errors (perfect round) | +50 bonus |
| Round passed (≥7/10) | +20 bonus |

A perfect round without translation = (10 + 5) × 10 + 50 = 200 points.
A typical pass round (8 correct, translation used) = 8 × 10 + 20 = 100 points.

### Level-up Behaviour
- Level-up is detected at the end of a round on the result screen
- If the learner crosses a level threshold during a round, the progress bar on the result screen animates past the threshold and triggers a level-up celebration (badge + sound)
- Levels are per language and stored independently in localStorage

---

## Spaced Repetition — ts-fsrs

The app uses the [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) library for spaced repetition scheduling.

### Library
- Package: `ts-fsrs` (latest stable version at build time)
- Algorithm: FSRS-5

### Rating Mapping
Each card answer maps to a ts-fsrs rating as follows:

| Learner action | ts-fsrs Rating |
|---|---|
| Correct answer | `Rating.Good` |
| Incorrect answer | `Rating.Again` |

No partial credit or "Hard" ratings are used. The mechanic is binary: right or wrong.

### Mastery Percentage
The mastery circle shown per word on the result screen is calculated from the ts-fsrs `stability` field using the retrievability formula:

`retrievability = e^(-t / stability)`

Where `t` is the number of days since the card was last reviewed. Mastery % displayed = `retrievability × 100`, clamped to 0–100. A word never seen has 0% mastery.

### Persistence
The full ts-fsrs card state object (due date, stability, difficulty, elapsed days, scheduled days, reps, lapses, state, last review) is serialised to JSON and stored in localStorage under the key `lng_srs_{language}_{word}` (e.g. `lng_srs_es_gato`).

### Due-card Prioritisation
When drawing 10 cards for a round, the selection order is:
1. Words whose `due` date ≤ today (overdue first, oldest due date first)
2. New words (never seen), ordered by frequency rank (most frequent first)

---

## Gender Articles / Pronouns by Language

| Language | Feminine (left) | Masculine (right) |
|---|---|---|
| Portuguese | a | o |
| Spanish | la | el |
| French | la | le |
| Italian | la | il |

---

## Out of Scope

- User accounts, cloud sync, or any server-side storage
- Languages other than Portuguese, Spanish, French, and Italian
- Genders other than masculine and feminine
- Grammar lessons, conjugation drills, or translation exercises
- Hints or assistance during an active round beyond the translation toggle
- Audio pronunciation
- Mobile native apps (iOS / Android)
- Topic-based word filtering (words are ordered by frequency only)

---

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC1 | Learner can complete a full 10-card round from cold start with no errors or crashes |
| AC2 | A round with ≥7 correct answers displays "passed"; <7 displays "failed" |
| AC3 | Post-round screen lists every word with its correct gender, translation, pattern note, and mastery circle |
| AC4 | Closing and reopening the browser preserves SRS state, level score, and streak |
| AC5 | A word answered incorrectly appears in the next round sooner than a word answered correctly |
| AC6 | Arrow keys (← feminine, → masculine) produce the same result as swiping |
| AC7 | App loads and is interactive within 3 seconds on broadband with no cached assets |
| AC8 | All 4 languages are available with ≥1000 words each at launch |
| AC9 | Incorrect answer triggers screen shake, heart loss, and haptic feedback on mobile |
| AC10 | Correct answers progressively reveal the mountain background; incorrect answers restore a row |
| AC11 | After 3 incorrect answers the round ends immediately |
| AC12 | Sound effects play on correct answer, incorrect answer, and level-up; mute toggle works |
| AC13 | Daily streak increments after completing at least one round per day and persists across sessions |
| AC14 | Level progress bar on result screen animates to show points earned in the round |