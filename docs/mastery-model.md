# Mastery Model

This app uses two separate learning systems:

1. `FSRS` schedules *when* a word should come back.
2. `mastery` shows the learner-facing sense of *how well* the word is known.

They are intentionally separate.

## Where Each System Shows Up

- `XP` drives the numeric player level used during rounds.
- `mastery` drives the per-word circles, the Home mastery tier badge, the Home tier-progress bar, and the learning/mastered counts.
- `FSRS` drives review timing and round-selection priority.

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
- manually mastered words: count as `mastered` and are excluded from round selection

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

The implementation currently reserves up to `3` near-due review slots before filling the rest of the deck with new words.

## Round Mechanics

Rounds are summit climbs:

- a playable round needs at least `8` cards to start
- the deck is capped at `10` cards
- the learner starts with `5` lives
- correct answers move the hiker up `1` step
- incorrect answers remove `1` life, move the hiker down `1` step down to `0`, and requeue the missed word `3` positions ahead
- reaching `8` hiker steps passes the round
- reaching `0` lives fails the round

Scoring is based on the first result for each unique word in the round:

- correct answer: `+10` points
- correct without translation: `+5` extra
- perfect summit: `+50` extra when all `8` unique summit answers are correct
- failed round: `0` points, even though SRS and mastery updates still apply

The maximum passed-round score is therefore `170` points: `(10 + 5) * 8 + 50`.

## Migration / Backward Compatibility

Older users may already have FSRS history saved but no mastery score yet.

In that case, the app temporarily falls back to the old stability-derived value only until the word is reviewed again. After the next review, the learner-facing mastery score is stored directly and becomes the source of truth.
