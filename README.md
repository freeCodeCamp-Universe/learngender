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

## Data Scripts

Rebuild all language wordlists with the original extractor:

```bash
pnpm data:extract
```

Rebuild only the Portuguese list with the pt-BR pipeline:

```bash
pnpm data:extract:pt
```

Rebuild the Portuguese list and reapply `patternNote`:

```bash
pnpm data:refresh:pt
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
