import type { TheorySlide } from './theory'

export const PT_MODULE_2: TheorySlide[] = [
  {
    type: 'intro',
    title: 'What is the indefinite article?',
    body: `In Portuguese, **um** and **uma** mean "a" or "an" in English. Unlike English, the article changes depending on the gender of the noun.\n\n> **um** livro (a book) — masculine\n> **uma** casa (a house) — feminine\n\nThe rule is simple: if the noun is masculine, use **um**. If feminine, use **uma**.`,
  },
  {
    type: 'table',
    title: 'um vs uma',
    body: 'The definite and indefinite articles always match — if you know whether to use o or a, you already know whether to use um or uma.',
    table: {
      headers: ['Article', 'Gender', 'Use with'],
      rows: [
        { cells: ['**um**', 'masculine', 'o livro → um livro'] },
        { cells: ['**uma**', 'feminine', 'a casa → uma casa'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'With exceptions too',
    body: `The indefinite article follows the same gender as the definite article — including exceptions.\n\n> **o** dia → **um** dia (a day) — masculine despite ending in -a\n> **o** problema → **um** problema (a problem) — masculine\n> **a** mão → **uma** mão (a hand) — feminine despite ending in -ão\n\n**Key insight:** You never need to re-learn the gender for um/uma. It's always the same as o/a.`,
  },
  {
    type: 'pattern',
    title: 'When NOT to use um / uma',
    body: `Portuguese often omits the indefinite article in cases where English uses "a":\n\n> Ela é **professora**. (She is a teacher.) — no article with professions\n> Tenho **carro**. (I have a car.) — can be omitted in informal speech\n> Não tenho **problema**. (I don't have a problem.) — omitted after negation\n\nIn English you always say "a teacher", "a car". In Portuguese the article is often dropped in these contexts.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Masculine', 'Feminine'],
      rows: [
        { cells: ['Definite', 'o', 'a'] },
        { cells: ['Indefinite', 'um', 'uma'] },
        { cells: ['Pattern', 'always match', 'always match'] },
      ],
      note: '**Rule:** o → um / a → uma. No exceptions to this pairing.',
    },
  },
]

export const PT_MODULE_3: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Definite plural: os / as',
    body: `The plural of **o** is **os**. The plural of **a** is **as**.\n\n> **o** livro → **os** livros (the books)\n> **a** casa → **as** casas (the houses)\n\nGender is preserved in the plural — masculine nouns stay masculine, feminine nouns stay feminine.`,
  },
  {
    type: 'pattern',
    title: 'Indefinite plural: uns / umas',
    body: `The plural of **um** is **uns**. The plural of **uma** is **umas**. These mean "some" in English.\n\n> **um** livro → **uns** livros (some books)\n> **uma** casa → **umas** casas (some houses)\n\n**uns** and **umas** are less common in everyday speech — Portuguese often omits them.\n\n> Tenho **livros** em casa. (I have some books at home.) — no article needed`,
  },
  {
    type: 'table',
    title: 'The full picture',
    body: 'All four forms follow the same gender as the singular — no surprises.',
    table: {
      headers: ['', 'Masc. singular', 'Masc. plural', 'Fem. singular', 'Fem. plural'],
      rows: [
        { cells: ['Definite', 'o', 'os', 'a', 'as'] },
        { cells: ['Indefinite', 'um', 'uns', 'uma', 'umas'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Mixed groups',
    body: `When a group contains both masculine and feminine nouns, Portuguese uses the **masculine plural**.\n\n> o pai (father) + a mãe (mother) → **os** pais (the parents)\n> o irmão (brother) + a irmã (sister) → **os** irmãos (siblings)\n\nThis is the same rule as Spanish, Italian, and French — the masculine plural is the default for mixed groups.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Singular', 'Plural'],
      rows: [
        { cells: ['Masculine definite', 'o', 'os'] },
        { cells: ['Feminine definite', 'a', 'as'] },
        { cells: ['Masculine indefinite', 'um', 'uns'] },
        { cells: ['Feminine indefinite', 'uma', 'umas'] },
        { cells: ['Mixed groups', '—', 'masculine plural (os)'] },
      ],
    },
  },
]

export const PT_MODULE_4: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The basic rule',
    body: `Most Portuguese nouns form the plural by adding **-s**.\n\n> livro → livro**s**\n> casa → casa**s**\n> cidade → cidade**s**\n> nome → nome**s**\n\nIf the noun ends in a vowel (a, e, o), just add -s. This covers the majority of nouns.`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in a consonant',
    body: `Nouns ending in a consonant add **-es**.\n\n> rapaz → rapaz**es** (boys)\n> mulher → mulher**es** (women)\n> animal → animai**s** (animals) — note: -l changes to -is\n> jornal → jornai**s** (newspapers)\n\n**The -l rule:** Nouns ending in -l drop the -l and add -is.\n> animal → animais / jornal → jornais / hotel → hotéis`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -m',
    body: `Nouns ending in **-m** change to **-ns** in the plural.\n\n> homem → home**ns** (men)\n> viagem → viage**ns** (trips/journeys)\n> atum → atu**ns** (tunas)\n> album → albu**ns** (albums)`,
  },
  {
    type: 'table',
    title: 'Nouns ending in -ão',
    body: 'This is the most complex pattern. Nouns ending in **-ão** have three possible plurals.',
    table: {
      headers: ['Plural ending', 'Examples'],
      rows: [
        { cells: ['**-ões** (most common)', 'nação → nações, coração → corações, botão → botões'] },
        { cells: ['**-ães** (some common words)', 'pão → pães, cão → cães'] },
        { cells: ['**-ãos** (a few words)', 'irmão → irmãos, cidadão → cidadãos'] },
      ],
      note: '**Practical tip:** -ões covers most cases. When in doubt, use -ões.',
    },
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -s or -z',
    body: `Nouns ending in **-s** in an unstressed syllable do not change in the plural.\n\n> o lápis → os lápis (pencils — no change)\n> o ônibus → os ônibus (buses — no change)\n\nNouns ending in **-z** add **-es**.\n\n> voz → vozes (voices)\n> vez → vezes (times/occasions)\n> cruz → cruzes (crosses)`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Noun ending', 'Plural rule', 'Example'],
      rows: [
        { cells: ['vowel', '+ s', 'casa → casas'] },
        { cells: ['consonant', '+ es', 'mulher → mulheres'] },
        { cells: ['-l', 'drop -l, add -is', 'animal → animais'] },
        { cells: ['-m', '-m → -ns', 'homem → homens'] },
        { cells: ['-ão (most)', '-ão → -ões', 'nação → nações'] },
        { cells: ['-ão (some)', '-ão → -ães', 'pão → pães'] },
        { cells: ['-ão (few)', '-ão → -ãos', 'irmão → irmãos'] },
        { cells: ['-s (unstressed)', 'no change', 'lápis → lápis'] },
        { cells: ['-z', '+ es', 'voz → vozes'] },
      ],
    },
  },
]

