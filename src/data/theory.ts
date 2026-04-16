import type { Language } from '../types'

export interface TableRow {
  cells: string[]
}

export interface TheorySlide {
  title: string
  type: 'intro' | 'table' | 'pattern' | 'cheatsheet'
  body?: string        // markdown-lite: **bold**, > blockquote
  table?: {
    headers: string[]
    rows: TableRow[]
    note?: string
  }
  note?: string
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
    body: 'These endings are highly reliable. When you see them, trust them.',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-ção / -são', 'feminine', 'a nação, a televisão, a mansão'] },
        { cells: ['-dade / -tude', 'feminine', 'a cidade, a liberdade, a atitude'] },
        { cells: ['-eza', 'feminine', 'a beleza, a riqueza, a tristeza'] },
        { cells: ['-ismo', 'masculine', 'o turismo, o capitalismo, o realismo'] },
        { cells: ['-amento / -imento', 'masculine', 'o departamento, o conhecimento'] },
      ],
      note: '**Confidence: very high.** Exceptions exist but are rare.',
    },
  },
  {
    type: 'table',
    title: 'Endings that usually work',
    body: 'These work most of the time — but watch for the exceptions on the next slide.',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-o', 'masculine', 'o livro, o carro, o tempo'] },
        { cells: ['-a', 'feminine', 'a mesa, a janela, a porta'] },
        { cells: ['-or', 'masculine', 'o professor, o valor, o sabor'] },
        { cells: ['-gem', 'feminine', 'a viagem, a imagem, a linguagem'] },
      ],
      note: '**Confidence: medium.** Learn the common exceptions by heart.',
    },
  },
  {
    type: 'table',
    title: 'Exceptions everyone gets wrong',
    body: 'These are the most frequent nouns that break the rules. Memorise them.',
    table: {
      headers: ['Word', 'Meaning', 'Surprise'],
      rows: [
        { cells: ['**o dia**', 'the day', 'ends in -a but masculine'] },
        { cells: ['**o mapa**', 'the map', 'ends in -a but masculine'] },
        { cells: ['**o problema**', 'the problem', 'ends in -a but masculine'] },
        { cells: ['**o tema**', 'the theme', 'ends in -a but masculine'] },
        { cells: ['**o sistema**', 'the system', 'ends in -a but masculine'] },
        { cells: ['**a mão**', 'the hand', 'ends in -ão but feminine'] },
        { cells: ['**a foto**', 'the photo', 'ends in -o but feminine'] },
        { cells: ['**a moto**', 'the motorbike', 'ends in -o but feminine'] },
      ],
      note: '⚠ **Pattern:** Words ending in -ma of Greek origin are almost always masculine.',
    },
  },
  {
    type: 'pattern',
    title: 'The Greek -ma pattern',
    body: `Many Portuguese words ending in **-ma** came from Greek and are **masculine**, even though -a usually signals feminine.\n\n> **o** problema, **o** tema, **o** sistema, **o** clima, **o** programa, **o** idioma, **o** diploma, **o** drama, **o** poema, **o** sintoma\n\n**How to spot them:** These tend to be abstract, technical, or intellectual concepts. If a word ending in -ma feels "academic", it's probably masculine.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'a / uma', 'o / um'] },
        { cells: ['Strong → fem', '-ção, -são, -dade, -tude, -eza, -gem', '—'] },
        { cells: ['Strong → masc', '—', '-ismo, -amento, -imento'] },
        { cells: ['Typical endings', '-a (mostly)', '-o (mostly)'] },
        { cells: ['Greek -ma words', '—', 'masculine (o problema, o tema…)'] },
        { cells: ['⚠ Watch out', 'o dia, o mapa (end in -a!)', 'a mão, a foto (break rule)'] },
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
        { cells: ['-ción / -sión', 'feminine', 'la nación, la televisión, la misión'] },
        { cells: ['-dad / -tad', 'feminine', 'la ciudad, la libertad, la verdad'] },
        { cells: ['-tud', 'feminine', 'la actitud, la virtud, la juventud'] },
        { cells: ['-eza', 'feminine', 'la belleza, la riqueza, la tristeza'] },
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
        { cells: ['-o', 'masculine', 'el libro, el carro, el tiempo'] },
        { cells: ['-a', 'feminine', 'la mesa, la ventana, la puerta'] },
        { cells: ['-or', 'masculine', 'el profesor, el valor, el color'] },
        { cells: ['-umbre', 'feminine', 'la costumbre, la lumbre'] },
        { cells: ['-ie', 'feminine', 'la serie, la superficie'] },
      ],
      note: '**Confidence: medium.** Common exceptions follow.',
    },
  },
  {
    type: 'table',
    title: 'Exceptions everyone gets wrong',
    table: {
      headers: ['Word', 'Meaning', 'Surprise'],
      rows: [
        { cells: ['**el día**', 'the day', 'ends in -a but masculine'] },
        { cells: ['**el mapa**', 'the map', 'ends in -a but masculine'] },
        { cells: ['**el problema**', 'the problem', 'ends in -a but masculine'] },
        { cells: ['**el tema**', 'the theme', 'ends in -a but masculine'] },
        { cells: ['**el sistema**', 'the system', 'ends in -a but masculine'] },
        { cells: ['**el clima**', 'the climate', 'ends in -a but masculine'] },
        { cells: ['**la mano**', 'the hand', 'ends in -o but feminine'] },
        { cells: ['**la radio**', 'the radio', 'ends in -o but feminine'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'The Greek -ma pattern',
    body: `Words ending in **-ma** of Greek origin are **masculine** in Spanish, despite the -a ending.\n\n> **el** problema, **el** tema, **el** sistema, **el** clima, **el** programa, **el** idioma, **el** diploma, **el** drama, **el** poema, **el** síntoma\n\nSame pattern as Portuguese — these are typically abstract or technical concepts.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'la / una', 'el / un'] },
        { cells: ['Strong → fem', '-ción, -sión, -dad, -tad, -tud, -eza', '—'] },
        { cells: ['Strong → masc', '—', '-ismo, -amiento, -imiento'] },
        { cells: ['Typical endings', '-a (mostly)', '-o (mostly)'] },
        { cells: ['Greek -ma words', '—', 'masculine (el problema, el tema…)'] },
        { cells: ['⚠ Watch out', 'el día, el mapa (end in -a!)', 'la mano (ends in -o!)'] },
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
        { cells: ['-tion / -sion', 'feminine', 'la nation, la télévision, la passion'] },
        { cells: ['-té / -tié', 'feminine', 'la liberté, la beauté, la moitié'] },
        { cells: ['-ure', 'feminine', 'la nature, la culture, la voiture'] },
        { cells: ['-ude', 'feminine', 'la solitude, la certitude'] },
        { cells: ['-eur (abstract)', 'feminine', 'la chaleur, la douleur, la peur'] },
        { cells: ['-age', 'masculine', 'le voyage, le visage, le fromage'] },
        { cells: ['-ment', 'masculine', 'le gouvernement, le moment'] },
        { cells: ['-eau', 'masculine', 'le bateau, le gâteau, le chapeau'] },
      ],
      note: '**Confidence: high** for these specific endings.',
    },
  },
  {
    type: 'table',
    title: 'Endings that usually work',
    table: {
      headers: ['Ending', 'Gender', 'Examples'],
      rows: [
        { cells: ['-e (alone)', 'often feminine', 'la table, la rue — but le livre, le masque'] },
        { cells: ['-eur (person/job)', 'masculine', 'le professeur, le directeur'] },
        { cells: ['-isme', 'masculine', 'le tourisme, le capitalisme'] },
        { cells: ['-oire', 'masculine', 'le territoire — but la mémoire'] },
      ],
      note: '**Confidence: medium.** French has more irregular cases than Spanish/Portuguese.',
    },
  },
  {
    type: 'table',
    title: 'Exceptions everyone gets wrong',
    body: 'French gender is often historical — many exceptions must simply be memorised.',
    table: {
      headers: ['Word', 'Meaning', 'Surprise'],
      rows: [
        { cells: ['**le silence**', 'silence', 'ends in -e but masculine'] },
        { cells: ['**le musée**', 'museum', 'ends in -ée but masculine'] },
        { cells: ['**le lycée**', 'high school', 'ends in -ée but masculine'] },
        { cells: ['**la main**', 'hand', 'ends in consonant but feminine'] },
        { cells: ['**la forêt**', 'forest', 'ends in consonant but feminine'] },
        { cells: ['**le problème**', 'problem', 'ends in -ème, masculine (Greek)'] },
        { cells: ['**la mer**', 'the sea', 'ends in consonant but feminine'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'The -e ending trap',
    body: `In French, **-e does not mean feminine**. Many common masculine nouns end in -e:\n\n> **le** livre, **le** monde, **le** texte, **le** groupe, **le** type, **le** risque, **le** nombre, **le** genre, **le** ordre, **le** centre, **le** service, **le** problème\n\n**Rule of thumb:** If the noun ends in -e AND has one of the strong feminine endings (-tion, -té, -ure, -ude), it's likely feminine. Otherwise, don't assume.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'la / une', 'le / un'] },
        { cells: ['Strong → fem', '-tion, -sion, -té, -ure, -ude, -eur (abstract)', '—'] },
        { cells: ['Strong → masc', '—', '-age, -ment, -eau, -isme'] },
        { cells: ['⚠ Unreliable', '-e alone (could be either!)', '—'] },
        { cells: ['Greek -ème words', '—', 'masculine (le problème, le système…)'] },
        { cells: ['Strategy', 'Learn every noun with its article — more important in French than any other Romance language', ''] },
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
        { cells: ['-zione / -sione', 'feminine', 'la nazione, la televisione, la missione'] },
        { cells: ['-tà / -tù', 'feminine', 'la città, la libertà, la virtù'] },
        { cells: ['-tura', 'feminine', 'la natura, la cultura, la lettura'] },
        { cells: ['-ismo', 'masculine', 'il turismo, il capitalismo'] },
        { cells: ['-amento / -imento', 'masculine', 'il dipartimento, il sentimento'] },
        { cells: ['-ore', 'masculine', 'il professore, il valore, il colore'] },
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
        { cells: ['-o', 'masculine', 'il libro, il ragazzo, il tempo'] },
        { cells: ['-a', 'feminine', 'la ragazza, la porta, la casa'] },
        { cells: ['-e', '⚠ either — must check', 'il padre (m), la madre (f), il nome (m), la notte (f)'] },
      ],
      note: '**The -e ending is unpredictable** — always verify with a dictionary or by learning the article.',
    },
  },
  {
    type: 'table',
    title: 'Exceptions everyone gets wrong',
    table: {
      headers: ['Word', 'Meaning', 'Surprise'],
      rows: [
        { cells: ['**il problema**', 'the problem', 'ends in -a but masculine'] },
        { cells: ['**il tema**', 'the theme', 'ends in -a but masculine'] },
        { cells: ['**il sistema**', 'the system', 'ends in -a but masculine'] },
        { cells: ['**il clima**', 'the climate', 'ends in -a but masculine'] },
        { cells: ['**il programma**', 'the programme', 'ends in -a but masculine'] },
        { cells: ['**la mano**', 'the hand', 'ends in -o but feminine'] },
        { cells: ['**la radio**', 'the radio', 'ends in -o but feminine'] },
        { cells: ['**la foto**', 'the photo', 'ends in -o but feminine (short for la fotografia)'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'The Greek -ma pattern',
    body: `Words ending in **-ma** of Greek origin are **masculine** in Italian — the most important exception to the -a = feminine rule.\n\n> **il** problema, **il** tema, **il** sistema, **il** clima, **il** programma, **il** dilemma, **il** diploma, **il** dramma, **il** poema, **il** sintoma\n\n**Memory trick:** These words often end in double -mma in Italian (programma, dramma). They tend to be abstract or intellectual concepts.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Category', 'Feminine', 'Masculine'],
      rows: [
        { cells: ['Article', 'la / una', 'il / un'] },
        { cells: ['Strong → fem', '-zione, -sione, -tà, -tù, -tura', '—'] },
        { cells: ['Strong → masc', '—', '-ismo, -amento, -imento, -ore'] },
        { cells: ['Typical endings', '-a (mostly)', '-o (mostly)'] },
        { cells: ['⚠ Unpredictable', '-e endings — always check', '—'] },
        { cells: ['Greek -ma words', '—', 'masculine (il problema, il tema…)'] },
        { cells: ['⚠ Watch out', 'il programma, il dramma (double -mma = masc!)', 'la mano, la foto (end in -o!)'] },
      ],
    },
  },
]

export const THEORY_SLIDES: Record<Language, TheorySlide[]> = { pt: PT, es: ES, fr: FR, it: IT }
