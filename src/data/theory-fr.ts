import type { TheorySlide } from './theory'

export const FR_MODULE_1: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The article is everything',
    body: `In French, every noun is either **masculine** (le / un) or **feminine** (la / une).\n\n> ✓ **le** livre (the book) — masculine\n> ✓ **la** maison (the house) — feminine\n\n**Important:** French gender is less predictable from spelling than Spanish or Portuguese. The article is even more critical here — always learn it with the noun.`,
  },
  {
    type: 'table',
    title: 'Endings that almost always work',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-tion / -sion', 'feminine', 'la nation, la passion'] },
        { cells: ['-té / -tié', 'feminine', 'la liberté, la moitié'] },
        { cells: ['-ure', 'feminine', 'la nature, la voiture'] },
        { cells: ['-eur (abstract)', 'feminine', 'la chaleur, la peur'] },
        { cells: ['-age', 'masculine', 'le voyage, le fromage'] },
        { cells: ['-ment', 'masculine', 'le gouvernement'] },
        { cells: ['-eau', 'masculine', 'le bateau, le gâteau'] },
      ],
      note: '**Confidence: high** for these specific endings.',
    },
  },
  {
    type: 'table',
    title: 'Endings that usually work',
    body: '**Confidence: medium.** French has more irregular cases than Spanish/Portuguese.',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-e (alone)', 'often feminine', 'la table, la rue — but le livre'] },
        { cells: ['-eur (person)', 'masculine', 'le professeur, le directeur'] },
        { cells: ['-isme', 'masculine', 'le tourisme, le capitalisme'] },
        { cells: ['-oire', 'masculine', 'le territoire — but la mémoire'] },
      ],
    },
  },
  {
    type: 'exceptions',
    title: 'Exceptions everyone gets wrong',
    body: 'French gender is often historical — many exceptions must simply be memorised.',
    exceptions: [
      { article: 'le', word: 'silence', meaning: 'silence', tag: 'ends in -e!', gender: 'masculine' },
      { article: 'le', word: 'musée', meaning: 'museum', tag: 'ends in -ée!', gender: 'masculine' },
      { article: 'le', word: 'lycée', meaning: 'high school', tag: 'ends in -ée!', gender: 'masculine' },
      { article: 'le', word: 'problème', meaning: 'problem', tag: 'Greek origin', gender: 'masculine' },
      { article: 'la', word: 'main', meaning: 'hand', tag: 'ends in consonant!', gender: 'feminine' },
      { article: 'la', word: 'forêt', meaning: 'forest', tag: 'ends in consonant!', gender: 'feminine' },
      { article: 'la', word: 'mer', meaning: 'the sea', tag: 'ends in consonant!', gender: 'feminine' },
    ],
  },
  {
    type: 'pattern',
    title: 'The -e ending trap',
    body: `In French, **-e does not mean feminine**. Many common masculine nouns end in -e:\n\n> → **le** livre, **le** monde, **le** texte, **le** groupe\n> → **le** type, **le** risque, **le** centre, **le** service\n> → **le** problème, **le** genre, **le** nombre\n\n**Rule of thumb:** If the noun ends in -e AND has a strong feminine ending (-tion, -té, -ure), it's likely feminine. Otherwise, don't assume.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'la / une', 'le / un'] },
        { cells: ['Strong → fem', '-tion, -té, -ure, -eur (abstract)', '—'] },
        { cells: ['Strong → masc', '—', '-age, -ment, -eau, -isme'] },
        { cells: ['Unreliable', '-e alone (could be either!)', '—'] },
        { cells: ['Greek -ème', '—', 'le problème, le système…'] },
        { cells: ['Strategy', 'Always learn with the article', ''] },
      ],
    },
  },
]
