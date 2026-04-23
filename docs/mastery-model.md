# Mastery Model

This app uses two separate learning systems:

1. `FSRS` schedules *when* a word should come back.
2. `mastery` shows the learner-facing sense of *how well* the word is known.

They are intentionally separate.

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

## Migration / Backward Compatibility

Older users may already have FSRS history saved but no mastery score yet.

In that case, the app temporarily falls back to the old stability-derived value only until the word is reviewed again. After the next review, the learner-facing mastery score is stored directly and becomes the source of truth.
