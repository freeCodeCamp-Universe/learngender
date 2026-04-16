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

export const FR_MODULE_2: TheorySlide[] = [
  {
    type: 'intro',
    title: 'What is the indefinite article?',
    body: `In French, **un** and **une** mean "a" or "an" in English. The article changes depending on the gender of the noun.\n\n> **un** livre (a book) — masculine\n> **une** maison (a house) — feminine\n\nIf you know whether to use le or la, you already know whether to use un or une.`,
  },
  {
    type: 'table',
    title: 'un vs une',
    body: 'The definite and indefinite articles always match.',
    table: {
      headers: ['Article', 'Gender', 'Example'],
      rows: [
        { cells: ['**un**', 'masculine', 'le livre → un livre'] },
        { cells: ['**une**', 'feminine', 'la maison → une maison'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: "With l' nouns",
    body: `When the definite article is **l'** (before a vowel or mute h), the indefinite article still follows the gender.\n\n> **l'** homme (the man) → **un** homme — masculine\n> **l'** école (the school) → **une** école — feminine\n> **l'** arbre (the tree) → **un** arbre — masculine\n\nYou need to know the gender of l' nouns to use un or une correctly.`,
  },
  {
    type: 'pattern',
    title: 'When NOT to use un / une',
    body: `French omits the indefinite article with professions after être (to be):\n\n> Je suis **professeur**. (I am a teacher.) — no article\n> Elle est **médecin**. (She is a doctor.) — no article\n> Il est **avocat**. (He is a lawyer.) — no article\n\nHowever, when an adjective is added, the article returns:\n> C'est **un bon** professeur. (He is a good teacher.) — article required`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Masculine', 'Feminine'],
      rows: [
        { cells: ['Definite', "le / l'", "la / l'"] },
        { cells: ['Indefinite', 'un', 'une'] },
      ],
      note: "**Rule:** le → un / la → une. For l' nouns, the indefinite reveals the hidden gender.",
    },
  },
]

export const FR_MODULE_3: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Definite plural: les',
    body: `In French, the plural of both **le** and **la** is **les**. Gender disappears in the plural definite article.\n\n> **le** livre → **les** livres (the books)\n> **la** maison → **les** maisons (the houses)\n> **l'** arbre → **les** arbres (the trees)\n\n**Les** is the same for masculine and feminine — no distinction in the plural.`,
  },
  {
    type: 'pattern',
    title: 'Indefinite plural: des',
    body: `The plural of both **un** and **une** is **des**, meaning "some".\n\n> **un** livre → **des** livres (some books)\n> **une** maison → **des** maisons (some houses)\n\nGender disappears — **des** covers both masculine and feminine.`,
  },
  {
    type: 'pattern',
    title: 'Des becomes de after negation',
    body: `After a negative verb, **des** changes to **de** (or **d'** before a vowel).\n\n> J'ai **des** amis. (I have some friends.)\n> Je n'ai pas **d'**amis. (I don't have any friends.)\n\n> Il mange **des** pommes. (He eats some apples.)\n> Il ne mange pas **de** pommes. (He doesn't eat any apples.)`,
  },
  {
    type: 'pattern',
    title: 'Des becomes de before adjectives',
    body: `When an adjective comes **before** the noun in the plural, **des** changes to **de**.\n\n> des livres intéressants (some interesting books) — adjective after noun, des stays\n> **de** beaux livres (some beautiful books) — adjective before noun, des → de\n> **de** vieilles maisons (some old houses) — adjective before noun, des → de`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'Singular masc.', 'Singular fem.', 'Plural (both)'],
      rows: [
        { cells: ['Definite', "le / l'", "la / l'", 'les'] },
        { cells: ['Indefinite', 'un', 'une', 'des'] },
        { cells: ['After negation', '—', '—', "de / d'"] },
        { cells: ['Before adjective', '—', '—', "de / d'"] },
      ],
    },
  },
]

