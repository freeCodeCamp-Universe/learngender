# Learn Gender

Browser-based swipe quiz for practicing noun gender in Portuguese, Spanish, French, and Italian.

## Stack

- React 19 + TypeScript
- Vite
- `pnpm`

## Development

```bash
pnpm install   # install dependencies
pnpm dev       # start dev server
pnpm lint      # run lint
pnpm words:check # validate word data
pnpm build     # production build
```

## How It Works

### Swipe quiz

The game is a mountain-climb swipe quiz. Swipe left for feminine or right for masculine, or use the left/right arrow keys. The side bands show the article choices for the current word; languages with ambiguous article forms, such as `l'`, add gender qualifiers.

A round starts only when the app can build at least 8 cards. The deck is capped at 10 cards, but the win condition is the summit: reach 8 hiker steps before running out of lives.

| Answer | Effect |
|---|---|
| Correct | +1 correct answer, +1 hiker step |
| Incorrect | −1 life, −1 hiker step down to 0, and the word is requeued 3 positions ahead |
| 8 hiker steps | Round passed; summit drawer opens |
| 0 lives | Round failed; no XP points are awarded |

The translation toggle can be changed with the translate button or `T`. A setting can show translations by default.

Cards are drawn in this priority order:
1. Due SRS review cards
2. Up to 3 not-yet-due review cards, nearest due first
3. New unseen words, in word-list order
4. More not-yet-due SRS cards if needed
5. High-mastery SRS cards as a last resort

Words manually marked as mastered are excluded from round selection.

### Spaced repetition (FSRS-5)

Each word has an SRS card powered by [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs). Correct answers are rated `Good`; incorrect answers are rated `Again`. This determines when the word is next due for review.

### Mastery

Separate from SRS, each word has a learner-facing **mastery score** (0–100%). It changes after every answer:

| Event | Change |
|---|---|
| Correct answer | +6 |
| Correct without seeing translation | +3 bonus |
| Correct on a due review card | +2 bonus |
| Incorrect answer | −8 |
| Incorrect after seeing translation | −5 (instead of −8) |

A word is considered **mastered** at ≥ 80%. Words at ≥ 90% mastery are deprioritized from active rotation.

See docs/mastery-model.md for more details.

### Scoring and XP

Points are earned only on passed summit rounds. Failed rounds update word history and mastery, but award 0 points.

| Event | Points |
|---|---|
| Correct answer | +10 |
| Correct without seeing translation | +5 bonus |
| Perfect summit (8 unique answers, all correct) | +50 bonus |

Maximum per round: **170 points** (`8 × 15 + 50`).

Accumulated points feed into an **XP level** (starts at 1, grows with a curve). XP level is purely decorative.

### Mastery tiers

Each language also has a **mastery tier** based on how many words you've mastered (≥ 80%):

| Tier | Mastered words |
|---|---|
| Rookie | 0 |
| Apprentice | 50 |
| Scholar | 200 |
| Linguist | 600 |
| Polyglot | 1 500 |

### Theory modules

Each language has slide-based grammar theory modules covering topics like article rules, noun plurals, adjective agreement, and language-specific exceptions. Modules can be navigated with buttons, arrow keys, or swipe gestures. Completion progress is stored in `localStorage`.

| Language | Modules |
|---|---|
| Portuguese | 5 |
| Spanish | 8 |
| French | 10 |
| Italian | 8 |

### Word lists

Each language has about 2,000 curated nouns stored in `src/data/words_<lang>.json`. Words are manually curated and tagged with a category. File order drives new-word selection.

Word schema:
```json
{
  "id": "casa__feminine__house",
  "word": "casa",
  "translation": "house",
  "gender": "feminine",
  "article": "la",
  "category": "home"
}
```

The 18 category keys are: `people`, `body`, `food`, `home`, `clothing`, `animals`, `nature`, `weather`, `time`, `transport`, `work_school`, `city_places`, `technology`, `arts_leisure`, `money_shop`, `general`, `health`, `emotions_abstract`.

### My Words

The **My Words** screen shows seen words by language, split into learning and mastered tabs. A word moves to mastered at 80% mastery, and the learner can also manually mark or unmark words as mastered. Manual mastery updates the language's mastered count and keeps that word out of future rounds.

### Local storage

Progress is client-side only. The app stores SRS cards, mastery percentages, seen words, manual mastery flags, score/level data, streaks, settings, and completed theory modules in `localStorage`.
