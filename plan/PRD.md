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
| learner | see my XP level, mastery tier, and vocabulary progress on the home screen | I can track both short-term and long-term progress |
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
The learner has 5 lives per round, displayed as hearts in the top-right corner. Each incorrect answer costs one life. Losing all 5 lives ends the round immediately. A word answered incorrectly is returned to the deck and may appear again in the same round.

**F5 — Gender indicators**
The article/pronoun for each gender is displayed on the left and right edges of the game screen as a persistent guide (e.g. "la" on the left, "el" on the right for Spanish; "la" / "le" for French; "a" / "o" for Portuguese; "la" / "il" for Italian). These are always visible.

**F6 — Translation toggle**
By default, no translation is shown. A small icon (👁️) on the card allows the learner to reveal the English translation inline for that specific card. A global setting (ON/OFF) on the home screen sets whether translations are shown by default on every card.

**F7 — Post-round summary**
After the learner reaches the summit (or runs out of lives), the game shows a post-round summary:
- A performance badge: Good Job / Great Job / Excellent Job (based on score)
- Score summary with points earned in the round, a score bar, and only the positive bonus chips that actually triggered
- The in-game numeric player-level badge animates separately with XP earned in the round
- A list of the unique words from the round with translation, correct article, mastery circle, and mastery delta

**F8 — Spaced repetition scheduling**
The app uses ts-fsrs to schedule each word independently. Words answered incorrectly are scheduled sooner; words answered correctly are scheduled later. Round construction prioritises overdue review words, then a small number of near-due review words, then new words by frequency. Scheduling state is persisted in localStorage.

**F9 — Progress persistence**
All SRS state, round history, level scores, and streak data are stored in localStorage. No account or login is required.

**F10 — Score, player level, and mastery system**
Each language has an independent XP score and numeric player level used in-game. Separately, each word also has a learner-facing mastery score, and each language has a mastery tier based on how many words are mastered. Score accumulates from correct answers and round bonuses as defined in the Levels and Score System section. The home screen displays the numeric XP level in the left circle and the mastery tier plus tier-progress bar on the right.

**F11 — Daily streak**
The app tracks consecutive days on which the learner completes at least one round. The streak count is displayed on the home screen.

### P1 — Important

**F12 — Swipe animation**
Cards animate left or right on swipe or keypress, providing visual feedback before advancing to the next card.

**F13 — Haptic feedback**
On mobile, an incorrect answer triggers a vibration via the Web Vibration API.

**F14 — Sound effects**
Sound plays on correct answers, incorrect answers, victory, and level-up events. A mute toggle is accessible via the settings menu.

**F15 — Settings menu**
A gear icon (⚙️) in the top-right corner of the home screen opens a slide-out settings panel with controls for: sound ON/OFF, and default translation display ON/OFF.

**F16 — Navigation**
A home button in the top-left corner of the game screen allows the learner to return to the home screen mid-round. My Words is accessed from the home screen navigation.

### P2 — Nice to Have

**F17 — Due-card prioritisation**
When drawing cards for a round, overdue SRS cards are prioritised first, followed by a small number of near-due review cards, then new unseen words.

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

Gender pattern explanations are hand-authored per language, covering the most common rules (e.g. "-tion is feminine in French", "-o is usually masculine in Italian").

---

## Screen Flow

```
Home Screen
  └── Tap language bar → Game Screen
        └── Reach summit → Summit / Victory Drawer
              └── Tap "Next" → Game Screen (same language)
              └── Tap "Exit" → Home Screen
        └── Lose all lives → Round ends
  └── Tap ⚙️ → Settings Panel (slide-out overlay)
  └── Tap "Words" → My Words Screen

Game Screen
  └── Tap Home → Home Screen

My Words Screen
  └── Tap ☰ → Home Screen
```

---

## Screen Specifications

### Home Screen
- App name and tagline at the top
- 🔥 Daily streak counter
- 4 language cards, one per language (PT / ES / FR / IT)
  - Left: numeric XP-level circle for that language
  - Header: language name and mastery-tier badge (`New`, `Rookie`, `Apprentice`, etc.)
  - Footer left: `Start` / `Play` button
  - Footer right: mastery-tier progress bar plus `learning · mastered` counts
  - Tapping the button starts a round in that language

### Game Screen
- **Top-left**: home button plus numeric player-level badge
- **Top-right**: lives
- **Background**: Mountain SVG with block wall overlay (8 rows)
- **Centre**: Word card
  - Large noun text
  - 👁️ icon to reveal translation inline (if default translation is OFF)
  - If default translation is ON, translation appears below the noun automatically
- **Left edge**: Feminine article/pronoun in a coloured band
- **Right edge**: Masculine article/pronoun in a coloured band
- **Bottom**: Clean swipe area with subtle ← swipe → hint (fades after first use)

### Summit / Victory Drawer
- Performance badge (Good Job / Great Job / Excellent Job, or Perfect Round) with icon
- Score bar showing points earned and active positive bonus chips
- Numeric player-level XP animation remains in the in-game top badge
- Word list: each unique word from the round showing noun, translation, correct gender article, mastery circle, and mastery delta
- "Next" and "Exit" actions

