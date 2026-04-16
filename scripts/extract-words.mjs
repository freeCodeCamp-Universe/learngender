/**
 * Phase 1 — Data Extraction
 *
 * Downloads kaikki.org Wiktionary JSONL dumps for PT, ES, FR, IT,
 * filters for nouns with confirmed masculine/feminine gender,
 * cross-references with frequency word lists (hermitdave/FrequencyWords),
 * picks top 1000 by frequency rank, and writes static JSON files.
 *
 * Usage:
 *   node scripts/extract-words.mjs
 */

import { createWriteStream, mkdirSync, existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { createGunzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { createInterface } from 'readline'
import { Readable } from 'stream'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../src/data')
const CACHE_DIR = path.join(__dirname, '../.cache')
mkdirSync(DATA_DIR, { recursive: true })
mkdirSync(CACHE_DIR, { recursive: true })

const LANGUAGES = {
  pt: {
    name: 'Portuguese',
    kaikki: 'https://kaikki.org/dictionary/Portuguese/kaikki.org-dictionary-Portuguese.jsonl.gz',
    freq: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/pt/pt_50k.txt',
  },
  es: {
    name: 'Spanish',
    kaikki: 'https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl.gz',
    freq: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/es/es_50k.txt',
  },
  fr: {
    name: 'French',
    kaikki: 'https://kaikki.org/dictionary/French/kaikki.org-dictionary-French.jsonl.gz',
    freq: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/fr/fr_50k.txt',
  },
  it: {
    name: 'Italian',
    kaikki: 'https://kaikki.org/dictionary/Italian/kaikki.org-dictionary-Italian.jsonl.gz',
    freq: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/it/it_50k.txt',
  },
}

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

async function downloadGzIfNeeded(lang, url, suffix) {
  const cachePath = path.join(CACHE_DIR, `${lang}_${suffix}.jsonl.gz`)
  if (existsSync(cachePath)) {
    // Verify file is not empty/corrupt by checking size
    const { statSync } = await import('fs')
    const size = statSync(cachePath).size
    if (size > 10000) {
      console.log(`  [${lang}] Using cached dump (${(size / 1024 / 1024).toFixed(1)} MB)`)
      return cachePath
    }
    console.log(`  [${lang}] Cached file seems corrupt (${size} bytes), re-downloading...`)
  }
  console.log(`  [${lang}] Downloading ${url} ...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const dest = createWriteStream(cachePath)
  await pipeline(Readable.fromWeb(res.body), dest)
  const { statSync } = await import('fs')
  console.log(`  [${lang}] Downloaded (${(statSync(cachePath).size / 1024 / 1024).toFixed(1)} MB)`)
  return cachePath
}

/**
 * Load frequency rank map: word → rank (1 = most frequent)
 */
async function loadFrequencies(lang, url) {
  console.log(`  [${lang}] Loading frequency list...`)
  const text = await fetchText(url)
  const rankMap = new Map()
  let rank = 1
  for (const line of text.split('\n')) {
    const parts = line.trim().split(' ')
    if (parts.length >= 1 && parts[0]) {
      rankMap.set(parts[0].toLowerCase(), rank++)
    }
  }
  console.log(`  [${lang}] Loaded ${rankMap.size} frequency entries`)
  return rankMap
}

function extractGender(entry) {
  const tags = entry.tags ?? []
  if (tags.includes('masculine') && !tags.includes('feminine')) return 'masculine'
  if (tags.includes('feminine') && !tags.includes('masculine')) return 'feminine'

  for (const ht of entry.head_templates ?? []) {
    const args = ht.args ?? {}
    const g = args['g'] ?? args['1'] ?? args['g1'] ?? ''
    if (g === 'm' || g === 'masc') return 'masculine'
    if (g === 'f' || g === 'fem') return 'feminine'
  }

  // Check inflection_templates
  for (const it of entry.inflection_templates ?? []) {
    const args = it.args ?? {}
    const g = args['g'] ?? args['1'] ?? ''
    if (g === 'm') return 'masculine'
    if (g === 'f') return 'feminine'
  }

  return null
}

// Translations that indicate the entry is NOT a real noun to learn
const BAD_TRANSLATION_PATTERNS = [
  /^alternative form of/i,
  /^plural of/i,
  /^singular of/i,
  /^obsolete form of/i,
  /^archaic form of/i,
  /^the (?:letter|name of the|latin script letter)/i,
  /^abbreviation of/i,
  /^initialism of/i,
  /^acronym of/i,
  /^eye dialect of/i,
  /^misspelling of/i,
  /^past tense of/i,
  /^past participle of/i,
  /^superlative of/i,
  /^comparative of/i,
]

function extractTranslation(entry) {
  for (const sense of entry.senses ?? []) {
    for (const gloss of sense.glosses ?? []) {
      if (gloss && typeof gloss === 'string') {
        const clean = gloss
          .trim()
          .replace(/\s+/g, ' ')
          .trim()
        if (clean.length === 0 || clean.length > 80) continue
        if (BAD_TRANSLATION_PATTERNS.some((p) => p.test(clean))) continue
        // Strip trailing parenthetical notes for display
        return clean.replace(/\s*\(.*\)\s*$/, '').trim() || clean
      }
    }
  }
  return null
}

function isGoodNoun(word) {
  if (!word || typeof word !== 'string') return false
  if (word.length < 4) return false // too short — captures letters, articles, conjunctions
  if (word === word.toUpperCase() && word.length <= 5) return false // likely abbreviation
  if (/^\d/.test(word)) return false // starts with digit
  if (word.includes(' ')) return false // multi-word
  return true
}

async function processLanguage(lang, config) {
  const outPath = path.join(DATA_DIR, `words_${lang}.json`)

  // Load frequency list
  const freqMap = await loadFrequencies(lang, config.freq)

  // Download kaikki dump
  const cachePath = await downloadGzIfNeeded(lang, config.kaikki, 'kaikki')

  console.log(`  [${lang}] Scanning dump for nouns with gender...`)

  const { createReadStream } = await import('fs')
  const fileStream = createReadStream(cachePath)
  const gunzip = createGunzip()
  const rl = createInterface({ input: fileStream.pipe(gunzip), crlfDelay: Infinity })

  // Map: word → { gender, translation }  (first match wins)
  const nounMap = new Map()
  let lineCount = 0

  for await (const line of rl) {
    lineCount++
    if (lineCount % 200000 === 0) console.log(`    [${lang}] ${lineCount} lines...`)

    let entry
    try {
      entry = JSON.parse(line)
    } catch {
      continue
    }

    if (entry.pos !== 'noun') continue

    const word = entry.word
    if (!isGoodNoun(word)) continue
    if (word.length > 30) continue

    const wordLower = word.toLowerCase()

    // Only process words that appear in the frequency list
    const freqRank = freqMap.get(wordLower)
    if (!freqRank) continue

    // Skip the top 300 most frequent words — they are almost always function words
    // (articles, prepositions, pronouns, conjunctions) that appear as nouns only in
    // a marginal philosophical sense (e.g. "sim" = "a yes")
    if (freqRank < 300) continue

    // Skip if we already have an entry for this word
    if (nounMap.has(wordLower)) continue

    const gender = extractGender(entry)
    if (!gender) continue

    const translation = extractTranslation(entry)
    if (!translation) continue

    nounMap.set(wordLower, { word, gender, translation, freqRank })
  }

  console.log(`  [${lang}] Found ${nounMap.size} nouns with gender in frequency list`)

  // Sort by frequency rank and take top 1000
  const ranked = Array.from(nounMap.values())
    .sort((a, b) => a.freqRank - b.freqRank)
    .slice(0, 1000)
    .map(({ freqRank: _f, ...rest }, i) => ({ ...rest, rank: i + 1 }))

  if (ranked.length < 1000) {
    console.warn(`  [${lang}] WARNING: only ${ranked.length} words found (expected 1000)`)
  }

  await writeFile(outPath, JSON.stringify(ranked, null, 2), 'utf8')
  console.log(`  [${lang}] ✓ Wrote ${ranked.length} words → ${outPath}`)
  console.log(`  [${lang}]   Top 5: ${ranked.slice(0, 5).map((w) => w.word).join(', ')}`)
}

console.log('=== LearnNounGender — Word Extraction (with frequency ranking) ===\n')
for (const [lang, config] of Object.entries(LANGUAGES)) {
  try {
    await processLanguage(lang, config)
  } catch (err) {
    console.error(`  [${lang}] FAILED: ${err.message}`)
    console.error(err.stack)
  }
}
console.log('\nDone. Run pnpm data:notes next.')