export const FR_MODULE_4: TheorySlide[] = [
  {
    type: 'intro',
    title: 'The basic rule',
    body: `Most French nouns form the plural by adding **-s** — just like English.\n\n> livre → livre**s**\n> maison → maison**s**\n> ville → ville**s**\n> ami → ami**s**\n\nThe -s is usually silent in spoken French. You hear the plural through the article: **le** livre → **les** livres.`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -s, -x, or -z',
    body: `Nouns already ending in **-s**, **-x**, or **-z** do not change in the plural.\n\n> le bras → les bras (arms — no change)\n> la voix → les voix (voices — no change)\n> le nez → les nez (noses — no change)\n\nThe article is what signals the plural in speech.`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -eau and -eu',
    body: `Nouns ending in **-eau** or **-eu** add **-x** instead of -s.\n\n> le bateau → les bateau**x** (boats)\n> le gâteau → les gâteau**x** (cakes)\n> le chapeau → les chapeau**x** (hats)\n> le jeu → les jeu**x** (games)\n> le feu → les feu**x** (fires)\n\nException: le pneu → les pneus (tyres — adds -s not -x)`,
  },
  {
    type: 'pattern',
    title: 'Nouns ending in -al',
    body: `Most nouns ending in **-al** change to **-aux** in the plural.\n\n> le journal → les journ**aux** (newspapers)\n> l'animal → les anim**aux** (animals)\n> le cheval → les chev**aux** (horses)\n> l'hôpital → les hôpit**aux** (hospitals)\n\nExceptions that just add -s:\n> le festival → les festivals\n> le carnaval → les carnavals`,
  },
  {
    type: 'table',
    title: 'Irregular plurals',
    body: 'A small group of very common nouns have irregular plurals.',
    table: {
      headers: ['Singular', 'Plural', 'Meaning'],
      rows: [
        { cells: ["l'œil", 'les yeux', 'eye / eyes'] },
        { cells: ['monsieur', 'messieurs', 'Mr / gentlemen'] },
        { cells: ['madame', 'mesdames', 'Mrs / ladies'] },
        { cells: ['mademoiselle', 'mesdemoiselles', 'Miss'] },
      ],
    },
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Noun ending', 'Plural rule', 'Example'],
      rows: [
        { cells: ['most nouns', '+ s', 'livre → livres'] },
        { cells: ['-s / -x / -z', 'no change', 'bras → bras'] },
        { cells: ['-eau / -eu', '+ x', 'bateau → bateaux'] },
        { cells: ['-al (most)', '-al → -aux', 'journal → journaux'] },
        { cells: ['-al (some)', '+ s', 'festival → festivals'] },
        { cells: ['irregular', 'memorise', 'œil → yeux'] },
      ],
    },
  },
]

