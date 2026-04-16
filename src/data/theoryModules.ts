import type { Language } from '../types'
import type { TheorySlide } from './theory'
import { PT_MODULE_1, PT_MODULE_2, PT_MODULE_3, PT_MODULE_4, PT_MODULE_5 } from './theory-pt'
import { ES_MODULE_1, ES_MODULE_2, ES_MODULE_3, ES_MODULE_4, ES_MODULE_5, ES_MODULE_6, ES_MODULE_7, ES_MODULE_8 } from './theory-es'
import { FR_MODULE_1, FR_MODULE_2, FR_MODULE_3, FR_MODULE_4, FR_MODULE_5, FR_MODULE_6, FR_MODULE_7, FR_MODULE_8, FR_MODULE_9, FR_MODULE_10 } from './theory-fr'
import { IT_MODULE_1, IT_MODULE_2, IT_MODULE_3, IT_MODULE_4, IT_MODULE_5, IT_MODULE_6, IT_MODULE_7, IT_MODULE_8 } from './theory-it'

export interface TheoryModule {
  id: string
  title: string
  emoji: string
  slideCount: number
  slides?: TheorySlide[]   // undefined = placeholder (not yet implemented)
}

const PT_MODULES: TheoryModule[] = [
  { id: 'noun-gender-basics',         emoji: '📖', title: 'Noun Gender Basics',                        slideCount: PT_MODULE_1.length, slides: PT_MODULE_1 },
  { id: 'indefinite-article-singular',emoji: '✏️',  title: 'Indefinite Article: um / uma',              slideCount: PT_MODULE_2.length, slides: PT_MODULE_2 },
  { id: 'plural-articles',            emoji: '📚', title: 'Plural Articles: os / as / uns / umas',     slideCount: PT_MODULE_3.length, slides: PT_MODULE_3 },
  { id: 'pluralising-nouns',          emoji: '🔢', title: 'Pluralising Nouns',                         slideCount: PT_MODULE_4.length, slides: PT_MODULE_4 },
  { id: 'adjective-agreement',        emoji: '🎨', title: 'Gender and Adjectives',                     slideCount: PT_MODULE_5.length, slides: PT_MODULE_5 },
]

const ES_MODULES: TheoryModule[] = [
  { id: 'noun-gender-basics',         emoji: '📖', title: 'Noun Gender Basics',                        slideCount: ES_MODULE_1.length, slides: ES_MODULE_1 },
  { id: 'indefinite-article-singular',emoji: '✏️',  title: 'Indefinite Article: un / una',              slideCount: ES_MODULE_2.length, slides: ES_MODULE_2 },
  { id: 'plural-articles',            emoji: '📚', title: 'Plural Articles: los / las / unos / unas',  slideCount: ES_MODULE_3.length, slides: ES_MODULE_3 },
  { id: 'pluralising-nouns',          emoji: '🔢', title: 'Pluralising Nouns',                         slideCount: ES_MODULE_4.length, slides: ES_MODULE_4 },
  { id: 'adjective-agreement',        emoji: '🎨', title: 'Gender and Adjectives',                     slideCount: ES_MODULE_5.length, slides: ES_MODULE_5 },
  { id: 'contractions',               emoji: '🔗', title: 'Contractions: al / del',                    slideCount: ES_MODULE_6.length, slides: ES_MODULE_6 },
  { id: 'neuter-article-lo',          emoji: '💡', title: 'The Neuter Article: lo',                    slideCount: ES_MODULE_7.length, slides: ES_MODULE_7 },
  { id: 'el-before-feminine',         emoji: '⚡', title: 'El Before Feminine Nouns',                  slideCount: ES_MODULE_8.length, slides: ES_MODULE_8 },
]

