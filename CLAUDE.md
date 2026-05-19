# Claude Code Notes

## Project
React 19 + TypeScript + Vite noun gender quiz app (PT/ES/FR/IT).
No test suite — verify changes by running `npx tsc --noEmit` and testing in the browser.

## Word lists — complete
All four language word lists have been replaced with ~2,000 curated, theme-tagged nouns per language.

| Language | File | Status |
|---|---|---|
| Italian | `src/data/words_it.json` | Done — 2,006 entries |
| French | `src/data/words_fr.json` | Done — 2,000 entries |
| Spanish | `src/data/words_es.json` | Done — 2,000 entries |
| Portuguese | `src/data/words_pt.json` | Done — 2,000 entries |

Words are added and edited manually. The scraping scripts in `scripts/` are no longer used.

## Word schema
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
No `rank` field (removed — file order drives new-word selection in `drawRound()`).
`category` is optional in the TypeScript type but required in practice for IT and FR.

## 18 category keys
people, body, food, home, clothing, animals, nature, weather, time, transport,
work_school, city_places, technology, arts_leisure, money_shop, general, health, emotions_abstract

`emotions_abstract` was deferred for IT but opened for FR. Build it last for each language.

## Key plan files
- `plan/word-categories.md` — locked taxonomy + hard exclusion rules
- `plan/word-curation-workflow.md` — per-batch workflow, article rules per language
- `plan/codex-es-categorization.md` — Codex categorization instructions for Spanish (historical reference)