export const FR_MODULE_5: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Adjectives agree with nouns',
    body: `In French, adjectives must **agree in gender and number** with the noun they describe.\n\n> **le** chat **noir** (the black cat) — masculine\n> **la** maison **noire** (the black house) — feminine\n\nThe adjective changes its ending to match the noun.`,
  },
  {
    type: 'table',
    title: 'How adjectives change',
    body: 'Most adjectives add **-e** in the feminine. If the adjective already ends in -e, it stays the same.',
    table: {
      headers: ['Masculine', 'Feminine', 'Meaning'],
      rows: [
        { cells: ['petit', 'petite', 'small'] },
        { cells: ['grand', 'grande', 'big/tall'] },
        { cells: ['français', 'française', 'French'] },
        { cells: ['actif', 'active', 'active'] },
        { cells: ['heureux', 'heureuse', 'happy'] },
        { cells: ['beau', 'belle', 'beautiful'] },
      ],
    },
  },
  {
    type: 'table',
    title: "Adjectives that don't change",
    body: 'Adjectives ending in **-e** in the masculine are the same in the feminine.',
    table: {
      headers: ['Adjective', 'Meaning', 'Example'],
      rows: [
        { cells: ['rouge', 'red', 'le livre rouge / la maison rouge'] },
        { cells: ['jeune', 'young', 'un homme jeune / une femme jeune'] },
        { cells: ['facile', 'easy', 'un problème facile / une question facile'] },
        { cells: ['magnifique', 'magnificent', 'un paysage magnifique / une vue magnifique'] },
      ],
      note: 'No change needed — same word for both genders.',
    },
  },
  {
    type: 'pattern',
    title: 'Adjectives in the plural',
    body: `Add **-s** for plural. If already ending in -s or -x, no change.\n\n> le chat noir → les chats noirs\n> la maison noire → les maisons noires\n> un homme heureux → des hommes heureux (already ends in -x, no change)\n\nFor mixed groups, use the **masculine plural**.\n\n> Le père et la mère sont contents. (The father and mother are happy.)`,
  },
  {
    type: 'pattern',
    title: 'Position: before or after the noun',
    body: `Most French adjectives go **after** the noun — the opposite of English.\n\n> une voiture **rouge** (a red car)\n> un livre **intéressant** (an interesting book)\n\nBut a group of common adjectives always go **before** the noun (BAGS):\n- **B**eauty: beau, joli\n- **A**ge: jeune, vieux, nouveau, ancien\n- **G**oodness: bon, mauvais, gentil\n- **S**ize: grand, petit, gros, long, court\n\n> une **belle** maison / un **vieux** ami / un **bon** repas / une **petite** ville`,
  },
  {
    type: 'table',
    title: 'Position changes meaning',
    body: 'Some adjectives change meaning depending on whether they come before or after the noun.',
    table: {
      headers: ['Before', 'Meaning', 'After', 'Meaning'],
      rows: [
        { cells: ['un **grand** homme', 'a great man', 'un homme **grand**', 'a tall man'] },
        { cells: ['un **ancien** ami', 'a former friend', 'un ami **ancien**', 'an old/ancient friend'] },
        { cells: ['ma **propre** chambre', 'my own room', 'ma chambre **propre**', 'my clean room'] },
        { cells: ['un **pauvre** homme', 'a pitiful man', 'un homme **pauvre**', 'a poor (not rich) man'] },
        { cells: ['la **dernière** semaine', 'the final week', 'la semaine **dernière**', 'last week'] },
      ],
    },
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Rule', 'Detail'],
      rows: [
        { cells: ['Feminine', 'add -e (if not already ending in -e)'] },
        { cells: ['Plural', 'add -s (no change if -s or -x)'] },
        { cells: ['Mixed group', 'masculine plural'] },
        { cells: ['Position', 'after noun (default)'] },
        { cells: ['BAGS adjectives', 'always before noun'] },
        { cells: ['Position changes meaning', 'grand, ancien, propre, pauvre, dernier'] },
      ],
    },
  },
]

