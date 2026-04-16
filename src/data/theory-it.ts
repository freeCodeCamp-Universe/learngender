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

export const IT_MODULE_2: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Four forms, one concept',
    body: `Italian has four forms of the indefinite article. Which one to use depends on the **gender** of the noun and the **first sound** of the word that follows.`,
  },
  {
    type: 'table',
    title: 'The four forms at a glance',
    table: {
      headers: ['Form', 'Gender', 'Use before', 'Example'],
      rows: [
        { cells: ['**un**', 'masculine', 'most consonants and vowels', 'un libro, un amico'] },
        { cells: ['**uno**', 'masculine', 's+consonant, z, ps, gn, x, y', 'uno studente, uno zaino'] },
        { cells: ['**una**', 'feminine', 'consonants', 'una casa, una donna'] },
        { cells: ["**un'**", 'feminine', 'vowels', "un'amica, un'idea"] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Un vs uno (masculine)',
    body: `**Un** is the default masculine form — used before most words.\n\n> **un** libro (a book)\n> **un** amico (a male friend)\n> **un** cane (a dog)\n\n**Uno** is used before masculine words starting with **s+consonant, z, ps, gn, x, y**.\n\n> **uno** studente (a student) — s+consonant\n> **uno** zaino (a backpack) — z\n> **uno** psicologo (a psychologist) — ps\n> **uno** gnomo (a gnome) — gn`,
  },
  {
    type: 'pattern',
    title: "Una vs un' (feminine)",
    body: `**Una** is used before feminine words starting with a consonant.\n\n> **una** casa (a house)\n> **una** donna (a woman)\n> **una** scuola (a school)\n\n**Un'** (with apostrophe) is used before feminine words starting with a vowel.\n\n> **un'**amica (a female friend)\n> **un'**idea (an idea)\n> **un'**ora (an hour)\n> **un'**università (a university)`,
  },
  {
    type: 'pattern',
    title: 'The trigger sounds for uno',
    body: `The same sounds that trigger **uno** in the indefinite also trigger **lo** in the definite article. Learning them once applies to both.\n\n**Triggers: s+consonant, z, ps, gn, x, y**\n\n> → uno / lo studente\n> → uno / lo zaino\n> → uno / lo psicologo\n> → uno / lo gnocco\n> → uno / lo xilofono\n> → uno / lo yogurt`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Form', 'Gender', 'Before', 'Example'],
      rows: [
        { cells: ['un', 'masculine', 'most sounds', 'un libro, un amico'] },
        { cells: ['uno', 'masculine', 's+cons, z, ps, gn, x, y', 'uno studente, uno zaino'] },
        { cells: ['una', 'feminine', 'consonants', 'una casa, una donna'] },
        { cells: ["un'", 'feminine', 'vowels', "un'amica, un'idea"] },
      ],
    },
  },
]

export const IT_MODULE_3: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Three plural definite articles',
    body: `Italian has three plural definite articles — one for feminine and two for masculine, depending on the first sound of the noun.\n\n> **i** → masculine, most consonants\n> **gli** → masculine, vowels / s+cons / z / ps / gn / x / y\n> **le** → all feminine nouns`,
  },
  {
    type: 'pattern',
    title: 'I vs gli (masculine plural)',
    body: `**I** is the default masculine plural — used before most consonants.\n\n> il libro → **i** libri (the books)\n> il cane → **i** cani (the dogs)\n> il ragazzo → **i** ragazzi (the boys)\n\n**Gli** is used before masculine words starting with a vowel, or the special sounds (s+consonant, z, ps, gn, x, y).\n\n> l'amico → **gli** amici (the friends)\n> lo studente → **gli** studenti (the students)\n> lo zaino → **gli** zaini (the backpacks)\n> lo gnocco → **gli** gnocchi (the dumplings)`,
  },
  {
    type: 'pattern',
    title: 'Le (feminine plural)',
    body: `**Le** is used for all feminine nouns in the plural — no exceptions based on the first sound.\n\n> la casa → **le** case (the houses)\n> la donna → **le** donne (the women)\n> l'amica → **le** amiche (the female friends)\n> la scuola → **le** scuole (the schools)`,
  },
  {
    type: 'table',
    title: 'Indefinite plural: dei / degli / delle',
    body: 'The plural indefinite articles mean "some" and follow the same pattern as the definite articles. These are contractions of di + i, di + gli, di + le.',
    table: {
      headers: ['Article', 'Gender', 'Use', 'Example'],
      rows: [
        { cells: ['**dei**', 'masculine', 'most consonants', 'dei libri (some books)'] },
        { cells: ['**degli**', 'masculine', 'vowels + special sounds', 'degli amici (some friends)'] },
        { cells: ['**delle**', 'feminine', 'all feminine', 'delle case (some houses)'] },
      ],
    },
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Singular', 'Plural'],
      rows: [
        { cells: ['Masculine (most)', 'il', 'i'] },
        { cells: ['Masculine (special)', 'lo', 'gli'] },
        { cells: ["Masculine (vowel)", "l'", 'gli'] },
        { cells: ['Feminine (consonant)', 'la', 'le'] },
        { cells: ["Feminine (vowel)", "l'", 'le'] },
        { cells: ['Indefinite masc. plural', '—', 'dei / degli'] },
        { cells: ['Indefinite fem. plural', '—', 'delle'] },
      ],
    },
  },
]

