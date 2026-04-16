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

export const ES_MODULE_2: TheorySlide[] = [
  {
    type: 'intro',
    title: 'What is the indefinite article?',
    body: `In Spanish, **un** and **una** mean "a" or "an" in English. The article changes depending on the gender of the noun.\n\n> **un** libro (a book) — masculine\n> **una** casa (a house) — feminine\n\nIf you know whether to use el or la, you already know whether to use un or una.`,
  },
  {
    type: 'table',
    title: 'un vs una',
    body: 'The definite and indefinite articles always match — if you know whether to use el or a, you already know whether to use un or una.',
    table: {
      headers: ['Article', 'Gender', 'Example'],
      rows: [
        { cells: ['**un**', 'masculine', 'el libro → un libro'] },
        { cells: ['**una**', 'feminine', 'la casa → una casa'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'With exceptions too',
    body: `The indefinite article follows the same gender as the definite article — including all exceptions.\n\n> **el** día → **un** día (a day) — masculine despite ending in -a\n> **el** problema → **un** problema (a problem) — masculine\n> **la** mano → **una** mano (a hand) — feminine despite ending in -o\n\n**Key insight:** You never need to re-learn the gender for un/una. It always mirrors el/la.`,
  },
  {
    type: 'pattern',
    title: 'When NOT to use un / una',
    body: `Spanish omits the indefinite article in several cases where English uses "a":\n\n> Soy **profesora**. (I am a teacher.) — omitted with professions\n> No tengo **coche**. (I don't have a car.) — omitted after negation\n> Busco **piso**. (I'm looking for a flat.) — omitted in classified-ad style speech\n\nIn English you always say "a teacher", "a car". In Spanish the article is regularly dropped in these contexts.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Masculine', 'Feminine'],
      rows: [
        { cells: ['Definite', 'el', 'la'] },
        { cells: ['Indefinite', 'un', 'una'] },
        { cells: ['Pattern', 'always match', 'always match'] },
      ],
      note: '**Rule:** el → un / la → una. No exceptions to this pairing.',
    },
  },
]

export const ES_MODULE_3: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Definite plural: los / las',
    body: `The plural of **el** is **los**. The plural of **la** is **las**.\n\n> **el** libro → **los** libros (the books)\n> **la** casa → **las** casas (the houses)\n\nGender is preserved in the plural — masculine nouns stay masculine, feminine nouns stay feminine.`,
  },
  {
    type: 'pattern',
    title: 'Indefinite plural: unos / unas',
    body: `The plural of **un** is **unos**. The plural of **una** is **unas**. These mean "some" in English.\n\n> **un** libro → **unos** libros (some books)\n> **una** casa → **unas** casas (some houses)\n\nLike Portuguese, **unos/unas** are often omitted in everyday speech.\n\n> Tengo **libros** en casa. (I have some books at home.) — no article needed`,
  },
  {
    type: 'table',
    title: 'The full picture',
    body: 'All four forms follow the same gender as the singular — no surprises.',
    table: {
      headers: ['', 'Masc. singular', 'Masc. plural', 'Fem. singular', 'Fem. plural'],
      rows: [
        { cells: ['Definite', 'el', 'los', 'la', 'las'] },
        { cells: ['Indefinite', 'un', 'unos', 'una', 'unas'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Mixed groups',
    body: `When a group contains both masculine and feminine nouns, Spanish uses the **masculine plural**.\n\n> el padre (father) + la madre (mother) → **los** padres (the parents)\n> el hermano (brother) + la hermana (sister) → **los** hermanos (siblings)\n\nSame rule as Portuguese, Italian, and French — masculine plural is the default for mixed groups.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Singular', 'Plural'],
      rows: [
        { cells: ['Masculine definite', 'el', 'los'] },
        { cells: ['Feminine definite', 'la', 'las'] },
        { cells: ['Masculine indefinite', 'un', 'unos'] },
        { cells: ['Feminine indefinite', 'una', 'unas'] },
        { cells: ['Mixed groups', '—', 'masculine plural (los)'] },
      ],
    },
  },
]

export const ES_MODULE_4: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The basic rule',
    body: `Most Spanish nouns form the plural by adding **-s**.\n\n> libro → libro**s**\n> casa → casa**s**\n> ciudad → ciudad**es**\n> nombre → nombre**s**\n\nIf the noun ends in a vowel (a, e, o), just add -s. This covers the majority of nouns.`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in a consonant',
    body: `Nouns ending in a consonant add **-es**.\n\n> ciudad → ciudad**es** (cities)\n> mujer → mujer**es** (women)\n> animal → animal**es** (animals)\n> color → color**es** (colours)\n\nUnlike Portuguese, Spanish does not change -l to -is. Just add -es.\n\n> animal → animales (not "animais" like in Portuguese)`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -z',
    body: `Nouns ending in **-z** change the -z to **-c** and add -es.\n\n> vez → ve**ces** (times/occasions)\n> voz → vo**ces** (voices)\n> luz → lu**ces** (lights)\n> paz → pa**ces** (peaces)\n\n**Rule:** -z → -ces. Always.`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -s or -x',
    body: `Nouns ending in **-s** or **-x** in an unstressed final syllable do not change in the plural.\n\n> el lunes → los lunes (Mondays — no change)\n> la crisis → las crisis (crises — no change)\n> el tórax → los tórax (thoraxes — no change)\n\nIf the noun ends in a stressed -s or -es, it does change:\n> el mes → los meses (months)\n> el autobús → los autobuses (buses)`,
  },
  {
    type: 'pattern',
    title: 'Accent changes',
    body: `Some nouns gain or lose a written accent in the plural to maintain correct stress.\n\n**Lose accent in plural:**\n> la nación → las naciones\n> el camión → los camiones\n> el inglés → los ingleses\n\n**Gain accent in plural:**\n> el joven → los jóvenes\n> el origen → los orígenes`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Noun ending', 'Plural rule', 'Example'],
      rows: [
        { cells: ['vowel', '+ s', 'casa → casas'] },
        { cells: ['consonant', '+ es', 'ciudad → ciudades'] },
        { cells: ['-z', '-z → -ces', 'vez → veces'] },
        { cells: ['-s or -x (unstressed)', 'no change', 'lunes → lunes'] },
        { cells: ['-s (stressed)', '+ es', 'autobús → autobuses'] },
        { cells: ['accent shifts', 'varies', 'nación → naciones / joven → jóvenes'] },
      ],
    },
  },
]

