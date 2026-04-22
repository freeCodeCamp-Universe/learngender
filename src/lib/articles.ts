import type { Language, Word } from '../types'

// h-aspiré words in French that do NOT elide (use le/la, not l')
const FR_H_ASPIRE = new Set([
  'hall', 'hamburger', 'hamster', 'haricot', 'hasard', 'haut', 'hauteur',
  'héros', 'hibou', 'hockey', 'homard', 'honte', 'haie', 'halo', 'hameau',
  'hanche', 'hangar', 'hareng', 'harnais', 'harpe', 'hausse', 'havre',
  'horde', 'hublot', 'hurlement', 'hutte', 'hyène', 'harem',
])

// Spanish feminine nouns starting with stressed a/ha that use 'el'
const ES_FEM_EL = new Set([
  'agua', 'alma', 'área', 'arma', 'ala', 'hada', 'hambre', 'hacha',
  'arca', 'aula', 'águila', 'alba', 'alga', 'arpa', 'asa', 'ave', 'haba', 'habla', 'haya',
])

function startsWithVowel(word: string): boolean {
  return /^[aeiouàáâãäåæèéêëìíîïòóôõöøœùúûüÿ]/i.test(word)
}

function itStartsLo(word: string): boolean {
  const w = word.toLowerCase()
  return (
    (w.startsWith('s') && w.length > 1 && !'aeiouàèéìíîòóùú'.includes(w[1])) ||
    w.startsWith('z') ||
    w.startsWith('gn') ||
    w.startsWith('ps') ||
    w.startsWith('pn') ||
    w.startsWith('x') ||
    w.startsWith('y') ||
    w.startsWith('j')
  )
}

function frElides(word: string): boolean {
  const w = word.toLowerCase()
  if (startsWithVowel(w)) return true
  if (w.startsWith('h') && !FR_H_ASPIRE.has(w)) return true
  return false
}

// Returns the article for a given word + gender in a language
export function deriveArticle(word: string, gender: 'masculine' | 'feminine', lang: Language): string {
  const w = word.toLowerCase()
  switch (lang) {
    case 'pt':
      return gender === 'masculine' ? 'o' : 'a'
    case 'es':
      if (gender === 'feminine' && ES_FEM_EL.has(w)) return 'el'
      return gender === 'masculine' ? 'el' : 'la'
    case 'fr':
      if (frElides(w)) return "l'"
      return gender === 'masculine' ? 'le' : 'la'
    case 'it':
      if (gender === 'masculine') {
        if (startsWithVowel(w)) return "l'"
        if (itStartsLo(w)) return 'lo'
        return 'il'
      } else {
        if (startsWithVowel(w)) return "l'"
        return 'la'
      }
  }
}

// Returns the article for the OPPOSITE gender of a word
export function getOppositeArticle(word: Word, lang: Language): string {
  const oppositeGender = word.gender === 'masculine' ? 'feminine' : 'masculine'
  return deriveArticle(word.word, oppositeGender, lang)
}

// Returns [femArticle, mascArticle] for display on the swipe hint
// If both are the same (e.g. l' for both genders), returns them with qualifiers
export function getArticlePair(word: Word, lang: Language): { fem: string; masc: string; ambiguous: boolean } {
  const correctArticle = word.article
  const oppositeArticle = getOppositeArticle(word, lang)

  const femArticle = word.gender === 'feminine' ? correctArticle : oppositeArticle
  const mascArticle = word.gender === 'masculine' ? correctArticle : oppositeArticle
  const ambiguous = femArticle === mascArticle

  return { fem: femArticle, masc: mascArticle, ambiguous }
}
