const TARGET_BUFFER = 300

const SPANISH_FEMININE_EL = new Set([
  'agua',
  'alma',
  'área',
  'arma',
  'ala',
  'hada',
  'hambre',
  'hacha',
  'arca',
  'aula',
  'águila',
  'alba',
  'alga',
  'arpa',
  'asa',
  'ave',
  'haba',
  'habla',
  'haya',
])

const FRENCH_H_ASPIRE = new Set([
  'hall',
  'hamburger',
  'hamster',
  'haricot',
  'hasard',
  'haut',
  'hauteur',
  'héros',
  'hibou',
  'hockey',
  'homard',
  'honte',
  'haie',
  'halo',
  'hameau',
  'hanche',
  'hangar',
  'hareng',
  'harnais',
  'harpe',
  'hausse',
  'havre',
  'horde',
  'hublot',
  'hurlement',
  'hutte',
  'hyène',
  'harem',
])

const CURATION = {
  pt: {
    removeWords: new Set(),
    replacements: {
      capital: [
        { gender: 'feminine', translation: 'capital city', hint: 'capital city' },
        { gender: 'masculine', translation: 'capital, money', hint: 'money/finance' },
      ],
      cara: [
        { gender: 'masculine', translation: 'man, fellow, guy', hint: 'guy/fellow' },
        { gender: 'feminine', translation: 'face', hint: 'face' },
      ],
      moral: [
        { gender: 'masculine', translation: 'morale', hint: 'morale' },
        { gender: 'feminine', translation: 'moral, ethics', hint: 'moral/ethics' },
      ],
      grama: [
        { gender: 'feminine', translation: 'Bermuda grass', hint: 'bermuda grass' },
        { gender: 'masculine', translation: 'gram', hint: 'unit of weight' },
      ],
      cura: [
        { gender: 'feminine', translation: 'cure', hint: 'cure' },
        { gender: 'masculine', translation: 'priest', hint: 'priest' },
      ],
      guarda: [
        { gender: 'feminine', translation: 'guard', hint: 'female guard' },
        { gender: 'masculine', translation: 'guard', hint: 'male guard' },
      ],
      rádio: [
        { gender: 'masculine', translation: 'radio, device', hint: 'radio device' },
        { gender: 'feminine', translation: 'radio station', hint: 'radio station' },
      ],
    },
  },
  es: {
    removeWords: new Set(),
    replacements: {
      capital: [
        { gender: 'masculine', translation: 'capital', hint: 'capital/money' },
        { gender: 'feminine', translation: 'capital city', hint: 'capital city' },
      ],
      cura: [
        { gender: 'feminine', translation: 'cure', hint: 'cure' },
        { gender: 'masculine', translation: 'priest', hint: 'priest' },
      ],
      orden: [
        { gender: 'feminine', translation: 'order, command', hint: 'command/order' },
        { gender: 'masculine', translation: 'order, arrangement', hint: 'arrangement/order' },
      ],
      radio: [
        { gender: 'feminine', translation: 'radio, broadcasting', hint: 'signal/broadcasting' },
        { gender: 'masculine', translation: 'radio, device', hint: 'radio device' },
      ],
      frente: [
        { gender: 'feminine', translation: 'forehead', hint: 'forehead' },
        { gender: 'masculine', translation: 'front', hint: 'front' },
      ],
      guarda: [
        { gender: 'feminine', translation: 'guard', hint: 'female guard' },
        { gender: 'masculine', translation: 'guard', hint: 'male guard' },
      ],
    },
  },
  fr: {
    removeWords: new Set(),
    replacements: {},
  },
  it: {
    removeWords: new Set(['presso', 'grazie', 'forse', 'niente', 'comporre']),
    replacements: {
      fine: [
        { gender: 'feminine', translation: 'end', hint: 'end' },
        { gender: 'masculine', translation: 'purpose, aim', hint: 'purpose' },
      ],
    },
  },
}

