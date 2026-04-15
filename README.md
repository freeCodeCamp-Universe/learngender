# LearnNounGender

Browser-based flashcard game for practicing noun gender in Portuguese, Spanish, French, and Italian.

## Stack

- React
- TypeScript
- Vite
- `pnpm`

## Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Run lint:

```bash
pnpm lint
```

Build for production:

```bash
pnpm build
```

## Game Mechanics

- A playable round must start with at least `SUMMIT_STEP` cards, because the game should never enter `playing` without enough cards to reach a full summit.
- `useRound.attempt()` rejects any deck shorter than `SUMMIT_STEP`.
- Round initialization retries automatically once. If the second attempt also fails, the round transitions to `init_failed`.
- `drawRound()` fills the deck in this order:
  - due review cards
  - new unseen cards
  - not-yet-due SRS cards, nearest due first
  - SRS-mastered cards, nearest due first, as a last resort
- `loading` is used only while round initialization is actively running.
- If round initialization fails twice, the game shows a final `Couldn't start the next round.` state with a `Home` action.

## Data Scripts

Rebuild all language wordlists with the dedicated pipelines:

```bash
pnpm data:extract
```

Rebuild only the Portuguese list with the pt-BR pipeline:

```bash
pnpm data:extract:pt
```

Rebuild only the Spanish list with the cleaner Spanish pipeline:

```bash
pnpm data:extract:es
```

Rebuild only the French list with the Lexique-based French pipeline:

```bash
pnpm data:extract:fr
```

Rebuild only the Italian list with the PAISÀ-based Italian pipeline:

```bash
pnpm data:extract:it
```

Rebuild the Portuguese list and reapply `patternNote`:

```bash
pnpm data:refresh:pt
```

Rebuild the Spanish list and reapply `patternNote`:

```bash
pnpm data:refresh:es
```

Rebuild the French list and reapply `patternNote`:

```bash
pnpm data:refresh:fr
```

Rebuild the Italian list and reapply `patternNote`:

```bash
pnpm data:refresh:it
```

Generate pattern notes for existing wordlists:

```bash
pnpm data:explain
```

## pt-BR Wordlist

The Portuguese list is rebuilt from:

- Linguateca `Corpus Brasileiro` noun lemmas for ranking/frequency
- Kaikki Portuguese entries for gender and seed translations
- local overrides in `scripts/config/ptbr-manual-overrides.json` for known bad senses and pt-PT exclusions

The generated app data lives in `src/data/words_pt.json`.

## Spanish Wordlist

The Spanish list is rebuilt from:

- `doozan/spanish_data` `frequency.csv` for noun-form frequency
- Kaikki Spanish entries for gender and seed translations
- local overrides in `scripts/config/es-manual-overrides.json` for bad homographs, vulgar outliers, and common translation fixes

The generated app data lives in `src/data/words_es.json`.

## French Wordlist

The French list is rebuilt from:

- Lexique 3.83 for noun frequency and grammatical gender
- Kaikki French entries for seed translations
- local overrides in `scripts/config/fr-manual-overrides.json` for bad homographs, nonstandard spellings, and translation fixes

The generated app data lives in `src/data/words_fr.json`.

## Italian Wordlist

The Italian list is rebuilt from:

- PAISÀ lemma frequencies for ranking
- Kaikki Italian entries for gender and seed translations
- local overrides in `scripts/config/it-manual-overrides.json` for bad homographs, offensive outliers, and translation fixes

The generated app data lives in `src/data/words_it.json`.
