import type { Language } from '../types'
import type { TheorySlide } from './theory'
import { PT_MODULE_1, PT_MODULE_2, PT_MODULE_3, PT_MODULE_4, PT_MODULE_5 } from './theory-pt'
import { ES_MODULE_1, ES_MODULE_2, ES_MODULE_3, ES_MODULE_4, ES_MODULE_5, ES_MODULE_6, ES_MODULE_7, ES_MODULE_8 } from './theory-es'
import { FR_MODULE_1 } from './theory-fr'
import { IT_MODULE_1 } from './theory-it'

export interface TheoryModule {
  id: string
  title: string
  slideCount: number
  slides?: TheorySlide[]   // undefined = placeholder (not yet implemented)
}

const PT_MODULES: TheoryModule[] = [
  {
    id: 'noun-gender-basics',
    title: 'Noun Gender Basics',
    slideCount: PT_MODULE_1.length,
    slides: PT_MODULE_1,
  },
  {
    id: 'indefinite-article-singular',
    title: 'Indefinite Article Singular: um / uma',
    slideCount: PT_MODULE_2.length,
    slides: PT_MODULE_2,
  },
  {
    id: 'plural-articles',
    title: 'Plural Articles: os / as / uns / umas',
    slideCount: PT_MODULE_3.length,
    slides: PT_MODULE_3,
  },
  {
    id: 'pluralising-nouns',
    title: 'Pluralising Nouns',
    slideCount: PT_MODULE_4.length,
    slides: PT_MODULE_4,
  },
  {
    id: 'adjective-agreement',
    title: 'Gender and Adjectives',
    slideCount: PT_MODULE_5.length,
    slides: PT_MODULE_5,
  },
]

const ES_MODULES: TheoryModule[] = [
  {
    id: 'noun-gender-basics',
    title: 'Noun Gender Basics',
    slideCount: ES_MODULE_1.length,
    slides: ES_MODULE_1,
  },
  {
    id: 'indefinite-article-singular',
    title: 'Indefinite Article Singular: un / una',
    slideCount: ES_MODULE_2.length,
    slides: ES_MODULE_2,
  },
  {
    id: 'plural-articles',
    title: 'Plural Articles: los / las / unos / unas',
    slideCount: ES_MODULE_3.length,
    slides: ES_MODULE_3,
  },
  {
    id: 'pluralising-nouns',
    title: 'Pluralising Nouns',
    slideCount: ES_MODULE_4.length,
    slides: ES_MODULE_4,
  },
  {
    id: 'adjective-agreement',
    title: 'Gender and Adjectives',
    slideCount: ES_MODULE_5.length,
    slides: ES_MODULE_5,
  },
  {
    id: 'contractions',
    title: 'Contractions: al / del',
    slideCount: ES_MODULE_6.length,
    slides: ES_MODULE_6,
  },
  {
    id: 'neuter-article-lo',
    title: 'The Neuter Article: lo',
    slideCount: ES_MODULE_7.length,
    slides: ES_MODULE_7,
  },
  {
    id: 'el-before-feminine',
    title: 'El Before Feminine Nouns',
    slideCount: ES_MODULE_8.length,
    slides: ES_MODULE_8,
  },
]

const FR_MODULES: TheoryModule[] = [
  {
    id: 'noun-gender-basics',
    title: 'Noun Gender Basics',
    slideCount: FR_MODULE_1.length,
    slides: FR_MODULE_1,
  },
  {
    id: 'indefinite-article-singular',
    title: 'Indefinite Article Singular: un / une',
    slideCount: 4,
  },
  {
    id: 'plural-articles',
    title: 'Plural Articles: les / des',
    slideCount: 4,
  },
  {
    id: 'partitive-articles',
    title: 'Partitive Articles: du / de la / de l\'',
    slideCount: 5,
  },
  {
    id: 'adjective-agreement',
    title: 'Adjective Agreement',
    slideCount: 6,
  },
]

const IT_MODULES: TheoryModule[] = [
  {
    id: 'noun-gender-basics',
    title: 'Noun Gender Basics',
    slideCount: IT_MODULE_1.length,
    slides: IT_MODULE_1,
  },
  {
    id: 'definite-article-singular',
    title: 'Definite Article Singular: il / lo / la / l\'',
    slideCount: 5,
  },
  {
    id: 'plural-articles',
    title: 'Plural Articles: i / gli / le',
    slideCount: 5,
  },
  {
    id: 'contractions',
    title: 'Contractions: del, della, nel, nella…',
    slideCount: 5,
  },
  {
    id: 'adjective-agreement',
    title: 'Adjective Agreement',
    slideCount: 6,
  },
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