const FR_MODULES: TheoryModule[] = [
  { id: 'noun-gender-basics',         emoji: '📖', title: 'Noun Gender Basics',                        slideCount: FR_MODULE_1.length,  slides: FR_MODULE_1  },
  { id: 'indefinite-article-singular',emoji: '✏️',  title: 'Indefinite Article: un / une',              slideCount: FR_MODULE_2.length,  slides: FR_MODULE_2  },
  { id: 'plural-articles',            emoji: '📚', title: 'Plural Articles: les / des',                slideCount: FR_MODULE_3.length,  slides: FR_MODULE_3  },
  { id: 'pluralising-nouns',          emoji: '🔢', title: 'Pluralising Nouns',                         slideCount: FR_MODULE_4.length,  slides: FR_MODULE_4  },
  { id: 'adjective-agreement',        emoji: '🎨', title: 'Gender and Adjectives',                     slideCount: FR_MODULE_5.length,  slides: FR_MODULE_5  },
  { id: 'apostrophe',                 emoji: '〃', title: "L'Apostrophe: le/la → l'",                  slideCount: FR_MODULE_6.length,  slides: FR_MODULE_6  },
  { id: 'contractions',               emoji: '🔗', title: 'Contractions: du / au / des / aux',         slideCount: FR_MODULE_7.length,  slides: FR_MODULE_7  },
  { id: 'h-muet-aspire',              emoji: '🔤', title: 'H Muet vs H Aspiré',                        slideCount: FR_MODULE_8.length,  slides: FR_MODULE_8  },
  { id: 'gender-without-logic',       emoji: '🎲', title: 'Gender Without Logic',                      slideCount: FR_MODULE_9.length,  slides: FR_MODULE_9  },
  { id: 'partitive-articles',         emoji: '🍞', title: "Partitive Articles: du / de la / de l'",    slideCount: FR_MODULE_10.length, slides: FR_MODULE_10 },
]

const IT_MODULES: TheoryModule[] = [
  { id: 'noun-gender-basics',         emoji: '📖', title: 'Noun Gender Basics',                        slideCount: IT_MODULE_1.length, slides: IT_MODULE_1 },
  { id: 'indefinite-article-singular',emoji: '✏️',  title: "Indefinite Article: un / uno / una / un'", slideCount: IT_MODULE_2.length, slides: IT_MODULE_2 },
  { id: 'plural-articles',            emoji: '📚', title: 'Plural Articles: i / gli / le',             slideCount: IT_MODULE_3.length, slides: IT_MODULE_3 },
  { id: 'pluralising-nouns',          emoji: '🔢', title: 'Pluralising Nouns',                         slideCount: IT_MODULE_4.length, slides: IT_MODULE_4 },
  { id: 'adjective-agreement',        emoji: '🎨', title: 'Gender and Adjectives',                     slideCount: IT_MODULE_5.length, slides: IT_MODULE_5 },
  { id: 'definite-article-singular',  emoji: '🗂️',  title: "Full Article System: il / lo / l' / la",   slideCount: IT_MODULE_6.length, slides: IT_MODULE_6 },
  { id: 'contractions',               emoji: '🔗', title: 'Contractions: del, della, nel, nella…',    slideCount: IT_MODULE_7.length, slides: IT_MODULE_7 },
  { id: 'nouns-ending-in-e',          emoji: '🔡', title: 'Nouns Ending in -e',                        slideCount: IT_MODULE_8.length, slides: IT_MODULE_8 },
]

export const THEORY_MODULES: Record<Language, TheoryModule[]> = {
  pt: PT_MODULES,
  es: ES_MODULES,
  fr: FR_MODULES,
  it: IT_MODULES,
}

// Progress storage
export function getModuleDone(lang: Language, moduleId: string): boolean {
  try {
    return localStorage.getItem(`theory_done_${lang}_${moduleId}`) === '1'
  } catch {
    return false
  }
}

export function setModuleDone(lang: Language, moduleId: string): void {
  try {
    localStorage.setItem(`theory_done_${lang}_${moduleId}`, '1')
  } catch { /* ignore */ }
}
