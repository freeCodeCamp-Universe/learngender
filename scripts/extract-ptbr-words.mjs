/**
 * Rebuild the Portuguese list specifically for pt-BR.
 *
 * Source of truth for ranking:
 *   Linguateca Corpus Brasileiro noun lemmas
 *
 * Source of truth for gender + seed translations:
 *   Kaikki English Wiktionary Portuguese dump
 *
 * Output shape matches the app contract in src/types.ts.
 *
 * Usage:
 *   node scripts/extract-ptbr-words.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { createInterface } from 'readline'
import { createGunzip } from 'zlib'
import { createReadStream } from 'fs'
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

const PT_OUT_PATH = path.join(DATA_DIR, 'words_pt.json')
const REPORT_PATH = path.join(CACHE_DIR, 'ptbr_rebuild_report.json')
const OVERRIDES_PATH = path.join(CONFIG_DIR, 'ptbr-manual-overrides.json')

const LINGUATECA_URL = 'https://www.linguateca.pt/acesso/tokens/lista.lemas.cbras.N.txt'
const LINGUATECA_CACHE = path.join(CACHE_DIR, 'ptbr_linguateca_lemas_N.txt')
const KAIKKI_URL = 'https://kaikki.org/dictionary/Portuguese/kaikki.org-dictionary-Portuguese.jsonl.gz'
const KAIKKI_CACHE = path.join(CACHE_DIR, 'pt_kaikki.jsonl.gz')

const TARGET_COUNT = 2000
const RAW_TARGET_COUNT = TARGET_COUNT + getTargetBuffer()
const MAX_SCAN_CANDIDATES = 25000

const WORD_RE = /^[a-záàâãéêíóôõúüç]+(?:-[a-záàâãéêíóôõúüç]+)*$/i
const STOP_WORDS = new Set([
  '%',
  'p',
  'p.',
  'r$',
  'sr',
  'sra',
  'dr',
  'dra',
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'vi',
  'vii',
  'viii',
  'ix',
  'x',
  'nº',
  'n°',
  'no',
  'etc',
])

const BAD_GLOSS_PATTERNS = [
  /^(alternative|obsolete|archaic|plural|singular|misspelling|abbreviation|initialism|acronym) of\b/i,
  /^inflection of\b/i,
  /^female equivalent of\b/i,
  /^male equivalent of\b/i,
  /^ellipsis of\b/i,
  /^only used in\b/i,
  /^pre-reform spelling\b/i,
  /^european portuguese standard (?:form|spelling) of\b/i,
  /^alternative letter-case form of\b/i,
]

const BRAZIL_ALT_OF_PATTERN =
  /^brazilian portuguese (?:standard )?(?:form|spelling) of ([^,;()]+)/i

const EQUIVALENT_TAIL_PATTERN = /,\s*(?:female|male) equivalent of .+$/i
const HARD_REJECT_LABELS = new Set(['derogatory', 'offensive', 'pejorative', 'slur', 'vulgar'])
const OFFENSIVE_TRANSLATION_PATTERNS = [
  /\b(?:asshole|bastard|bitch|crazy person|drunkard|fat man|fat woman|idiot|madman|madwoman|moron|slut|twit|whore)\b/i,
]

function loadOverrides() {
  return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'))
}

function requestBuffer(url, { allowInvalidCert = false, redirects = 0 } = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const req = client.get(
      url,
      url.startsWith('https:')
        ? {
            rejectUnauthorized: !allowInvalidCert,
            headers: { 'user-agent': 'LearnNounGender data rebuild' },
          }
        : { headers: { 'user-agent': 'LearnNounGender data rebuild' } },
      (res) => {
        const status = res.statusCode ?? 0

        if (status >= 300 && status < 400 && res.headers.location) {
          if (redirects >= 5) {
            reject(new Error(`Too many redirects while fetching ${url}`))
            return
          }
          const nextUrl = new URL(res.headers.location, url).toString()
          resolve(requestBuffer(nextUrl, { allowInvalidCert, redirects: redirects + 1 }))
          return
        }

        if (status < 200 || status >= 300) {
          reject(new Error(`HTTP ${status} for ${url}`))
          return
        }

        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      },
    )

    req.on('error', reject)
  })
}

async function ensureCacheFile(cachePath, url, options = {}) {
  if (existsSync(cachePath)) return cachePath

  console.log(`Downloading ${url} ...`)
  const buffer = await requestBuffer(url, options)
  writeFileSync(cachePath, buffer)
  return cachePath
}

function parseLinguatecaCandidates(buffer, rejectWords) {
  const text = buffer.toString('latin1')
  const candidates = []
  const seen = new Set()

  for (const line of text.split('\n')) {
    if (!line.includes('\t')) continue

    const [countStr, rawLemma] = line.split('\t', 2)
    if (!/^\d+$/.test(countStr)) continue

    const word = rawLemma.trim().toLowerCase()
    if (seen.has(word)) continue
    if (rejectWords.has(word)) continue
    if (STOP_WORDS.has(word)) continue
    if (word.length < 3 || word.length > 30) continue
    if (!WORD_RE.test(word)) continue

    seen.add(word)
    candidates.push({ word, freq: Number(countStr) })
    if (candidates.length >= MAX_SCAN_CANDIDATES) break
  }

  return candidates
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

function createResolver(index, overrides) {
  const memo = new Map()

  function resolveWord(word, depth = 0) {
    if (memo.has(word)) return memo.get(word)
    if (depth > 2) return null

    const translationOverride = overrides.translationOverrides[word]
    if (translationOverride) {
      const wrappedEntry = (index.get(word) ?? []).find(({ entry }) => entrySupportsNonPluralSense(entry))
      if (wrappedEntry) {
        const resolved = {
          gender: wrappedEntry.gender,
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
      if (!entrySupportsNonPluralSense(entry)) continue

      ;(entry.senses ?? []).forEach((sense, senseIndex) => {
        const gloss = cleanTranslation(
          (sense.glosses ?? []).find((value) => typeof value === 'string' && value.trim()) ?? '',
        )
        if (!gloss) return
        if (senseIsBlockedPlural(sense)) return

        if (BAD_GLOSS_PATTERNS.some((pattern) => pattern.test(gloss))) return

        const altMatch = gloss.match(BRAZIL_ALT_OF_PATTERN)
        if (altMatch) {
          const target = altMatch[1].trim().toLowerCase()
          const base = resolveWord(target, depth + 1)
          if (!base) return

          const candidate = {
            gender,
            translation: base.translation,
            score: 90 - senseIndex * 5,
            source: `brazil-alt-of:${target}`,
          }

          if (!best || candidate.score > best.score) best = candidate
          return
        }

        const labels = collectSenseLabels(sense)
        if (Array.from(HARD_REJECT_LABELS).some((label) => labels.has(label))) return
        if (OFFENSIVE_TRANSLATION_PATTERNS.some((pattern) => pattern.test(gloss))) return
        let score = 100 - senseIndex * 5

        if (
          labels.has('portugal') ||
          labels.has('european portuguese') ||
          labels.has('african portuguese')
        ) {
          score -= 100
        }

        if (
          labels.has('dated') ||
          labels.has('obsolete') ||
          labels.has('archaic') ||
          labels.has('historical') ||
          labels.has('proscribed')
        ) {
          score -= 50
        }

        if (
          labels.has('slang') ||
          labels.has('vulgar') ||
          labels.has('colloquial') ||
          labels.has('euphemistic')
        ) {
          score -= 20
        }

        if (labels.has('brazil') || labels.has('brazilian portuguese')) {
          score += 5
        }

        if (gloss.length <= 28) score += 4
        if ((gloss.match(/,/g) ?? []).length > 2) score -= 6
        if ((gloss.match(/;/g) ?? []).length > 1) score -= 6
        if (gloss.includes('(')) score -= 5
        if (gloss.length > 90) score -= 12

        if (score < 0) return

        const candidate = {
          gender,
          translation: gloss,
          score,
          source:
            labels.has('brazil') || labels.has('brazilian portuguese')
              ? 'kaikki-brazil'
              : 'kaikki-generic',
        }

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

console.log('=== LearnNounGender — pt-BR word rebuild ===\n')

const overrides = loadOverrides()
const rejectWords = new Set(overrides.rejectWords ?? [])

await ensureCacheFile(LINGUATECA_CACHE, LINGUATECA_URL, { allowInvalidCert: true })
await ensureCacheFile(KAIKKI_CACHE, KAIKKI_URL)

console.log('Loading Linguateca candidates...')
const candidates = parseLinguatecaCandidates(readFileSync(LINGUATECA_CACHE), rejectWords)
console.log(`  Loaded ${candidates.length} noun candidates from Corpus Brasileiro`)

console.log('Indexing Kaikki noun entries...')
const index = await buildKaikkiIndex(KAIKKI_CACHE)
console.log(`  Indexed ${index.size} Portuguese noun headwords`)

const resolveWord = createResolver(index, overrides)

const accepted = []
const rejected = []
const seen = new Set()

for (const candidate of candidates) {
  if (seen.has(candidate.word)) {
    rejected.push({ word: candidate.word, reason: 'duplicate-candidate' })
    continue
  }

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

  if (accepted.length === RAW_TARGET_COUNT) break
}

if (accepted.length < RAW_TARGET_COUNT) {
  throw new Error(`Only produced ${accepted.length} raw pt-BR words; expected at least ${RAW_TARGET_COUNT}`)
}

const finalized = finalizeWords('pt', accepted, { targetCount: TARGET_COUNT })

writeJson(PT_OUT_PATH, finalized)
writeJson(REPORT_PATH, {
  generatedAt: new Date().toISOString(),
  source: {
    linguateca: LINGUATECA_URL,
    kaikki: KAIKKI_URL,
  },
  rawAcceptedCount: accepted.length,
  acceptedCount: finalized.length,
  scannedCandidates: candidates.length,
  acceptedSample: finalized.slice(0, 150),
  rejectedSample: rejected.slice(0, 300),
})

console.log(`\nWrote ${finalized.length} pt-BR words to ${PT_OUT_PATH}`)
console.log(`Report written to ${REPORT_PATH}`)