export const IT_MODULE_4: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Italian plurals are more regular than French',
    body: `Italian noun plurals follow clear patterns based on the noun's ending. Unlike French, the plural is always pronounced differently — you hear it, not just see it.\n\nThe key endings to know: **-o, -a, -e, -ca/-ga, -co/-go, -io**`,
  },
  {
    type: 'table',
    title: 'The main patterns',
    table: {
      headers: ['Singular ending', 'Plural ending', 'Example'],
      rows: [
        { cells: ['-o (masculine)', '-i', 'il libro → i libri'] },
        { cells: ['-a (feminine)', '-e', 'la casa → le case'] },
        { cells: ['-e (masc. or fem.)', '-i', 'il padre → i padri / la notte → le notti'] },
        { cells: ['-a (masculine — Greek)', '-i', 'il problema → i problemi'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -ca/-ga and -co/-go',
    body: `Nouns ending in **-ca** or **-ga** add -h- to keep the hard sound in the plural.\n\n> la banca → le banc**he** (banks)\n> la bottega → le botteg**he** (shops)\n> l'amica → le amic**he** (female friends)\n\nNouns ending in **-co** or **-go** are less predictable:\n\n> il medico → i med**ici** (doctors) — soft sound\n> il fuoco → i fu**ochi** (fires) — hard sound kept\n> il lago → i lag**hi** (lakes) — hard sound kept\n\n**Rule of thumb:** People/professions tend to go to -ci/-gi (soft). Things tend to keep -chi/-ghi (hard).`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -io',
    body: `Nouns ending in **-io** drop one -i- in the plural.\n\n> il figlio → i figl**i** (sons) — not "figlii"\n> l'occhio → gli occh**i** (eyes)\n> il viaggio → i viagg**i** (trips)\n> lo studio → gli stud**i** (studies)`,
  },
  {
    type: 'pattern',
    title: 'Invariable nouns',
    body: `Some nouns do not change in the plural:\n\n- Nouns ending in a **stressed vowel**: la città → le città / il caffè → i caffè\n- Nouns ending in a **consonant** (foreign words): il bar → i bar / il film → i film / lo sport → gli sport\n- Abbreviations: il cinema → i cinema`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Singular', 'Plural', 'Example'],
      rows: [
        { cells: ['-o (masc.)', '-i', 'libro → libri'] },
        { cells: ['-a (fem.)', '-e', 'casa → case'] },
        { cells: ['-e (masc./fem.)', '-i', 'padre → padri / notte → notti'] },
        { cells: ['-a (Greek masc.)', '-i', 'problema → problemi'] },
        { cells: ['-ca / -ga', '-che / -ghe', 'banca → banche'] },
        { cells: ['-co / -go (things)', '-chi / -ghi', 'lago → laghi'] },
        { cells: ['-co / -go (people)', '-ci / -gi', 'medico → medici'] },
        { cells: ['-io', '-i', 'figlio → figli'] },
        { cells: ['stressed vowel', 'no change', 'città → città'] },
        { cells: ['foreign consonant', 'no change', 'bar → bar'] },
      ],
    },
  },
]

export const IT_MODULE_5: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Adjectives agree with nouns',
    body: `In Italian, adjectives must **agree in gender and number** with the noun they describe.\n\n> **il** gatto **nero** (the black cat) — masculine singular\n> **la** casa **nera** (the black house) — feminine singular\n> **i** gatti **neri** (the black cats) — masculine plural\n> **le** case **nere** (the black houses) — feminine plural`,
  },
  {
    type: 'pattern',
    title: 'Two types of adjectives',
    body: `**Type 1:** Four forms — -o / -a / -i / -e (most adjectives)\n\n> un ragazzo **alto** / una ragazza **alta** / dei ragazzi **alti** / delle ragazze **alte**\n\n**Type 2:** Two forms — -e / -i (adjectives ending in -e)\n\n> un uomo **grande** / una donna **grande** / degli uomini **grandi** / delle donne **grandi**`,
  },
  {
    type: 'table',
    title: 'Common Type 1 adjectives (-o)',
    table: {
      headers: ['Masculine', 'Feminine', 'Meaning'],
      rows: [
        { cells: ['bello', 'bella', 'beautiful'] },
        { cells: ['piccolo', 'piccola', 'small'] },
        { cells: ['nuovo', 'nuova', 'new'] },
        { cells: ['vecchio', 'vecchia', 'old'] },
        { cells: ['bianco', 'bianca', 'white'] },
        { cells: ['rosso', 'rossa', 'red'] },
        { cells: ['caro', 'cara', 'dear/expensive'] },
      ],
    },
  },
  {
    type: 'table',
    title: 'Common Type 2 adjectives (-e)',
    table: {
      headers: ['Adjective', 'Meaning', 'Example'],
      rows: [
        { cells: ['grande', 'big/great', 'un uomo grande / una donna grande'] },
        { cells: ['verde', 'green', 'un campo verde / una mela verde'] },
        { cells: ['triste', 'sad', 'un bambino triste / una bambina triste'] },
        { cells: ['felice', 'happy', 'un padre felice / una madre felice'] },
        { cells: ['elegante', 'elegant', 'un uomo elegante / una donna elegante'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Position: usually after the noun',
    body: `Like French and Spanish, Italian adjectives usually go **after** the noun.\n\n> una macchina **rossa** (a red car)\n> un libro **interessante** (an interesting book)\n\nBut some common adjectives go **before** — especially bello, brutto, buono, cattivo, grande, piccolo, giovane, vecchio, nuovo.\n\n> un **bel** ragazzo (a handsome boy)\n> una **buona** idea (a good idea)\n> un **vecchio** amico (an old friend)\n\nWhen placed before the noun, **bello** and **buono** shorten:\n> bel / bell' / bello / bella / begli / bei / belle\n> buon / buono / buona / buon'`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Type', 'Singular masc.', 'Singular fem.', 'Plural masc.', 'Plural fem.'],
      rows: [
        { cells: ['Type 1 (-o)', '-o', '-a', '-i', '-e'] },
        { cells: ['Type 2 (-e)', '-e', '-e', '-i', '-i'] },
        { cells: ['Mixed group', 'masculine plural', '', '', ''] },
        { cells: ['Position', 'after noun (default)', '', '', ''] },
        { cells: ['Before noun', 'bello, buono, grande, piccolo, vecchio, nuovo', '', '', ''] },
      ],
    },
  },
]

export const IT_MODULE_6: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Seven forms, one system',
    body: `Italian has seven definite article forms. The choice depends on the **gender** of the noun and the **first sound** of the word.`,
  },
  {
    type: 'table',
    title: 'All seven forms',
    table: {
      headers: ['Article', 'Gender', 'Number', 'Use before'],
      rows: [
        { cells: ['**il**', 'masculine', 'singular', 'most consonants'] },
        { cells: ['**lo**', 'masculine', 'singular', 's+cons, z, ps, gn, x, y'] },
        { cells: ["**l'**", 'masc. or fem.', 'singular', 'vowels'] },
        { cells: ['**la**', 'feminine', 'singular', 'consonants'] },
        { cells: ['**i**', 'masculine', 'plural', 'most consonants'] },
        { cells: ['**gli**', 'masculine', 'plural', 'vowels + special sounds'] },
        { cells: ['**le**', 'feminine', 'plural', 'all feminine'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Il vs lo (masculine singular)',
    body: `**Il** is the default masculine singular — used before most consonants.\n\n> **il** libro / **il** cane / **il** padre\n\n**Lo** is used before masculine words starting with **s+consonant, z, ps, gn, x, y**.\n\n> **lo** studente — sc\n> **lo** zaino — z\n> **lo** psicologo — ps\n> **lo** gnocco — gn\n> **lo** xilofono — x\n> **lo** yogurt — y`,
  },
  {
    type: 'pattern',
    title: "L' (masculine and feminine singular)",
    body: `**L'** is used before both masculine and feminine nouns starting with a vowel.\n\n> **l'**amico (the male friend) — masculine\n> **l'**amica (the female friend) — feminine\n> **l'**albero (the tree) — masculine\n> **l'**ora (the hour) — feminine\n\nTo know the gender of l' nouns, think of the plural: gli = masculine, le = feminine.\n\n> **l'**amico → **gli** amici — masculine\n> **l'**amica → **le** amiche — feminine`,
  },
  {
    type: 'pattern',
    title: 'The special sound rule: one rule, three articles',
    body: `The same sounds that trigger **lo** (singular) also trigger **gli** (plural) and **uno** (indefinite). Learn the trigger sounds once — they apply everywhere.\n\n**Trigger sounds: s+consonant, z, ps, gn, x, y**\n\n> Before trigger sounds: **lo** studente / **gli** studenti / **uno** studente\n> Before vowels: **l'**amico / **gli** amici / **un** amico\n> Before other consonants: **il** libro / **i** libri / **un** libro`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Article', 'Gender', 'Number', 'Before'],
      rows: [
        { cells: ['il', 'masculine', 'singular', 'most consonants'] },
        { cells: ['lo', 'masculine', 'singular', 's+cons, z, ps, gn, x, y'] },
        { cells: ["l'", 'masc./fem.', 'singular', 'vowels'] },
        { cells: ['la', 'feminine', 'singular', 'consonants'] },
        { cells: ['i', 'masculine', 'plural', 'most consonants'] },
        { cells: ['gli', 'masculine', 'plural', 'vowels + special sounds'] },
        { cells: ['le', 'feminine', 'plural', 'all feminine'] },
      ],
      note: '**Trigger sounds:** s+consonant · z · ps · gn · x · y → always use lo / gli / uno',
    },
  },
]

export const IT_MODULE_7: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Italian contractions are extensive',
    body: `Five prepositions combine with all seven definite articles to form contractions. Unlike Spanish (only al/del) or French (du/au/des/aux), Italian contracts with **all article forms**.\n\nThe five prepositions: **di, a, da, in, su**`,
  },
  {
    type: 'table',
    title: 'Di + article (of / from)',
    table: {
      headers: ['Article', 'Contraction', 'Example'],
      rows: [
        { cells: ['di + il', '**del**', 'il prezzo del caffè'] },
        { cells: ['di + lo', '**dello**', 'il libro dello studente'] },
        { cells: ["di + l'", "**dell'**", "il nome dell'amico"] },
        { cells: ['di + la', '**della**', 'la porta della casa'] },
        { cells: ['di + i', '**dei**', 'il colore dei fiori'] },
        { cells: ['di + gli', '**degli**', 'il prezzo degli zaini'] },
        { cells: ['di + le', '**delle**', 'il sapore delle mele'] },
      ],
    },
  },
  {
    type: 'table',
    title: 'A + article (to / at)',
    table: {
      headers: ['Article', 'Contraction', 'Example'],
      rows: [
        { cells: ['a + il', '**al**', 'vado al mercato'] },
        { cells: ['a + lo', '**allo**', 'vado allo stadio'] },
        { cells: ["a + l'", "**all'**", "vado all'aeroporto"] },
        { cells: ['a + la', '**alla**', 'vado alla stazione'] },
        { cells: ['a + i', '**ai**', 'parlo ai ragazzi'] },
        { cells: ['a + gli', '**agli**', 'parlo agli studenti'] },
        { cells: ['a + le', '**alle**', 'parlo alle ragazze'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Da, in, su + article',
    body: `**Da** (from/by/since): dal, dallo, dall', dalla, dai, dagli, dalle\n> Vengo **dal** lavoro. (I'm coming from work.)\n\n**In** (in/into): nel, nello, nell', nella, nei, negli, nelle\n> Vivo **nel** centro. (I live in the centre.)\n> Studio **nell'**università. (I study at the university.)\n\n**Su** (on/about): sul, sullo, sull', sulla, sui, sugli, sulle\n> Il libro è **sul** tavolo. (The book is on the table.)\n> **Sulla** sinistra. (On the left.)`,
  },
  {
    type: 'pattern',
    title: 'Con and per: no contractions',
    body: `**Con** (with) and **per** (for/through) do NOT contract in modern Italian.\n\n> con il → col is possible but archaic — use **con il**\n> per il → stays as **per il**\n\n> Vengo **con il** treno. (I'm coming by train.)\n> È **per la** tua famiglia. (It's for your family.)`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'il', 'lo', "l'", 'la', 'i', 'gli', 'le'],
      rows: [
        { cells: ['di', 'del', 'dello', "dell'", 'della', 'dei', 'degli', 'delle'] },
        { cells: ['a', 'al', 'allo', "all'", 'alla', 'ai', 'agli', 'alle'] },
        { cells: ['da', 'dal', 'dallo', "dall'", 'dalla', 'dai', 'dagli', 'dalle'] },
        { cells: ['in', 'nel', 'nello', "nell'", 'nella', 'nei', 'negli', 'nelle'] },
        { cells: ['su', 'sul', 'sullo', "sull'", 'sulla', 'sui', 'sugli', 'sulle'] },
        { cells: ['con', 'con il', 'con lo', "con l'", 'con la', 'con i', 'con gli', 'con le'] },
        { cells: ['per', 'per il', 'per lo', "per l'", 'per la', 'per i', 'per gli', 'per le'] },
      ],
    },
  },
]

export const IT_MODULE_8: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The unpredictable ending',
    body: `In Italian, nouns ending in **-e** can be either masculine or feminine. Unlike -o (usually masculine) and -a (usually feminine), -e gives no clue about gender.\n\n> ✓ **il** padre (the father) — masculine\n> ✓ **la** madre (the mother) — feminine\n> ✓ **il** nome (the name) — masculine\n> ✓ **la** notte (the night) — feminine`,
  },
  {
    type: 'pattern',
    title: 'All -e nouns pluralise the same way',
    body: `Regardless of gender, all nouns ending in -e form the plural with **-i**.\n\n> il padre → i padr**i** (fathers)\n> la madre → le madr**i** (mothers)\n> il nome → i nom**i** (names)\n> la notte → le nott**i** (nights)\n> il mare → i mar**i** (seas)\n> la chiave → le chiav**i** (keys)\n\nThe plural form doesn't reveal gender either — you must learn the article.`,
  },
  {
    type: 'table',
    title: 'Common masculine -e nouns',
    table: {
      headers: ['Word', 'Meaning'],
      rows: [
        { cells: ['il padre', 'father'] },
        { cells: ['il nome', 'name'] },
        { cells: ['il mare', 'sea'] },
        { cells: ['il fiore', 'flower'] },
        { cells: ['il dente', 'tooth'] },
        { cells: ['il piede', 'foot'] },
        { cells: ['il ponte', 'bridge'] },
        { cells: ['il sole', 'sun'] },
        { cells: ['il cane', 'dog'] },
        { cells: ['il pane', 'bread'] },
        { cells: ['il mese', 'month'] },
      ],
    },
  },
  {
    type: 'table',
    title: 'Common feminine -e nouns',
    table: {
      headers: ['Word', 'Meaning'],
      rows: [
        { cells: ['la madre', 'mother'] },
        { cells: ['la notte', 'night'] },
        { cells: ['la chiave', 'key'] },
        { cells: ['la voce', 'voice'] },
        { cells: ['la neve', 'snow'] },
        { cells: ['la torre', 'tower'] },
        { cells: ['la classe', 'class'] },
        { cells: ['la fine', 'end'] },
        { cells: ['la gente', 'people'] },
        { cells: ['la parte', 'part'] },
        { cells: ['la rete', 'net/network'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'A pattern that sometimes helps',
    body: `Many -e nouns referring to **male people** are masculine and **female people** are feminine. For professions, Italian often has distinct forms:\n\n> il professore / la professoressa\n> l'attore / l'attrice (actor / actress)\n> il dottore / la dottoressa\n> il signore (gentleman) → la signora (lady)\n\nBut for most -e nouns referring to things, there is no pattern — the gender must be learnt.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', '-e nouns'],
      rows: [
        { cells: ['Gender', 'unpredictable — must learn with article'] },
        { cells: ['Plural', 'always -i (both masc. and fem.)'] },
        { cells: ['Masc. examples', 'il padre, il nome, il mare, il fiore, il cane, il pane'] },
        { cells: ['Fem. examples', 'la madre, la notte, la chiave, la voce, la neve, la classe'] },
        { cells: ['Professions', 'often have distinct masc./fem. forms (-ore / -oressa, -ore / -rice)'] },
        { cells: ['Strategy', 'learn every -e noun with its article — il or la — from the start'] },
      ],
    },
  },
]
