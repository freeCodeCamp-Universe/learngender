import type { TheorySlide } from './theory'

export const ES_MODULE_1: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The article is everything',
    body: `In Spanish, every noun is either **masculine** (el / un) or **feminine** (la / una).\n\n> ✓ **el** libro (the book) — masculine\n> ✓ **la** casa (the house) — feminine\n\nAlways learn the article with the noun. Not "libro" — **el libro**.`,
  },
  {
    type: 'table',
    title: 'Endings that almost always work',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-ción / -sión', 'feminine', 'la nación, la misión'] },
        { cells: ['-dad / -tad', 'feminine', 'la ciudad, la libertad'] },
        { cells: ['-tud', 'feminine', 'la actitud, la virtud'] },
        { cells: ['-eza', 'feminine', 'la belleza, la riqueza'] },
        { cells: ['-ismo', 'masculine', 'el turismo, el capitalismo'] },
        { cells: ['-amiento / -imiento', 'masculine', 'el departamento, el conocimiento'] },
      ],
      note: '**Confidence: very high.**',
    },
  },
  {
    type: 'table',
    title: 'Endings that usually work',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-o', 'masculine', 'el libro, el carro'] },
        { cells: ['-a', 'feminine', 'la mesa, la puerta'] },
        { cells: ['-or', 'masculine', 'el profesor, el valor'] },
        { cells: ['-umbre', 'feminine', 'la costumbre, la lumbre'] },
        { cells: ['-ie', 'feminine', 'la serie, la superficie'] },
      ],
      note: '**Confidence: medium.** Common exceptions follow.',
    },
  },
  {
    type: 'exceptions',
    title: 'Exceptions everyone gets wrong',
    body: 'These are the most frequent nouns that **break the rules**. Memorise them.',
    exceptions: [
      { article: 'el', word: 'día', meaning: 'the day', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'el', word: 'problema', meaning: 'the problem', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'el', word: 'mapa', meaning: 'the map', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'el', word: 'tema', meaning: 'the theme', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'el', word: 'clima', meaning: 'the climate', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'la', word: 'mano', meaning: 'the hand', tag: 'ends in -o!', gender: 'feminine' },
      { article: 'la', word: 'radio', meaning: 'the radio', tag: 'ends in -o!', gender: 'feminine' },
    ],
  },
  {
    type: 'pattern',
    title: 'The Greek -ma pattern',
    body: `Words ending in **-ma** of Greek origin are **masculine** in Spanish, despite the -a ending.\n\n> → **el** problema, **el** tema, **el** sistema\n> → **el** clima, **el** programa, **el** idioma\n> → **el** drama, **el** poema, **el** síntoma\n\nSame pattern as Portuguese — these are typically abstract or technical concepts.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'la / una', 'el / un'] },
        { cells: ['Strong → fem', '-ción, -dad, -tud, -eza', '—'] },
        { cells: ['Strong → masc', '—', '-ismo, -amiento'] },
        { cells: ['Typical', '-a (mostly)', '-o (mostly)'] },
        { cells: ['Greek -ma', '—', 'el problema, el tema…'] },
        { cells: ['Watch out', 'el día, el mapa!', 'la mano (ends in -o!)'] },
      ],
    },
  },
]
