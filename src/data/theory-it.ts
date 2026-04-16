import type { TheorySlide } from './theory'

export const IT_MODULE_1: TheorySlide[] = [
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
