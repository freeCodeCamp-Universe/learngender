/**
 * Rebuild the French list with Lexique 3.83 as the frequency source.
 *
 * Ranking + gender:
 *   Lexique 3.83 (official TSV)
 *
 * Seed translations:
 *   Kaikki English Wiktionary French dump
 *
 * Usage:
 *   node scripts/extract-fr-words.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import { createGunzip } from 'zlib'
import http from 'http'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'
import { finalizeWords, getTargetBuffer } from './lib/finalize-words.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')
const DATA_DIR = path.join(ROOT_DIR, 'src/data')
const CACHE_DIR = path.join(ROOT_DIR, '.cache')
const CONFIG_DIR = path.join(__dirname, 'config')

mkdirSync(DATA_DIR, { recursive: true })
mkdirSync(CACHE_DIR, { recursive: true })

const FR_OUT_PATH = path.join(DATA_DIR, 'words_fr.json')
const REPORT_PATH = path.join(CACHE_DIR, 'fr_rebuild_report.json')
const OVERRIDES_PATH = path.join(CONFIG_DIR, 'fr-manual-overrides.json')

const LEXIQUE_URL = 'http://www.lexique.org/databases/Lexique383/Lexique383.tsv'
const LEXIQUE_CACHE = path.join(CACHE_DIR, 'fr_lexique383.tsv')
const KAIKKI_URL = 'https://kaikki.org/dictionary/French/kaikki.org-dictionary-French.jsonl.gz'
const KAIKKI_CACHE = path.join(CACHE_DIR, 'fr_kaikki.jsonl.gz')

const TARGET_COUNT = 2000
const RAW_TARGET_COUNT = TARGET_COUNT + getTargetBuffer()
const WORD_RE = /^[a-zàâäçéèêëîïôöùûüÿæœ'-]+$/i

const BAD_GLOSS_PATTERNS = [
  /^(alternative|obsolete|archaic|plural|singular|misspelling|abbreviation|initialism|acronym) of\b/i,
  /^alternative letter-case form of\b/i,
  /^ellipsis of\b/i,
  /^female equivalent of\b/i,
  /^male equivalent of\b/i,
  /^nonstandard spelling of\b/i,
  /^only used in\b/i,
  /^synonym of\b/i,
]
const HARD_REJECT_LABELS = new Set(['derogatory', 'offensive', 'pejorative', 'slur', 'vulgar'])
const OFFENSIVE_TRANSLATION_PATTERNS = [
  /\b(?:asshole|bastard|bitch|crazy person|drunkard|fat man|fat woman|idiot|madman|madwoman|moron|slut|whore)\b/i,
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

function entryHasPluralOnlyHead(entry) {
  for (const head of entry.head_templates ?? []) {
    const expansion = String(head.expansion ?? '').toLowerCase()
    if (expansion.includes('plural only')) return true

    for (const value of Object.values(head.args ?? {})) {
      const normalized = String(value).toLowerCase()
      if (/^(?:m|f|mf)-p$/.test(normalized)) return true
    }
  }

  return false
}

function senseIsBlockedPlural(sense) {
  const labels = collectSenseLabels(sense)
  if (labels.has('invariable')) return false
  if (labels.has('form-of') || labels.has('alt-of')) return true
  return labels.has('plural') || labels.has('plural-only')
}

function entrySupportsNonPluralSense(entry) {
  if (entryHasPluralOnlyHead(entry)) return false

  for (const sense of entry.senses ?? []) {
    if (!senseIsBlockedPlural(sense)) return true
  }

  return false
}

function translationHasBlockedSense(entry, translation) {
  for (const sense of entry.senses ?? []) {
    const gloss = cleanTranslation(
      (sense.glosses ?? []).find((value) => typeof value === 'string' && value.trim()) ?? '',
    )
    if (!gloss || gloss !== translation) continue

    const labels = collectSenseLabels(sense)
    if (Array.from(HARD_REJECT_LABELS).some((label) => labels.has(label))) return true
    if (OFFENSIVE_TRANSLATION_PATTERNS.some((pattern) => pattern.test(gloss))) return true
  }

  return false
}

function cleanTranslation(gloss) {
  return gloss
    .replace(/[;,]\s*(?:female|male) equivalent of .+$/i, '')
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

function buildLexiqueCandidates(index, overrides) {
  const rows = readFileSync(LEXIQUE_CACHE, 'utf8').split('\n')
  const header = rows.shift()?.split('\t') ?? []
  const col = Object.fromEntries(header.map((name, idx) => [name, idx]))
  const entries = new Map()
  const rejectWords = new Set(overrides.rejectWords ?? [])
  const wordOverrides = overrides.wordOverrides ?? {}

  for (const line of rows) {
    if (!line.trim()) continue
    const parts = line.split('\t')

    const cgram = parts[col.cgram]
    const genre = parts[col.genre]
    const nombre = parts[col.nombre]
    if (cgram !== 'NOM') continue
    if (!['m', 'f'].includes(genre)) continue
    if (!['s', ''].includes(nombre)) continue

    const originalWord = (parts[col.ortho] ?? '').trim().toLowerCase()
    const word = wordOverrides[originalWord] ?? originalWord
    if (rejectWords.has(word) || rejectWords.has(originalWord)) continue
    if (word.length < 2 || word.length > 30) continue
    if (!WORD_RE.test(word)) continue

    const freqFilms = Number.parseFloat(parts[col.freqfilms2] || '0')
    const freqBooks = Number.parseFloat(parts[col.freqlivres] || '0')
    const freq = freqFilms > 0 ? freqFilms : freqBooks
    if (!(freq > 0)) continue

    if (!index.has(word) && !index.has(originalWord)) continue

    const existing = entries.get(word)
    if (!existing || freq > existing.freq) {
      entries.set(word, {
        word,
        originalWord,
        gender: genre === 'm' ? 'masculine' : 'feminine',
        freq,
      })
    }
  }

  return Array.from(entries.values()).sort((a, b) => b.freq - a.freq || a.word.localeCompare(b.word))
}

function createResolver(index, overrides) {
  const memo = new Map()

  function resolveWord(word, desiredGender = null) {
    const memoKey = `${word}::${desiredGender ?? 'any'}`
    if (memo.has(memoKey)) return memo.get(memoKey)

    const translationOverride = overrides.translationOverrides[word]
    if (translationOverride) {
      const wrappedEntry = (index.get(word) ?? []).find(({ entry, gender }) => (
        entrySupportsNonPluralSense(entry) && (!desiredGender || gender === desiredGender)
      ))
      if (wrappedEntry) {
        const resolved = {
          translation: translationOverride,
          score: 999,
          source: 'manual-override',
        }
        memo.set(memoKey, resolved)
        return resolved
      }
    }

    let best = null
    const wrappedEntries = index.get(word) ?? []

    for (const wrapped of wrappedEntries) {
      const { entry, gender } = wrapped
      if (desiredGender && gender !== desiredGender) continue
      if (!entrySupportsNonPluralSense(entry)) continue

      ;(entry.senses ?? []).forEach((sense, senseIndex) => {
        const gloss = cleanTranslation(
          (sense.glosses ?? []).find((value) => typeof value === 'string' && value.trim()) ?? '',
        )
        if (!gloss) return
        if (senseIsBlockedPlural(sense)) return
        if (BAD_GLOSS_PATTERNS.some((pattern) => pattern.test(gloss))) return

        const labels = collectSenseLabels(sense)
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
          score -= 40
        }

        if (
          labels.has('vulgar') ||
          labels.has('slang') ||
          labels.has('derogatory') ||
          labels.has('colloquial')
        ) {
          score -= 30
        }

        if (
          labels.has('french french') ||
          labels.has('canada') ||
          labels.has('quebec') ||
          labels.has('louisiana french')
        ) {
          score -= 3
        }

        if (gloss.length <= 28) score += 4
        if ((gloss.match(/,/g) ?? []).length > 2) score -= 6
        if ((gloss.match(/;/g) ?? []).length > 1) score -= 6
        if (gloss.includes('(')) score -= 5
        if (gloss.length > 90) score -= 12

        const candidate = {
          translation: gloss,
          score,
          source: 'kaikki',
        }

        if (translationHasBlockedSense(entry, candidate.translation)) return
        if (score < 0) return
        if (!best || candidate.score > best.score) best = candidate
      })
    }

    memo.set(memoKey, best)
    return best
  }

  return resolveWord
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

console.log('=== LearnNounGender — French word rebuild ===\n')

const overrides = loadOverrides()

await ensureCacheFile(LEXIQUE_CACHE, LEXIQUE_URL)
await ensureCacheFile(KAIKKI_CACHE, KAIKKI_URL)

console.log('Indexing Kaikki noun entries...')
const index = await buildKaikkiIndex(KAIKKI_CACHE)
console.log(`  Indexed ${index.size} French noun headwords`)

console.log('Loading Lexique candidates...')
const candidates = buildLexiqueCandidates(index, overrides)
console.log(`  Loaded ${candidates.length} noun candidates from Lexique`)

const resolveWord = createResolver(index, overrides)

const accepted = []
const rejected = []
const seen = new Set()

for (const candidate of candidates) {
  if (seen.has(candidate.word)) {
    rejected.push({ word: candidate.word, reason: 'duplicate-candidate' })
    continue
  }

  const resolved = resolveWord(candidate.word, candidate.gender) ?? resolveWord(candidate.originalWord, candidate.gender)
  if (!resolved) {
    rejected.push({ word: candidate.word, reason: 'no-acceptable-kaikki-sense' })
    continue
  }

  seen.add(candidate.word)
  accepted.push({
    word: candidate.word,
    translation: resolved.translation,
    gender: candidate.gender,
    rank: accepted.length + 1,
  })

  if (accepted.length === RAW_TARGET_COUNT) break
}

if (accepted.length < RAW_TARGET_COUNT) {
  throw new Error(`Only produced ${accepted.length} raw French words; expected at least ${RAW_TARGET_COUNT}`)
}

const finalized = finalizeWords('fr', accepted, { targetCount: TARGET_COUNT })

writeJson(FR_OUT_PATH, finalized)
writeJson(REPORT_PATH, {
  generatedAt: new Date().toISOString(),
  source: {
    lexique: LEXIQUE_URL,
    kaikki: KAIKKI_URL,
  },
  rawAcceptedCount: accepted.length,
  acceptedCount: finalized.length,
  scannedCandidates: candidates.length,
  acceptedSample: finalized.slice(0, 200),
  rejectedSample: rejected.slice(0, 300),
})

console.log(`\nWrote ${finalized.length} French words to ${FR_OUT_PATH}`)
console.log(`Report written to ${REPORT_PATH}`)
