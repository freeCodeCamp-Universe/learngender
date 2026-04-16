import type { Language } from '../types'

export interface TableRow {
  cells: string[]
}

export interface ExceptionItem {
  article: string
  word: string
  meaning: string
  tag: string
  gender: 'masculine' | 'feminine'
}

export interface TheorySlide {
  title: string
  type: 'intro' | 'table' | 'pattern' | 'exceptions' | 'cheatsheet'
  body?: string
  table?: {
    headers: string[]
    rows: TableRow[]
    note?: string
  }
  exceptions?: ExceptionItem[]
  isReference?: boolean
}

const PT: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The article is everything',
    body: `In Portuguese, every noun is either **masculine** (o / um) or **feminine** (a / uma). The article is your anchor — always learn a word with its article.\n\n> ✓ **o** livro (the book) — masculine\n> ✓ **a** casa (the house) — feminine\n\n**Rule #1:** When you learn a new noun, learn the article too. Not "livro" — **o livro**.`,
  },
  {
    type: 'table',
    title: 'Endings that almost always work',
    body: 'These endings are **highly reliable**. When you see them, trust them.',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-ção / -são', 'feminine', 'a nação, a televisão'] },
        { cells: ['-dade / -tude', 'feminine', 'a cidade, a atitude'] },
        { cells: ['-eza', 'feminine', 'a beleza, a riqueza'] },
        { cells: ['-ismo', 'masculine', 'o turismo, o realismo'] },
        { cells: ['-amento / -imento', 'masculine', 'o departamento, o conhecimento'] },
      ],
      note: '**Confidence: very high.** Exceptions exist but are rare.',
    },
  },
  {
    type: 'table',
    title: 'Endings that usually work',
    body: 'These work **most of the time** — but watch for the exceptions on the next slide.',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-o', 'masculine', 'o livro, o carro'] },
        { cells: ['-a', 'feminine', 'a mesa, a porta'] },
        { cells: ['-or', 'masculine', 'o professor, o valor'] },
        { cells: ['-gem', 'feminine', 'a viagem, a imagem'] },
      ],
      note: '**Confidence: medium.** Learn the common exceptions by heart.',
    },
  },
  {
    type: 'exceptions',
    title: 'Exceptions everyone gets wrong',
    body: 'These are the most frequent nouns that **break the rules**. Memorise them.',
    exceptions: [
      { article: 'o', word: 'dia', meaning: 'the day', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'o', word: 'problema', meaning: 'the problem', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'o', word: 'mapa', meaning: 'the map', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'o', word: 'tema', meaning: 'the theme', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'o', word: 'sistema', meaning: 'the system', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'a', word: 'mão', meaning: 'the hand', tag: 'ends in -ão!', gender: 'feminine' },
      { article: 'a', word: 'foto', meaning: 'the photo', tag: 'ends in -o!', gender: 'feminine' },
    ],
  },
  {
    type: 'pattern',
    title: 'The Greek -ma pattern',
    body: `Words ending in **-ma** that came from Greek are **masculine** — even though -a usually signals feminine.\n\n> → **o** problema, **o** tema, **o** sistema\n> → **o** clima, **o** programa, **o** idioma\n> → **o** drama, **o** poema, **o** diploma\n\n**How to spot them:** These tend to be abstract or intellectual concepts. If a word ending in -ma feels "academic", it's probably masculine.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'a / uma', 'o / um'] },
        { cells: ['Strong → fem', '-ção, -dade, -eza, -gem', '—'] },
        { cells: ['Strong → masc', '—', '-ismo, -mento'] },
        { cells: ['Typical', '-a (mostly)', '-o (mostly)'] },
        { cells: ['Greek -ma', '—', 'o problema, o tema…'] },
        { cells: ['Watch out', 'o dia, o mapa!', 'a mão, a foto!'] },
      ],
    },
  },
]

const ES: TheorySlide[] = [
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

const FR: TheorySlide[] = [
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

const IT: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The article is everything',
    body: `In Italian, every noun is either **masculine** (il / un) or **feminine** (la / una).\n\n> ✓ **il** libro (the book) — masculine\n> ✓ **la** casa (the house) — feminine\n\nItalian is the most regular of the four languages. The -o / -a pattern is very reliable — but the exceptions are famous and frequent.`,
  },
  {
    type: 'table',
    title: 'Endings that almost always work',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-zione / -sione', 'feminine', 'la nazione, la missione'] },
        { cells: ['-tà / -tù', 'feminine', 'la città, la libertà'] },
        { cells: ['-tura', 'feminine', 'la natura, la lettura'] },
        { cells: ['-ismo', 'masculine', 'il turismo, il capitalismo'] },
        { cells: ['-amento / -imento', 'masculine', 'il dipartimento, il sentimento'] },
        { cells: ['-ore', 'masculine', 'il professore, il valore'] },
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
        { cells: ['-o', 'masculine', 'il libro, il ragazzo'] },
        { cells: ['-a', 'feminine', 'la ragazza, la porta'] },
        { cells: ['-e', '⚠ either', 'il padre (m), la madre (f), il nome (m)'] },
      ],
      note: '**The -e ending is unpredictable** — always verify with the article.',
    },
  },
  {
    type: 'exceptions',
    title: 'Exceptions everyone gets wrong',
    body: 'These famous nouns **break the obvious rules**. Memorise them.',
    exceptions: [
      { article: 'il', word: 'problema', meaning: 'the problem', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'il', word: 'tema', meaning: 'the theme', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'il', word: 'sistema', meaning: 'the system', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'il', word: 'programma', meaning: 'the programme', tag: 'ends in -a!', gender: 'masculine' },
      { article: 'la', word: 'mano', meaning: 'the hand', tag: 'ends in -o!', gender: 'feminine' },
      { article: 'la', word: 'radio', meaning: 'the radio', tag: 'ends in -o!', gender: 'feminine' },
      { article: 'la', word: 'foto', meaning: 'the photo', tag: 'ends in -o!', gender: 'feminine' },
    ],
  },
  {
    type: 'pattern',
    title: 'The Greek -ma pattern',
    body: `Words ending in **-ma** of Greek origin are **masculine** in Italian — the most important exception to the -a = feminine rule.\n\n> → **il** problema, **il** tema, **il** sistema\n> → **il** clima, **il** programma, **il** dilemma\n> → **il** dramma, **il** poema, **il** diploma\n\n**Memory trick:** These words often end in double -mma in Italian (programma, dramma). They tend to be abstract or intellectual concepts.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'la / una', 'il / un'] },
        { cells: ['Strong → fem', '-zione, -tà, -tù, -tura', '—'] },
        { cells: ['Strong → masc', '—', '-ismo, -amento, -ore'] },
        { cells: ['Typical', '-a (mostly)', '-o (mostly)'] },
        { cells: ['⚠ Unpredictable', '-e endings — always check', '—'] },
        { cells: ['Watch out', 'il programma, il dramma!', 'la mano, la foto!'] },
      ],
    },
  },
]

export const THEORY_SLIDES: Record<Language, TheorySlide[]> = { pt: PT, es: ES, fr: FR, it: IT }
