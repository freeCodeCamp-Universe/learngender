/**
 * Rebuild the Spanish list with a cleaner noun-selection pipeline.
 *
 * Ranking source:
 *   doozan/spanish_data frequency.csv
 *   - noun rows only
 *   - individual usage forms split back out from merged lemmas
 *
 * Gender + seed translations:
 *   Kaikki English Wiktionary Spanish dump
 *
 * Usage:
 *   node scripts/extract-es-words.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import { createGunzip } from 'zlib'
import http from 'http'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')
const DATA_DIR = path.join(ROOT_DIR, 'src/data')
const CACHE_DIR = path.join(ROOT_DIR, '.cache')
const CONFIG_DIR = path.join(__dirname, 'config')

mkdirSync(DATA_DIR, { recursive: true })
mkdirSync(CACHE_DIR, { recursive: true })

const ES_OUT_PATH = path.join(DATA_DIR, 'words_es.json')
const REPORT_PATH = path.join(CACHE_DIR, 'es_rebuild_report.json')
const OVERRIDES_PATH = path.join(CONFIG_DIR, 'es-manual-overrides.json')

const FREQUENCY_URL = 'https://raw.githubusercontent.com/doozan/spanish_data/master/frequency.csv'
const FREQUENCY_CACHE = path.join(CACHE_DIR, 'es_frequency.csv')
const KAIKKI_URL = 'https://kaikki.org/dictionary/Spanish/kaikki.org-dictionary-Spanish.jsonl.gz'
const KAIKKI_CACHE = path.join(CACHE_DIR, 'es_kaikki.jsonl.gz')

const TARGET_COUNT = 1000
const WORD_RE = /^[a-záéíóúüñ]+(?:-[a-záéíóúüñ]+)*$/i

const BAD_GLOSS_PATTERNS = [
  /^(alternative|obsolete|archaic|plural|singular|misspelling|abbreviation|initialism|acronym) of\b/i,
  /^alternative letter-case form of\b/i,
  /^ellipsis of\b/i,
  /^inflection of\b/i,
  /^female equivalent of\b/i,
  /^male equivalent of\b/i,
  /^only used in\b/i,
  /^synonym of\b/i,
]

const EQUIVALENT_TAIL_PATTERN = /[;,]\s*(?:female|male) equivalent of .+$/i
const HARD_REJECT_LABELS = new Set(['derogatory', 'offensive', 'pejorative', 'slur', 'vulgar'])
const OFFENSIVE_TRANSLATION_PATTERNS = [
  /\b(?:asshole|bastard|bitch|crazy person|drunkard|fat man|fat woman|idiot|madman|madwoman|moron|puto|slut|twit|whore)\b/i,
]

function loadOverrides() {
  return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'))
}

function requestBuffer(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const req = client.get(url, { headers: { 'user-agent': 'LearnNounGender data rebuild' } }, (res) => {
      const status = res.statusCode ?? 0

      if (status >= 300 && status < 400 && res.headers.location) {
        if (redirects >= 5) {
          reject(new Error(`Too many redirects while fetching ${url}`))
          return
        }
        const nextUrl = new URL(res.headers.location, url).toString()
        resolve(requestBuffer(nextUrl, redirects + 1))
        return
      }

      if (status < 200 || status >= 300) {
        reject(new Error(`HTTP ${status} for ${url}`))
        return
      }

      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })

    req.on('error', reject)
  })
}

async function ensureCacheFile(cachePath, url) {
  if (existsSync(cachePath)) return cachePath

  console.log(`Downloading ${url} ...`)
  const buffer = await requestBuffer(url)
  writeFileSync(cachePath, buffer)
  return cachePath
}

function extractGender(entry) {
  for (const ht of entry.head_templates ?? []) {
    const args = ht.args ?? {}
    for (const key of ['g', '1', 'g1']) {
      const value = args[key]
      if (value === 'm' || value === 'masc') return 'masculine'
      if (value === 'f' || value === 'fem') return 'feminine'
    }
  }

  const entryTags = entry.tags ?? []
  if (entryTags.includes('masculine') && !entryTags.includes('feminine')) return 'masculine'
  if (entryTags.includes('feminine') && !entryTags.includes('masculine')) return 'feminine'

  for (const sense of entry.senses ?? []) {
    const tags = sense.tags ?? []
    if (tags.includes('masculine') && !tags.includes('feminine')) return 'masculine'
    if (tags.includes('feminine') && !tags.includes('masculine')) return 'feminine'
  }

  return null
}

function collectSenseLabels(sense) {
  const labels = new Set()

  for (const value of sense.tags ?? []) labels.add(String(value).toLowerCase())
  for (const value of sense.raw_tags ?? []) labels.add(String(value).toLowerCase())

  for (const category of sense.categories ?? []) {
    if (category?.name) labels.add(String(category.name).toLowerCase())
  }

  return labels
}

function cleanTranslation(gloss) {
  return gloss
    .replace(EQUIVALENT_TAIL_PATTERN, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim()
    .replace(/[;,:\s]+$/, '')
}

async function buildKaikkiIndex(cachePath) {
  const fileStream = createReadStream(cachePath)
  const gunzip = createGunzip()
  const rl = createInterface({ input: fileStream.pipe(gunzip), crlfDelay: Infinity })

  const entries = new Map()

  for await (const line of rl) {
    let entry
    try {
      entry = JSON.parse(line)
    } catch {
      continue
    }

    if (entry.pos !== 'noun') continue

    const gender = extractGender(entry)
    if (!gender) continue

    const word = String(entry.word ?? '').toLowerCase()
    if (!word) continue

    const list = entries.get(word) ?? []
    list.push({ word, gender, entry })
    entries.set(word, list)
  }

  return entries
}

function buildFrequencyCandidates(index, rejectWords) {
  const csvText = readFileSync(FREQUENCY_CACHE, 'utf8')
  const frequencies = new Map()

  for (const [lineIndex, line] of csvText.split('\n').entries()) {
    if (!line.trim()) continue
    if (lineIndex === 0) continue

    const [count, spanish, pos, flags, usage] = line.split(',', 5)
    const row = { count, spanish, pos, flags, usage }
    if (row.pos !== 'n') continue
    if ((row.flags ?? '').includes('DUPLICATE')) continue

    for (const usagePart of String(row.usage ?? '').split('|')) {
      if (!usagePart.includes(':')) continue
      const [countStr, rawWord] = usagePart.split(':', 2)
      if (!/^\d+$/.test(countStr)) continue

      const word = rawWord.trim().toLowerCase()
      if (rejectWords.has(word)) continue
      if (!WORD_RE.test(word)) continue
      if (!index.has(word)) continue

      frequencies.set(word, (frequencies.get(word) ?? 0) + Number(countStr))
    }
  }

  return Array.from(frequencies.entries())
    .map(([word, freq]) => ({ word, freq }))
    .sort((a, b) => b.freq - a.freq || a.word.localeCompare(b.word))
}

function createResolver(index, overrides) {
  const memo = new Map()

  function resolveWord(word, depth = 0) {
    if (memo.has(word)) return memo.get(word)
    if (depth > 2) return null
    if ((overrides.rejectWords ?? []).includes(word)) return null

    const translationOverride = overrides.translationOverrides[word]
    if (translationOverride) {
      const wrappedEntries = index.get(word)
      if (wrappedEntries?.length) {
        const resolved = {
          gender: wrappedEntries[0].gender,
          translation: translationOverride,
          score: 999,
          source: 'manual-override',
        }
        memo.set(word, resolved)
        return resolved
      }
    }

    let best = null
    const wrappedEntries = index.get(word) ?? []

    for (const wrapped of wrappedEntries) {
      const { entry, gender } = wrapped

      ;(entry.senses ?? []).forEach((sense, senseIndex) => {
        const gloss = cleanTranslation(
          (sense.glosses ?? []).find((value) => typeof value === 'string' && value.trim()) ?? '',
        )
        if (!gloss) return
        if (BAD_GLOSS_PATTERNS.some((pattern) => pattern.test(gloss))) return

        const labels = collectSenseLabels(sense)
        if (labels.has('form-of') || labels.has('alt-of') || labels.has('ellipsis')) return
        if (Array.from(HARD_REJECT_LABELS).some((label) => labels.has(label))) return
        if (OFFENSIVE_TRANSLATION_PATTERNS.some((pattern) => pattern.test(gloss))) return

        let score = 100 - senseIndex * 5

        if (
          labels.has('dated') ||
          labels.has('obsolete') ||
          labels.has('archaic') ||
          labels.has('historical') ||
          labels.has('rare')
        ) {
          score -= 50
        }

        if (labels.has('vulgar')) score -= 70
        if (labels.has('slang') || labels.has('colloquial') || labels.has('euphemistic')) score -= 25

        if (
          labels.has('colors of the rainbow') ||
          labels.has('five') ||
          labels.has('eight') ||
          labels.has('nine') ||
          labels.has('ten')
        ) {
          score -= 35
        }

        if (labels.has('spain') || labels.has('peninsular spanish')) score -= 4
        if (labels.has('latin-america') || labels.has('latin american spanish')) score -= 2

        if (gloss.length <= 28) score += 4
        if ((gloss.match(/,/g) ?? []).length > 2) score -= 6
        if ((gloss.match(/;/g) ?? []).length > 1) score -= 6
        if (gloss.includes('(')) score -= 5
        if (gloss.length > 90) score -= 12

        const candidate = {
          gender,
          translation: gloss,
          score,
          source: 'kaikki',
        }

        if (score < 0) return
        if (!best || candidate.score > best.score) best = candidate
      })
    }

    memo.set(word, best)
    return best
  }

  return resolveWord
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

console.log('=== LearnNounGender — Spanish word rebuild ===\n')

const overrides = loadOverrides()
const rejectWords = new Set(overrides.rejectWords ?? [])

await ensureCacheFile(FREQUENCY_CACHE, FREQUENCY_URL)
await ensureCacheFile(KAIKKI_CACHE, KAIKKI_URL)

console.log('Indexing Kaikki noun entries...')
const index = await buildKaikkiIndex(KAIKKI_CACHE)
console.log(`  Indexed ${index.size} Spanish noun headwords`)

console.log('Loading frequency candidates...')
const candidates = buildFrequencyCandidates(index, rejectWords)
console.log(`  Loaded ${candidates.length} usage-form noun candidates`)

const resolveWord = createResolver(index, overrides)

const accepted = []
const rejected = []
const seen = new Set()

for (const candidate of candidates) {
  if (seen.has(candidate.word)) continue

  const resolved = resolveWord(candidate.word)
  if (!resolved) {
    rejected.push({ word: candidate.word, reason: 'no-acceptable-kaikki-sense' })
    continue
  }

  seen.add(candidate.word)
  accepted.push({
    word: candidate.word,
    translation: resolved.translation,
    gender: resolved.gender,
    rank: accepted.length + 1,
  })

  if (accepted.length === TARGET_COUNT) break
}

if (accepted.length < TARGET_COUNT) {
  throw new Error(`Only produced ${accepted.length} Spanish words; expected ${TARGET_COUNT}`)
}

writeJson(ES_OUT_PATH, accepted)
writeJson(REPORT_PATH, {
  generatedAt: new Date().toISOString(),
  source: {
    frequency: FREQUENCY_URL,
    kaikki: KAIKKI_URL,
  },
  acceptedCount: accepted.length,
  scannedCandidates: candidates.length,
  acceptedSample: accepted.slice(0, 200),
  rejectedSample: rejected.slice(0, 300),
})

console.log(`\nWrote ${accepted.length} Spanish words to ${ES_OUT_PATH}`)
console.log(`Report written to ${REPORT_PATH}`)
