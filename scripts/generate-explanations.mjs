/**
 * Phase 1 — Generate Pattern Explanations
 *
 * Reads the 1000-word JSON files produced by extract-words.mjs,
 * sends words to the Claude API in batches of 50, and writes
 * a `patternNote` field to each entry explaining why the noun
 * has its gender.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/generate-explanations.mjs
 *
 * Never called at runtime — build-time only.
 */

import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../src/data')

const LANGUAGES = ['pt', 'es', 'fr', 'it']
const LANGUAGE_NAMES = { pt: 'Portuguese', es: 'Spanish', fr: 'French', it: 'Italian' }
const BATCH_SIZE = 50
const FALLBACK_NOTE = 'No simple rule — must be memorised'

const client = new Anthropic()

async function generateBatch(language, words) {
  const langName = LANGUAGE_NAMES[language]
  const wordList = words
    .map((w) => `${w.word} (${w.gender})`)
    .join('\n')

  const prompt = `You are a ${langName} grammar expert. For each ${langName} noun below, write a single short explanation (max 12 words) of WHY the noun has that grammatical gender. Focus on patterns like suffixes, word origin, or semantic categories. If there's no clear rule, say "No simple rule — must be memorised".

Format your response as a JSON array of strings, one per word, in the same order as the input.

Nouns:
${wordList}`

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''

  // Extract JSON array from response
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('No JSON array found in response')

  const notes = JSON.parse(match[0])
  if (!Array.isArray(notes) || notes.length !== words.length) {
    throw new Error(`Expected ${words.length} notes, got ${notes?.length}`)
  }

  return notes.map((n) => (typeof n === 'string' && n.trim() ? n.trim() : FALLBACK_NOTE))
}

async function processLanguage(lang) {
  const filePath = path.join(DATA_DIR, `words_${lang}.json`)
  if (!existsSync(filePath)) {
    console.log(`  [${lang}] No data file found — run extract-words.mjs first`)
    return
  }

  const words = JSON.parse(await readFile(filePath, 'utf8'))

  // Skip if all words already have patternNote
  const missing = words.filter((w) => !w.patternNote)
  if (missing.length === 0) {
    console.log(`  [${lang}] All words already have patternNote, skipping.`)
    return
  }

  console.log(`  [${lang}] Generating notes for ${missing.length} words in batches of ${BATCH_SIZE}...`)

  // Build index map for quick lookup
  const noteMap = new Map(words.filter((w) => w.patternNote).map((w) => [w.word, w.patternNote]))

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const total = Math.ceil(missing.length / BATCH_SIZE)
    console.log(`    [${lang}] Batch ${batchNum}/${total} ...`)

    let notes
    try {
      notes = await generateBatch(lang, batch)
    } catch (err) {
      console.warn(`    [${lang}] Batch ${batchNum} failed: ${err.message}. Retrying once...`)
      try {
        notes = await generateBatch(lang, batch)
      } catch {
        notes = batch.map(() => FALLBACK_NOTE)
      }
    }

    for (let j = 0; j < batch.length; j++) {
      noteMap.set(batch[j].word, notes[j])
    }
  }

  // Merge back
  const updated = words.map((w) => ({
    ...w,
    patternNote: noteMap.get(w.word) ?? FALLBACK_NOTE,
  }))

  await writeFile(filePath, JSON.stringify(updated, null, 2), 'utf8')
  console.log(`  [${lang}] ✓ Updated ${filePath}`)
}

console.log('=== LearnNounGender — Pattern Explanation Generator ===\n')

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable not set.')
  process.exit(1)
}

for (const lang of LANGUAGES) {
  try {
    await processLanguage(lang)
  } catch (err) {
    console.error(`  [${lang}] FAILED: ${err.message}`)
  }
}

console.log('\nDone.')
