# Mastery Model

This app uses two separate learning systems:

1. `FSRS` schedules *when* a word should come back.
2. `mastery` shows the learner-facing sense of *how well* the word is known.

They are intentionally separate.

## Where Each System Shows Up

- `XP` drives the numeric player level used during rounds.
- `mastery` drives the per-word circles, the Home mastery tier badge, the Home tier-progress bar, and the learning/mastered counts.

The Home card therefore mixes two progress systems on purpose:

- left circle = `XP level`
- right badge + segmented bar = `mastery tier progress`

## Why We Split Them

`FSRS stability` is good for scheduling reviews, but it is not a human-friendly mastery meter. A stability jump can be completely reasonable for the scheduler while still feeling strange as UI, especially if it is shown as a direct percentage.

The mastery circle is therefore a product metric, not a raw FSRS value.

## Mastery Rules

Mastery is stored per word and clamped between `0` and `100`.

### Correct answers

- correct answer: `+6`
- correct answer without translation: `+3` extra
- correct answer on a due review card: `+2` extra

That means:

- correct with translation on a new card: `+6`
- correct without translation on a new card: `+9`
- correct without translation on a due review: `+11`

### Incorrect answers

- incorrect answer: `-8`
- incorrect answer with translation visible: `-5`

## Thresholds

- `80+` mastery: counts as `mastered`
- `90+` mastery: leaves the active rotation, but can still appear as fallback

## Mastery Tiers

These tiers are based on how many words in a language have `80+` mastery:

- `Rookie`: `0-49`
- `Apprentice`: `50-199`
- `Scholar`: `200-599`
- `Linguist`: `600-1499`
- `Polyglot`: `1500+`

On the Home screen:

- the darker segment shows `mastered` progress inside the current tier
- the lighter segment shows `learning` words that still count visually inside that tier
- the rest of the track shows what remains in that tier

This means the mastery bar intentionally resets when the learner enters a new tier, similar to leveling up.

## Round Selection

Card scheduling still comes from FSRS, but round construction is slightly more game-friendly than a pure due/new split:

1. overdue review cards first
2. a few near-due review cards to keep recent learning responsive
3. new words by frequency
4. more not-yet-due review cards if needed
5. high-mastery cards only as a last resort fallback

## Migration / Backward Compatibility

Older users may already have FSRS history saved but no mastery score yet.

In that case, the app temporarily falls back to the old stability-derived value only until the word is reviewed again. After the next review, the learner-facing mastery score is stored directly and becomes the source of truth.