### My Words Screen
- Accessible from the home screen
- Language selector at the top (PT / ES / FR / IT)
- Only displays words the learner has encountered at least once — never-seen words are hidden
- Summary card at the top showing the current mastery tier and mastered progress
- Each word entry shows:
  - The noun in the target language
  - The correct gender article (e.g. "el", "la")
  - A mastery circle based on the learner-facing mastery score
  - English translation is only shown if "Show translation" is ON in settings
- Words are ordered by mastery descending (most progressed at the top)
- A summary line at the top shows e.g. "47 words seen · 12 mastered" for the selected language

---

## Levels and Score System

The app currently uses two separate progression systems per language:

1. Player XP level
- Used in the in-game numeric level badge.
- Driven by XP earned from rounds.
- Progression is numeric (`1, 2, 3...`), not named tiers.
- XP needed to go from level `n` to `n + 1` is calculated as `floor(95 * n^1.70)`.

2. Mastery bands
- Used on the Home and My Words screens.
- Driven by how many words are considered mastered (`80+` mastery).
- Displayed with named tiers: Rookie → Apprentice → Scholar → Linguist → Polyglot.

3. Per-word mastery
- Used for mastery circles, mastery deltas, mastery-tier progress, and learned-word counts.
- Stored independently from FSRS scheduling.
- Clamped to `0-100`.

### Mastery Level Thresholds

| Band | Name | Mastered words required |
|---|---|---|
| 1 | Rookie | 0 |
| 2 | Apprentice | 50 |
| 3 | Scholar | 200 |
| 4 | Linguist | 600 |
| 5 | Polyglot | 1500 |

### Per-word Mastery Rules

Correct answers:

- correct answer: `+6`
- correct answer without translation: `+3` extra
- correct answer on a due review card: `+2` extra

Incorrect answers:

- incorrect answer: `-8`
- incorrect answer with translation visible: `-5`

Operational thresholds:

- `80+` mastery = word counts as mastered
- `90+` mastery = word leaves the active rotation, except as fallback

### Points Per Round

| Event | Points |
|---|---|
| Correct answer | +10 |
| Correct answer without using translation | +5 bonus |
| Round completed with no errors (perfect round) | +50 bonus |

A perfect 8/8 summit round without translation = `(10 + 5) × 8 + 50 = 170` points.
A typical winning round (8 correct, translation used) = `8 × 10 = 80` points.

### Level-up Behaviour
- Numeric player-level up is detected at the end of a round and animated in the in-game top badge.
- If the learner crosses a numeric player-level threshold during a winning round, the XP bar animates and a level-up celebration appears near the badge.
- Mastery tiers do not level up in the same way during the round; they are used as long-term vocabulary progress labels on Home and My Words.

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
The mastery circle shown per word is a learner-facing mastery score stored separately from FSRS.

FSRS decides *when* a card should return.
Mastery decides *how known* the word should feel in the UI.

For backward compatibility, older cards may temporarily fall back to a legacy stability-derived value until the word is reviewed again.

### Persistence
The full ts-fsrs card state object (due date, stability, difficulty, elapsed days, scheduled days, reps, lapses, state, last review) is serialised to JSON and stored in localStorage under the key `lng_srs_{language}_{word}` (e.g. `lng_srs_es_gato`).

The learner-facing mastery score is stored separately under `lng_mastery_{language}_{word}`.

### Due-card Prioritisation
When drawing 10 cards for a round, the selection order is:
1. Words whose `due` date ≤ today (overdue first, oldest due date first)
2. A small number of near-due review cards
3. New words (never seen), ordered by frequency rank (most frequent first)
4. More not-yet-due review cards if needed
5. High-mastery cards only as a last-resort fallback

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
| AC1 | Learner can complete a full round from cold start with no errors or crashes |
| AC2 | Reaching the summit displays the win drawer; losing all 5 lives displays the loss drawer |
| AC3 | Post-round summary lists every unique round word with its correct gender article, translation, and mastery circle |
| AC4 | Closing and reopening the browser preserves SRS state, level score, and streak |
| AC5 | Due review cards are prioritised, and recently learned review cards can reappear before brand-new words |
| AC6 | Arrow keys (← feminine, → masculine) produce the same result as swiping |
| AC7 | App loads and is interactive within 3 seconds on broadband with no cached assets |
| AC8 | All 4 languages are available with ≥1000 words each at launch |
| AC9 | Incorrect answer triggers screen shake, heart loss, and haptic feedback on mobile |
| AC10 | Correct answers progressively reveal the mountain background; incorrect answers restore a row |
| AC11 | After 5 incorrect answers the round ends immediately |
| AC12 | Sound effects play on correct answer, incorrect answer, victory, and level-up; mute toggle works |
| AC13 | Daily streak increments after completing at least one round per day and persists across sessions |
| AC14 | Numeric player-level XP progress animates during the victory state and score summary reflects round bonuses correctly |