export const ES_MODULE_5: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Adjectives agree with nouns',
    body: `In Spanish, adjectives must **agree in gender and number** with the noun they describe.\n\n> **el** coche **rojo** (the red car) — masculine\n> **la** casa **roja** (the red house) — feminine\n\nThe adjective changes its ending to match the noun. This is why getting the gender right matters beyond just the article.`,
  },
  {
    type: 'table',
    title: 'How adjectives change',
    body: 'Most adjectives end in **-o** in the masculine and change to **-a** in the feminine.',
    table: {
      headers: ['Masculine', 'Feminine', 'Meaning'],
      rows: [
        { cells: ['bonito', 'bonita', 'beautiful'] },
        { cells: ['pequeño', 'pequeña', 'small'] },
        { cells: ['cansado', 'cansada', 'tired'] },
        { cells: ['nuevo', 'nueva', 'new'] },
        { cells: ['alto', 'alta', 'tall'] },
      ],
      note: '**Rule:** -o → -a for most common adjectives.',
    },
  },
  {
    type: 'table',
    title: "Adjectives that don't change",
    body: 'Some adjectives have the same form for masculine and feminine. These typically end in **-e**, **-ista**, or a consonant.',
    table: {
      headers: ['Adjective', 'Meaning', 'Example'],
      rows: [
        { cells: ['inteligente', 'intelligent', 'el alumno inteligente / la alumna inteligente'] },
        { cells: ['feliz', 'happy', 'el hombre feliz / la mujer feliz'] },
        { cells: ['difícil', 'difficult', 'el problema difícil / la situación difícil'] },
        { cells: ['optimista', 'optimistic', 'el hombre optimista / la mujer optimista'] },
      ],
      note: 'No change needed — same word for both genders.',
    },
  },
  {
    type: 'pattern',
    title: 'Adjectives in the plural',
    body: `Adjectives also change for plural — following the same rules as nouns.\n\n> el coche rojo → los coches rojos\n> la casa roja → las casas rojas\n> el hombre feliz → los hombres felices\n> la mujer feliz → las mujeres felices\n\nFor mixed groups, use the **masculine plural** form.\n\n> El padre y la madre son simpáticos. (The father and mother are nice.)`,
  },
  {
    type: 'pattern',
    title: 'Adjectives before nouns: shortening',
    body: `Some masculine singular adjectives shorten when placed **before** the noun.\n\n> **buen** hombre (a good man) — but un hombre **bueno**\n> **mal** día (a bad day) — but un día **malo**\n> **gran** ciudad (a great city) — but una ciudad **grande**\n> **primer** capítulo (first chapter) — but el capítulo **primero**\n\nThis only happens in the masculine singular and only when the adjective precedes the noun.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Masc. sg', 'Masc. pl', 'Fem. sg', 'Fem. pl'],
      rows: [
        { cells: ['-o adjectives', '-o', '-os', '-a', '-as'] },
        { cells: ['-e adjectives', '-e', '-es', '-e', '-es'] },
        { cells: ['consonant adj.', 'base', 'base + es', 'base', 'base + es'] },
        { cells: ['-z adj.', '-z', '-ces', '-z', '-ces'] },
        { cells: ['Mixed group', 'masculine plural form', '', '', ''] },
        { cells: ['Before noun (masc. sg.)', 'buen / mal / gran / primer', '', '', ''] },
      ],
    },
  },
]

export const ES_MODULE_6: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Two contractions, no exceptions',
    body: `Spanish has two contractions that are **always required** — you cannot avoid them.\n\n> **a + el = al** (never "a el")\n> **de + el = del** (never "de el")\n\nThese only happen with the definite masculine singular article **el**. They do not apply to él (he), la, las, los, un, una.`,
  },
  {
    type: 'pattern',
    title: 'Al in use',
    body: `**Al** replaces **a + el** when moving toward or referring to a masculine noun.\n\n> Voy **al** mercado. (I'm going to the market.) — not "a el mercado"\n> Llamo **al** médico. (I'm calling the doctor.) — not "a el médico"\n> Voy **al** banco. (I'm going to the bank.)\n\nWith feminine nouns, la stays separate:\n> Voy **a la** tienda. (I'm going to the shop.) — no contraction`,
  },
  {
    type: 'pattern',
    title: 'Del in use',
    body: `**Del** replaces **de + el** when expressing origin, possession, or relationship with a masculine noun.\n\n> Vengo **del** trabajo. (I'm coming from work.) — not "de el trabajo"\n> Es el coche **del** vecino. (It's the neighbour's car.) — not "de el vecino"\n> El precio **del** café. (The price of the coffee.)\n\nWith feminine nouns, de la stays separate:\n> Vengo **de la** oficina. (I'm coming from the office.) — no contraction`,
  },
  {
    type: 'pattern',
    title: 'When NOT to contract',
    body: `The contraction does NOT happen when **el** is part of a proper name or title.\n\n> Hablo **de El País**. (I'm talking about El País.) — proper name, no contraction\n> Voy **a El Cairo**. (I'm going to Cairo.) — proper name, no contraction\n\nAnd never with **él** (he/him — with accent):\n> Hablo **de él**. (I'm talking about him.) — pronoun, no contraction`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Situation', 'Correct', 'Wrong'],
      rows: [
        { cells: ['a + el (masc. noun)', 'al', 'a el'] },
        { cells: ['de + el (masc. noun)', 'del', 'de el'] },
        { cells: ['a + la (fem. noun)', 'a la', '— no contraction'] },
        { cells: ['de + la (fem. noun)', 'de la', '— no contraction'] },
        { cells: ['a + El (proper name)', 'a El País', '— no contraction'] },
        { cells: ['de + él (pronoun)', 'de él', '— no contraction'] },
      ],
    },
  },
]

