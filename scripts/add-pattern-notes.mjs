/**
 * Add patternNote to all word entries — no API, no cost.
 *
 * Applies hand-authored gender pattern rules for PT, ES, FR, IT.
 * Falls back to "No simple rule — must be memorised" when no rule matches.
 *
 * Usage:
 *   node scripts/add-pattern-notes.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../src/data')

const FALLBACK = 'No simple rule — must be memorised'

// ─── RULE ENGINE ─────────────────────────────────────────────────────────────
// Each rule: { match: (word, gender) => bool, note: string | (word) => string }
// Rules are checked in order; first match wins.

const RULES = {

  // ══════════════════════════════════════════════════════════════════════════
  pt: [
    // Feminine suffixes
    { match: (w, g) => g === 'feminine' && w.endsWith('ção'),    note: 'Ends in -ção, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('são'),    note: 'Ends in -são, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('dade'),   note: 'Ends in -dade, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('tude'),   note: 'Ends in -tude, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('agem'),   note: 'Ends in -agem, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('gem'),    note: 'Ends in -gem, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('eza'),    note: 'Ends in -eza, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ura'),    note: 'Ends in -ura, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ura') && w.length > 4, note: 'Ends in -ura, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ia'),     note: 'Ends in -ia, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ância'),  note: 'Ends in -ância, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ência'),  note: 'Ends in -ência, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ice'),    note: 'Ends in -ice, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ite'),    note: 'Medical ending -ite, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ise'),    note: 'Ends in -ise, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ose'),    note: 'Medical/scientific -ose, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('a'),      note: 'Ends in -a, typically feminine' },
    // Masculine suffixes
    { match: (w, g) => g === 'masculine' && w.endsWith('mento'), note: 'Ends in -mento, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('amento'),note: 'Ends in -amento, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('imento'),note: 'Ends in -imento, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ismo'),  note: 'Ends in -ismo, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ista') && false, note: '' }, // ista is m/f
    { match: (w, g) => g === 'masculine' && w.endsWith('or'),    note: 'Ends in -or, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ão'),    note: 'Ends in -ão, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ema'),   note: 'Greek-origin -ema words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('oma'),   note: 'Greek-origin -oma words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ama'),   note: 'Greek-origin -ama words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('eta'),   note: 'Ends in -eta, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ista'),  note: 'Ends in -ista; gender matches person' },
    { match: (w, g) => g === 'masculine' && w.endsWith('o'),     note: 'Ends in -o, typically masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('e'),     note: 'Ends in -e; masculine when no other rule applies' },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  es: [
    // Feminine suffixes
    { match: (w, g) => g === 'feminine' && w.endsWith('ción'),   note: 'Ends in -ción, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('sión'),   note: 'Ends in -sión, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ión'),    note: 'Ends in -ión, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('dad'),    note: 'Ends in -dad, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('tad'),    note: 'Ends in -tad, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('tud'),    note: 'Ends in -tud, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('umbre'),  note: 'Ends in -umbre, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('eza'),    note: 'Ends in -eza, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ura'),    note: 'Ends in -ura, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('anza'),   note: 'Ends in -anza, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('encia'),  note: 'Ends in -encia, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ancia'),  note: 'Ends in -ancia, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('itis'),   note: 'Medical ending -itis, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('sis'),    note: 'Greek -sis words, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ción'),   note: 'Ends in -ción, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('a'),      note: 'Ends in -a, typically feminine' },
    // Masculine suffixes
    { match: (w, g) => g === 'masculine' && w.endsWith('miento'),note: 'Ends in -miento, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ismo'),  note: 'Ends in -ismo, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('or'),    note: 'Ends in -or, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ema'),   note: 'Greek-origin -ema words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('oma'),   note: 'Greek-origin -oma words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ama'),   note: 'Greek-origin -ama words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ón'),    note: 'Ends in -ón, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('o'),     note: 'Ends in -o, typically masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('e'),     note: 'Ends in -e; masculine when no other rule applies' },
    { match: (w, g) => g === 'masculine' && /[^aeiouáéíóú]$/i.test(w), note: 'Ends in consonant, usually masculine' },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  fr: [
    // Feminine suffixes
    { match: (w, g) => g === 'feminine' && w.endsWith('tion'),   note: 'Ends in -tion, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('sion'),   note: 'Ends in -sion, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ation'),  note: 'Ends in -ation, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('tion'),   note: 'Ends in -tion, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ité'),    note: 'Ends in -ité, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('té'),     note: 'Ends in -té, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('eur') && ['chaleur','fleur','sueur','peur','douleur','couleur','erreur','valeur','odeur','ardeur','vapeur','humeur','faveur','horreur','lenteur','largeur','hauteur','longueur','profondeur','fraîcheur','maigreur','épaisseur','douceur','noirceur','blancheur','tendresse'].includes(w), note: 'Abstract quality noun ending in -eur, feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('trice'),  note: 'Feminine agent ending -trice' },
    { match: (w, g) => g === 'feminine' && w.endsWith('euse'),   note: 'Feminine agent ending -euse' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ance'),   note: 'Ends in -ance, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ence'),   note: 'Ends in -ence, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ure'),    note: 'Ends in -ure, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ude'),    note: 'Ends in -ude, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ade'),    note: 'Ends in -ade, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ise'),    note: 'Ends in -ise, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ite'),    note: 'Medical ending -ite, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('esse'),   note: 'Ends in -esse, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ie'),     note: 'Ends in -ie, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('oire') && ['histoire','mémoire','gloire','ivoire','victoire','trajectoire','baignoire','armoire','nageoire'].includes(w), note: 'Feminine exception ending in -oire' },
    { match: (w, g) => g === 'feminine' && w.endsWith('e'),      note: 'Ends in -e; often feminine in French' },
    // Masculine suffixes
    { match: (w, g) => g === 'masculine' && w.endsWith('ment'),  note: 'Ends in -ment, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('isme'),  note: 'Ends in -isme, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('eur'),   note: 'Agent/doer ending -eur, masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('oir'),   note: 'Ends in -oir, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('oire'),  note: 'Ends in -oire, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('eau'),   note: 'Ends in -eau, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('age'),   note: 'Ends in -age, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ème'),   note: 'Greek-origin -ème words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ome'),   note: 'Greek-origin -ome words are masculine' },
    { match: (w, g) => g === 'masculine' && /[^e]$/.test(w),    note: 'Does not end in -e; usually masculine' },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  it: [
    // Feminine suffixes
    { match: (w, g) => g === 'feminine' && w.endsWith('zione'),  note: 'Ends in -zione, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('sione'),  note: 'Ends in -sione, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ione'),   note: 'Ends in -ione, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('tà'),     note: 'Ends in -tà, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('tù'),     note: 'Ends in -tù, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('tura'),   note: 'Ends in -tura, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ura'),    note: 'Ends in -ura, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('anza'),   note: 'Ends in -anza, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('enza'),   note: 'Ends in -enza, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ezza'),   note: 'Ends in -ezza, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('itudine'),note: 'Ends in -itudine, always feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('udine'),  note: 'Ends in -udine, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ice'),    note: 'Feminine agent ending -ice' },
    { match: (w, g) => g === 'feminine' && w.endsWith('trice'),  note: 'Feminine agent ending -trice' },
    { match: (w, g) => g === 'feminine' && w.endsWith('ite'),    note: 'Medical ending -ite, usually feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('osi'),    note: 'Medical -osi words, feminine' },
    { match: (w, g) => g === 'feminine' && w.endsWith('a'),      note: 'Ends in -a, typically feminine' },
    // Masculine suffixes
    { match: (w, g) => g === 'masculine' && w.endsWith('mento'), note: 'Ends in -mento, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ismo'),  note: 'Ends in -ismo, always masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ore'),   note: 'Ends in -ore, usually masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ema'),   note: 'Greek-origin -ema words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('amma'),  note: 'Greek-origin -amma words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('oma'),   note: 'Greek-origin -oma words are masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('ione') && false, note: '' }, // never fires — ione is fem
    { match: (w, g) => g === 'masculine' && w.endsWith('tore'),  note: 'Agent ending -tore, masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('iere'),  note: 'Agent ending -iere, masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('o'),     note: 'Ends in -o, typically masculine' },
    { match: (w, g) => g === 'masculine' && w.endsWith('e'),     note: 'Ends in -e; masculine when no other rule applies' },
    { match: (w, g) => g === 'masculine' && /[^aeioàèìòùáéíóú]$/i.test(w), note: 'Ends in consonant; usually masculine in Italian' },
  ],
}

function getNote(lang, word, gender) {
  const rules = RULES[lang] ?? []
  const w = word.toLowerCase()
  for (const rule of rules) {
    if (rule.match(w, gender)) {
      return typeof rule.note === 'function' ? rule.note(w) : rule.note
    }
  }
  return FALLBACK
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

let totalWords = 0
let totalMatched = 0

for (const lang of ['pt', 'es', 'fr', 'it']) {
  const filePath = path.join(DATA_DIR, `words_${lang}.json`)
  const words = JSON.parse(readFileSync(filePath, 'utf8'))

  let matched = 0
  const updated = words.map((w) => {
    const note = getNote(lang, w.word, w.gender)
    if (note !== FALLBACK) matched++
    return { ...w, patternNote: note }
  })

  writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8')

  const pct = Math.round((matched / words.length) * 100)
  console.log(`[${lang}] ${matched}/${words.length} matched (${pct}% coverage)`)

  totalWords += words.length
  totalMatched += matched
}

console.log(`\nTotal: ${totalMatched}/${totalWords} words have a pattern note (${Math.round(totalMatched/totalWords*100)}%)`)
console.log('Remaining fallbacks should be reviewed and improved.')