function startsWithVowel(word) {
  return /^[aeiouàáâãäåæèéêëìíîïòóôõöøœùúûüÿ]/i.test(word)
}

function italianStartsWithLo(word) {
  const w = word.toLowerCase()
  return (
    (w.startsWith('s') && w.length > 1 && !'aeiouàáâãäåæèéêëìíîïòóôõöøœùúûüÿ'.includes(w[1])) ||
    w.startsWith('z') ||
    w.startsWith('gn') ||
    w.startsWith('ps') ||
    w.startsWith('pn') ||
    w.startsWith('x') ||
    w.startsWith('y') ||
    w.startsWith('j')
  )
}

function frenchElides(word) {
  const w = word.toLowerCase()
  return startsWithVowel(w) || (w.startsWith('h') && !FRENCH_H_ASPIRE.has(w))
}

export function deriveArticle(word, gender, language) {
  const w = word.toLowerCase()
  switch (language) {
    case 'pt':
      return gender === 'masculine' ? 'o' : 'a'
    case 'es':
      if (gender === 'feminine' && SPANISH_FEMININE_EL.has(w)) return 'el'
      return gender === 'masculine' ? 'el' : 'la'
    case 'fr':
      if (frenchElides(w)) return "l'"
      return gender === 'masculine' ? 'le' : 'la'
    case 'it':
      if (gender === 'masculine') {
        if (startsWithVowel(w)) return "l'"
        if (italianStartsWithLo(w)) return 'lo'
        return 'il'
      }
      return startsWithVowel(w) ? "l'" : 'la'
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}

function slug(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function assignIds(words) {
  const counts = new Map()
  for (const entry of words) counts.set(entry.word, (counts.get(entry.word) ?? 0) + 1)

  const seenIds = new Map()
  return words.map((entry) => {
    const total = counts.get(entry.word) ?? 1
    const parts = total === 1 ? [entry.word] : [entry.word, entry.gender]
    if (total > 1 && entry.hint) parts.push(slug(entry.hint))

    const baseId = parts.join('__')
    const collisionCount = (seenIds.get(baseId) ?? 0) + 1
    seenIds.set(baseId, collisionCount)

    return {
      ...entry,
      id: collisionCount === 1 ? baseId : `${baseId}__${collisionCount}`,
    }
  })
}

function materializeReplacement(anchor, replacement) {
  return {
    word: anchor.word,
    translation: replacement.translation,
    gender: replacement.gender,
    hint: replacement.hint,
  }
}

export function finalizeWords(language, rawWords, { targetCount = 2000 } = {}) {
  const curation = CURATION[language]
  if (!curation) throw new Error(`No curation defined for ${language}`)

  const finalized = []
  const handledReplacementWords = new Set()
  let retainedBaseCount = 0

  for (const entry of rawWords) {
    if (retainedBaseCount >= targetCount) break

    if (curation.replacements[entry.word]) {
      if (handledReplacementWords.has(entry.word)) continue
      handledReplacementWords.add(entry.word)

      const replacements = curation.replacements[entry.word].map((replacement) =>
        materializeReplacement(entry, replacement),
      )

      finalized.push(...replacements)
      retainedBaseCount += 1
      continue
    }

    if (curation.removeWords.has(entry.word)) continue

    const next = {
      word: entry.word,
      translation: entry.translation,
      gender: entry.gender,
    }
    if (entry.hint) next.hint = entry.hint
    finalized.push(next)
    retainedBaseCount += 1
  }

  if (retainedBaseCount < targetCount) {
    throw new Error(
      `Only retained ${retainedBaseCount} base entries for ${language}; increase raw buffer or review curation.`,
    )
  }

  const withArticles = finalized.map((entry) => ({
    ...entry,
    article: deriveArticle(entry.word, entry.gender, language),
  }))

  const withRanks = withArticles.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }))

  return assignIds(withRanks)
}

export function getTargetBuffer() {
  return TARGET_BUFFER
}