export const ES_MODULE_7: TheorySlide[] = [
  {
    type: 'intro',
    title: 'What is lo?',
    body: `Spanish has a third article that doesn't exist in Portuguese: **lo**. It is neither masculine nor feminine — it is **neuter**.\n\n**Lo** is used with adjectives and past participles to create abstract nouns.\n\n> **lo** bueno (the good thing / what is good)\n> **lo** importante (the important thing)\n> **lo** mejor (the best thing)\n\nThere are no nouns that use lo — it only combines with adjectives.`,
  },
  {
    type: 'pattern',
    title: 'Lo + adjective',
    body: `**Lo + adjective** expresses an abstract quality or concept.\n\n> **Lo** difícil es empezar. (The hard part is starting.)\n> **Lo** bueno de Madrid es el clima. (The good thing about Madrid is the weather.)\n> **Lo** peor ya pasó. (The worst is over.)\n\nThe adjective after lo is always in the **masculine singular** form.`,
  },
  {
    type: 'pattern',
    title: 'Lo que',
    body: `**Lo que** means "what" or "that which" and introduces a clause.\n\n> **Lo que** me gusta es el café. (What I like is the coffee.)\n> Haz **lo que** quieras. (Do what you want.)\n> No sé **lo que** pasó. (I don't know what happened.)\n\nThis is one of the most common uses of lo and appears constantly in natural speech.`,
  },
  {
    type: 'pattern',
    title: 'Lo + de',
    body: `**Lo de** refers to a matter or situation related to something or someone.\n\n> **Lo de** ayer fue horrible. (That thing yesterday was horrible.)\n> **Lo de** tu hermano es complicado. (The situation with your brother is complicated.)\n> ¿Resolviste **lo de** trabajo? (Did you sort out that work thing?)\n\nInformal but extremely common in everyday Spanish.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Structure', 'Meaning', 'Example'],
      rows: [
        { cells: ['lo + adjective', 'abstract concept', 'lo bueno, lo difícil'] },
        { cells: ['lo + superlative', 'the most/best/worst', 'lo mejor, lo peor'] },
        { cells: ['lo que', 'what / that which', 'lo que me gusta'] },
        { cells: ['lo de', 'that matter/thing', 'lo de ayer'] },
        { cells: ['Adjective after lo', 'always masculine singular', 'lo bueno (not buena)'] },
      ],
      note: '**Key point:** Lo never goes with a noun. Only with adjectives, participles, and clauses.',
    },
  },
]

export const ES_MODULE_8: TheorySlide[] = [
  {
    type: 'intro',
    title: 'A surprising rule',
    body: `Some feminine nouns use **el** instead of **la** in the singular. This is not a gender change — the noun is still feminine.\n\n> **el** agua (the water) — feminine\n> **el** hambre (the hunger) — feminine\n> **el** alma (the soul) — feminine\n> **el** hacha (the axe) — feminine\n\nThis happens for a phonetic reason — not because the noun changed gender.`,
  },
  {
    type: 'pattern',
    title: 'Why does this happen?',
    body: `When a feminine noun starts with a **stressed a-** or **stressed ha-** sound, using **la** would create an awkward double-vowel sound: "la agua" sounds clunky.\n\nSpanish solves this by using **el** in the singular only — purely for ease of pronunciation.\n\n> la + agua → **el** agua (sounds better)\n> la + hambre → **el** hambre (sounds better)\n> la + alma → **el** alma (sounds better)`,
  },
  {
    type: 'pattern',
    title: 'Still feminine — proof',
    body: `Even though these nouns use el, they are still feminine. Adjectives must still agree in the feminine form.\n\n> ✓ **el** agua **fría** (the cold water) — fría is feminine\n> ✓ **el** alma **perdida** (the lost soul) — perdida is feminine\n> ✓ **el** hambre **extrema** (extreme hunger) — extrema is feminine\n\nAnd in the plural, la returns:\n> **el** agua → **las** aguas\n> **el** alma → **las** almas\n> **el** hacha → **las** hachas`,
  },
  {
    type: 'table',
    title: 'Common words to memorise',
    body: 'These are the most frequent nouns where this rule applies.',
    table: {
      headers: ['Word', 'Meaning'],
      rows: [
        { cells: ['el agua', 'water'] },
        { cells: ['el hambre', 'hunger'] },
        { cells: ['el alma', 'soul'] },
        { cells: ['el hacha', 'axe'] },
        { cells: ['el área', 'area'] },
        { cells: ['el aula', 'classroom'] },
        { cells: ['el arma', 'weapon'] },
        { cells: ['el águila', 'eagle'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Un, not una',
    body: `The same rule applies to the indefinite article — **un** instead of **una** in the singular.\n\n> **un** agua fría, por favor. (a cold water, please.)\n> **un** alma generosa. (a generous soul.)\n> **un** aula grande. (a large classroom.)\n\nBut in the plural, unas returns:\n> **unas** aguas tranquilas. (calm waters.)\n> **unas** almas perdidas. (lost souls.)`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Singular', 'Plural'],
      rows: [
        { cells: ['Definite', 'el agua', 'las aguas'] },
        { cells: ['Indefinite', 'un agua', 'unas aguas'] },
        { cells: ['Adjective agreement', 'still feminine', 'still feminine'] },
        { cells: ['Trigger', 'stressed a- or ha- at start', '—'] },
        { cells: ['Most common', 'agua, hambre, alma, hacha, área, aula, arma, águila', ''] },
      ],
      note: '**Remember:** El/un here is a phonetic fix — not a gender change. The noun is still feminine.',
    },
  },
]