export const PT_MODULE_5: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Adjectives agree with nouns',
    body: `In Portuguese, adjectives must **agree in gender and number** with the noun they describe. This is one of the most important consequences of noun gender.\n\n> **o** carro **vermelho** (the red car) — masculine\n> **a** casa **vermelha** (the red house) — feminine\n\nThe adjective changes its ending to match the noun. This is why getting the gender right matters beyond just the article.`,
  },
  {
    type: 'table',
    title: 'How adjectives change',
    body: 'Most adjectives end in **-o** in the masculine and change to **-a** in the feminine.',
    table: {
      headers: ['Masculine', 'Feminine', 'Meaning'],
      rows: [
        { cells: ['bonito', 'bonita', 'beautiful'] },
        { cells: ['pequeno', 'pequena', 'small'] },
        { cells: ['cansado', 'cansada', 'tired'] },
        { cells: ['novo', 'nova', 'new'] },
        { cells: ['alto', 'alta', 'tall'] },
      ],
      note: '**Rule:** -o → -a for most common adjectives.',
    },
  },
  {
    type: 'table',
    title: 'Adjectives that don\'t change',
    body: 'Some adjectives have the same form for masculine and feminine. These typically end in **-e**, **-ista**, or a consonant.',
    table: {
      headers: ['Adjective', 'Meaning', 'Example'],
      rows: [
        { cells: ['inteligente', 'intelligent', 'o aluno inteligente / a aluna inteligente'] },
        { cells: ['feliz', 'happy', 'o homem feliz / a mulher feliz'] },
        { cells: ['simples', 'simple', 'o problema simples / a solução simples'] },
        { cells: ['otimista', 'optimistic', 'o homem otimista / a mulher otimista'] },
      ],
      note: 'No change needed — same word for both genders.',
    },
  },
  {
    type: 'pattern',
    title: 'Adjectives in the plural',
    body: `Adjectives also change for plural — following the same rules as nouns.\n\n> o carro vermelho → os carros vermelhos\n> a casa vermelha → as casas vermelhas\n> o homem feliz → os homens felizes\n> a mulher feliz → as mulheres felizes\n\nFor mixed groups (masculine + feminine nouns), use the **masculine plural** form of the adjective.\n\n> o pai e a mãe são simpáticos. (The father and mother are nice.)`,
  },
  {
    type: 'pattern',
    title: 'Why gender matters beyond the article',
    body: `Every time you misidentify a noun's gender, it's not just the article that changes — the adjectives, pronouns, and determiners around it all need to agree too.\n\n> **um** problema **grave** (a serious problem) — all masculine ✓\n> **uma** problema **grave** — wrong — every element clashes ✗\n\n> **a** cidade **linda** (a beautiful city) — all feminine ✓\n> **o** cidade **linda** — wrong — native speakers notice instantly ✗\n\n**Getting gender right = speaking naturally.** The article is the most visible signal, but it ripples through the whole sentence.`,
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
        { cells: ['-consonant adj.', 'base', 'base + es', 'base', 'base + es'] },
        { cells: ['Mixed group', 'masculine plural form', '', '', ''] },
      ],
      note: 'bonito / bonitos / bonita / bonitas · inteligente / inteligentes · feliz / felizes',
    },
  },
]