export const FR_MODULE_6: TheorySlide[] = [
  {
    type: 'intro',
    title: "What is l'apostrophe?",
    body: `When **le** or **la** comes before a word starting with a **vowel** or **mute h**, it contracts to **l'**.\n\n> **le** arbre → **l'**arbre (the tree)\n> **la** école → **l'**école (the school)\n> **le** homme → **l'**homme (the man)\n> **la** amie → **l'**amie (the female friend)\n\nThis is called elision — the vowel of le/la is dropped and replaced with an apostrophe.`,
  },
  {
    type: 'pattern',
    title: 'When it applies',
    body: `L'apostrophe applies before:\n- Words starting with **a, e, i, o, u**\n- Words starting with **mute h** (h muet)\n\n> l'ami (friend) — starts with a\n> l'enfant (child) — starts with e\n> l'idée (idea) — starts with i\n> l'oiseau (bird) — starts with o\n> l'université (university) — starts with u\n> l'homme (man) — mute h`,
  },
  {
    type: 'table',
    title: 'Mute h vs aspirate h',
    body: "Some words starting with h do NOT trigger l'apostrophe — these have an **aspirate h** (h aspiré). There is no phonetic difference — both h's are silent. You must learn which is which.",
    table: {
      headers: ["Mute h → uses l'", 'Aspirate h → keeps le/la'],
      rows: [
        { cells: ["l'homme (man)", 'le hibou (owl)'] },
        { cells: ["l'heure (hour)", 'le haricot (bean)'] },
        { cells: ["l'hôpital (hospital)", 'la honte (shame)'] },
        { cells: ["l'herbe (grass)", 'le hasard (chance)'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: "L'apostrophe with un / une",
    body: `L'apostrophe only applies to **le** and **la** — not to **un** or **une**.\n\n> un ami (a male friend) — no apostrophe\n> une amie (a female friend) — no apostrophe\n> un homme (a man) — no apostrophe\n> une école (a school) — no apostrophe\n\nOnly the definite articles le and la contract to l'.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Trigger', 'Result', 'Example'],
      rows: [
        { cells: ['le + vowel', "l'", "le arbre → l'arbre"] },
        { cells: ['la + vowel', "l'", "la école → l'école"] },
        { cells: ['le + mute h', "l'", "le homme → l'homme"] },
        { cells: ['la + mute h', "l'", "la herbe → l'herbe"] },
        { cells: ['le + aspirate h', 'le (no change)', 'le hibou'] },
        { cells: ['la + aspirate h', 'la (no change)', 'la honte'] },
        { cells: ['un / une + vowel', 'no change', 'un ami, une école'] },
      ],
    },
  },
]

export const FR_MODULE_7: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Four contractions, always required',
    body: `When **de** or **à** combine with **le** or **les**, they always contract. You cannot avoid them.\n\n> **de + le = du** (never "de le")\n> **à + le = au** (never "à le")\n> **de + les = des** (never "de les")\n> **à + les = aux** (never "à les")\n\nThese do not apply to **la** or **l'** — only to **le** and **les**.`,
  },
  {
    type: 'pattern',
    title: 'Du in use',
    body: `**Du** replaces **de + le** with masculine singular nouns.\n\n> Je viens **du** marché. (I'm coming from the market.) — not "de le marché"\n> Le prix **du** café. (The price of the coffee.)\n> Il parle **du** problème. (He's talking about the problem.)\n\nWith feminine nouns, de la stays separate:\n> Je viens **de la** boulangerie. (I'm coming from the bakery.) — no contraction`,
  },
  {
    type: 'pattern',
    title: 'Au in use',
    body: `**Au** replaces **à + le** with masculine singular nouns.\n\n> Je vais **au** cinéma. (I'm going to the cinema.) — not "à le cinéma"\n> Je parle **au** directeur. (I'm talking to the director.)\n> On joue **au** football. (We play football.)\n\nWith feminine nouns, à la stays separate:\n> Je vais **à la** plage. (I'm going to the beach.) — no contraction`,
  },
  {
    type: 'pattern',
    title: 'Des and aux in use',
    body: `**Des** replaces **de + les** and **aux** replaces **à + les** — for all plural nouns regardless of gender.\n\n> Le livre **des** enfants. (The children's book.) — de + les\n> Je parle **des** problèmes. (I'm talking about the problems.)\n\n> Je pense **aux** vacances. (I'm thinking about the holidays.) — à + les\n> Il parle **aux** étudiants. (He's talking to the students.)`,
  },
  {
    type: 'pattern',
    title: "No contraction with l' or proper names",
    body: `Contractions do NOT happen with **l'** or proper names containing le/les.\n\n> Je viens **de l'**hôpital. (I'm coming from the hospital.) — de + l', no contraction\n> Je vais **à l'**école. (I'm going to school.) — à + l', no contraction\n> J'habite près **du** Louvre. (I live near the Louvre.) — du applies\n> Je parle **de Le Monde**. (I'm talking about Le Monde.) — proper name, no contraction`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Combination', 'Result', 'Example'],
      rows: [
        { cells: ['de + le', 'du', 'du marché'] },
        { cells: ['à + le', 'au', 'au cinéma'] },
        { cells: ['de + les', 'des', 'des enfants'] },
        { cells: ['à + les', 'aux', 'aux vacances'] },
        { cells: ['de + la', 'de la', 'de la boulangerie'] },
        { cells: ['à + la', 'à la', 'à la plage'] },
        { cells: ["de + l'", "de l'", "de l'hôpital"] },
        { cells: ["à + l'", "à l'", "à l'école"] },
      ],
    },
  },
]

export const FR_MODULE_8: TheorySlide[] = [
  {
    type: 'intro',
    title: 'Two kinds of h',
    body: `In French, all h's are silent — but they behave differently for articles and liaison.\n\n- **H muet** (mute h): treated as if the word starts with a vowel → triggers l', liaison, elision\n- **H aspiré** (aspirate h): treated as if the word starts with a consonant → no l', no liaison\n\nBoth h's sound identical. The distinction is purely grammatical — you must learn which is which.`,
  },
  {
    type: 'pattern',
    title: 'H muet: treated as a vowel',
    body: `With h muet, use l' and make liaison normally.\n\n> **l'**homme (the man) — not "le homme"\n> **l'**heure (the hour) — not "la heure"\n> **l'**hôpital (the hospital) — not "le hôpital"\n> **l'**herbe (the grass) — not "la herbe"\n> les hommes (liaison: les-z-hommes)`,
  },
  {
    type: 'pattern',
    title: 'H aspiré: treated as a consonant',
    body: `With h aspiré, keep le/la and no liaison.\n\n> **le** hibou (the owl) — not "l'hibou"\n> **le** haricot (the bean) — not "l'haricot"\n> **la** honte (the shame) — not "l'honte"\n> **le** hasard (chance) — not "l'hasard"\n> **le** hamburger — not "l'hamburger"\n> les haricots (no liaison — not "les-z-haricots")`,
  },
  {
    type: 'table',
    title: 'Most common h aspiré words',
    body: 'These are the most frequent h aspiré words to memorise.',
    table: {
      headers: ['Word', 'Meaning'],
      rows: [
        { cells: ['le hibou', 'owl'] },
        { cells: ['le haricot', 'bean'] },
        { cells: ['la honte', 'shame'] },
        { cells: ['le hasard', 'chance/coincidence'] },
        { cells: ['le haut', 'top/height'] },
        { cells: ['la haine', 'hatred'] },
        { cells: ['le handicap', 'handicap'] },
        { cells: ['le hamburger', 'hamburger'] },
        { cells: ['la Hollande', 'Holland'] },
        { cells: ['le héros', 'hero (but: l\'héroïne — feminine is mute!)'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'A useful shortcut',
    body: `Most h aspiré words in French came from **Germanic languages** (Dutch, German, English). Most h muet words came from **Latin or Greek**.\n\n> hamburger, haricot, hibou, honte → Germanic → h aspiré\n> homme, heure, hôpital, herbe → Latin → h muet\n\nNot a perfect rule, but it helps with unfamiliar words.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['', 'H muet', 'H aspiré'],
      rows: [
        { cells: ['Article', "l'homme", 'le hibou'] },
        { cells: ['Liaison', 'les-z-hommes', 'les haricots (no liaison)'] },
        { cells: ['Origin', 'Latin / Greek', 'Germanic'] },
        { cells: ['Common examples', 'homme, heure, hôpital, herbe, hiver', 'hibou, haricot, honte, hasard, haut'] },
        { cells: ['Dictionary marker', 'no mark', '‡ or * in some dictionaries'] },
      ],
      note: "**Key point:** Both h's are silent to the ear. The difference only shows in writing and grammar.",
    },
  },
]

export const FR_MODULE_9: TheorySlide[] = [
  {
    type: 'intro',
    title: "When rules don't help",
    body: `French gender is notoriously unpredictable. Unlike Spanish or Portuguese, many French nouns cannot be reliably guessed from their spelling.\n\nThis card covers the most common nouns that break the expected patterns — the ones every learner gets wrong.\n\n**Strategy:** Stop guessing. Learn these with their article from day one.`,
  },
  {
    type: 'table',
    title: 'Masculine traps (look feminine but aren\'t)',
    body: 'These nouns end in -e but are masculine.',
    table: {
      headers: ['Word', 'Meaning', 'Why surprising'],
      rows: [
        { cells: ['**le** silence', 'silence', 'ends in -e'] },
        { cells: ['**le** musée', 'museum', 'ends in -ée'] },
        { cells: ['**le** lycée', 'high school', 'ends in -ée'] },
        { cells: ['**le** stade', 'stadium', 'ends in -e'] },
        { cells: ['**le** groupe', 'group', 'ends in -e'] },
        { cells: ['**le** texte', 'text', 'ends in -e'] },
        { cells: ['**le** risque', 'risk', 'ends in -e'] },
        { cells: ['**le** nombre', 'number', 'ends in -e'] },
        { cells: ['**le** livre', 'book', 'ends in -e'] },
        { cells: ['**le** genre', 'gender/kind', 'ends in -e'] },
      ],
    },
  },
  {
    type: 'table',
    title: "Feminine traps (look masculine but aren't)",
    body: 'These nouns end in consonants or unexpected endings but are feminine.',
    table: {
      headers: ['Word', 'Meaning', 'Why surprising'],
      rows: [
        { cells: ['**la** mer', 'sea', 'ends in consonant'] },
        { cells: ['**la** forêt', 'forest', 'ends in consonant'] },
        { cells: ['**la** main', 'hand', 'ends in consonant'] },
        { cells: ['**la** dent', 'tooth', 'ends in consonant'] },
        { cells: ['**la** nuit', 'night', 'ends in consonant'] },
        { cells: ['**la** clé / clef', 'key', 'ends in consonant'] },
        { cells: ['**la** façon', 'way/manner', 'ends in -on (often masc.)'] },
        { cells: ['**la** leçon', 'lesson', 'ends in -on'] },
        { cells: ['**la** saison', 'season', 'ends in -on'] },
        { cells: ['**la** raison', 'reason', 'ends in -on'] },
      ],
    },
  },
  {
    type: 'table',
    title: 'Words that differ from Spanish and Portuguese',
    body: 'These are especially tricky for speakers of other Romance languages because the gender differs.',
    table: {
      headers: ['French', 'Meaning', 'Spanish', 'Portuguese'],
      rows: [
        { cells: ['**le** lait (masc.)', 'milk', '**la** leche (fem.)', '**o** leite (masc.)'] },
        { cells: ['**le** sang (masc.)', 'blood', '**la** sangre (fem.)', '**o** sangue (masc.)'] },
        { cells: ['**la** mer (fem.)', 'sea', '**el** mar (masc.)', '**o** mar (masc.)'] },
        { cells: ['**la** dent (fem.)', 'tooth', '**el** diente (masc.)', '**o** dente (masc.)'] },
        { cells: ['**la** fin (fem.)', 'end', '**el** fin (masc.)', '**o** fim (masc.)'] },
      ],
    },
  },
  {
    type: 'pattern',
    title: 'Survival list: must-know genders',
    body: `These are the highest-frequency nouns where gender must simply be memorised.\n\n**Masculine:** le temps, le monde, le pays, le moment, le problème, le sens, le genre, le groupe, le silence, le texte, le risque, le nombre, le livre, le stade, le musée, le lycée\n\n**Feminine:** la mer, la forêt, la main, la dent, la nuit, la clé, la façon, la leçon, la saison, la raison, la fin, la douleur, la chaleur, la peur, la valeur`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Pattern', 'Usually', 'Major exceptions'],
      rows: [
        { cells: ['ends in -e', 'feminine', 'le livre, le groupe, le texte, le silence, le musée'] },
        { cells: ['ends in -tion / -sion', 'feminine', 'reliable'] },
        { cells: ['ends in -té', 'feminine', 'reliable'] },
        { cells: ['ends in -eur (abstract)', 'feminine', 'la chaleur, la peur — but le bonheur, le malheur'] },
        { cells: ['ends in -on', 'masculine', 'la façon, la leçon, la saison, la raison, la maison'] },
        { cells: ['ends in consonant', 'masculine', 'la mer, la forêt, la main, la dent, la nuit'] },
      ],
      note: '**Bottom line:** French gender requires more memorisation than Spanish, Portuguese, or Italian. The article is always your safest reference.',
    },
  },
]

export const FR_MODULE_10: TheorySlide[] = [
  {
    type: 'intro',
    title: 'What is the partitive?',
    body: `The partitive article expresses **an unspecified quantity** of something — the equivalent of "some" or "any" in English.\n\n> Je mange **du** pain. (I eat some bread / I eat bread.)\n> Je bois **de l'**eau. (I drink some water / I drink water.)\n> Je veux **de la** viande. (I want some meat.)\n\nEnglish often omits "some" entirely — French rarely does.`,
  },
  {
    type: 'table',
    title: 'The three forms',
    table: {
      headers: ['Article', 'Gender', 'Use'],
      rows: [
        { cells: ['**du**', 'masculine', 'de + le → du pain, du café, du riz'] },
        { cells: ['**de la**', 'feminine', 'de la viande, de la salade'] },
        { cells: ["**de l'**", 'before vowel or mute h', "de l'eau, de l'huile, de l'air"] },
      ],
      note: '**Du** is a contraction — exactly the same form as the contraction from Card 7. Context tells you which it is.',
    },
  },
  {
    type: 'pattern',
    title: 'When to use it',
    body: `Use the partitive with **uncountable nouns** — things you can't count individually.\n\n> Je mange **du** fromage. (I eat some cheese.) — you don't eat "a cheese"\n> Il boit **de la** bière. (He drinks some beer.)\n> Elle a **de la** patience. (She has some patience.)\n> On respire **de l'**air. (We breathe air.)\n\nWith countable nouns, use un/une or a number instead:\n> Je mange **une** pomme. (I eat an apple.) — countable`,
  },
  {
    type: 'pattern',
    title: 'Partitive after negation',
    body: `After a negative verb, all partitive articles change to **de** (or **d'** before a vowel).\n\n> Je mange **du** pain. → Je ne mange pas **de** pain.\n> Elle boit **de la** bière. → Elle ne boit pas **de** bière.\n> Il a **de l'**argent. → Il n'a pas **d'**argent.\n\nThis is the same rule as des → de after negation.`,
  },
  {
    type: 'pattern',
    title: 'Partitive vs definite article',
    body: `The partitive and the definite article are easy to confuse.\n\n> J'aime **le** café. (I like coffee — in general.) — definite, general statement\n> Je bois **du** café. (I drink some coffee — right now.) — partitive, specific quantity\n\n> Elle aime **la** musique. (She likes music — in general.)\n> Elle écoute **de la** musique. (She is listening to some music — right now.)\n\n**Rule:** Use the definite article (le/la/les) for general statements. Use the partitive (du/de la/de l') for specific, unquantified amounts.`,
  },
  {
    type: 'cheatsheet',
    title: 'Cheat sheet',
    isReference: true,
    table: {
      headers: ['Article', 'Form', 'Use', 'Example'],
      rows: [
        { cells: ['Partitive masc.', 'du', 'unspecified masc. noun', 'du pain'] },
        { cells: ['Partitive fem.', 'de la', 'unspecified fem. noun', 'de la viande'] },
        { cells: ["Partitive + vowel/mute h", "de l'", 'unspecified noun starting with vowel', "de l'eau"] },
        { cells: ['After negation', "de / d'", 'always', "pas de pain, pas d'eau"] },
        { cells: ['General statement', 'le / la / les', 'likes, dislikes, facts', "j'aime le café"] },
        { cells: ['Specific amount', "du / de la / de l'", 'eating, drinking, having', 'je bois du café'] },
      ],
    },
  },
]
