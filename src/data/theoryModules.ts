import type { Language } from '../types'
import type { TheorySlide } from './theory'
import { THEORY_SLIDES } from './theory'

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
    slideCount: THEORY_SLIDES.pt.length,
    slides: THEORY_SLIDES.pt,
  },
  {
    id: 'indefinite-article-singular',
    title: 'Indefinite Article Singular: um / uma',
    slideCount: 4,
  },
  {
    id: 'plural-articles',
    title: 'Plural Articles: os / as / uns / umas',
    slideCount: 5,
  },
  {
    id: 'contractions',
    title: 'Contractions: do, da, no, na…',
    slideCount: 5,
  },
  {
    id: 'adjective-agreement',
    title: 'Adjective Agreement',
    slideCount: 6,
  },
]

const ES_MODULES: TheoryModule[] = [
  {
    id: 'noun-gender-basics',
    title: 'Noun Gender Basics',
    slideCount: THEORY_SLIDES.es.length,
    slides: THEORY_SLIDES.es,
  },
  {
    id: 'indefinite-article-singular',
    title: 'Indefinite Article Singular: un / una',
    slideCount: 4,
  },
  {
    id: 'plural-articles',
    title: 'Plural Articles: los / las / unos / unas',
    slideCount: 5,
  },
  {
    id: 'contractions',
    title: 'Contractions: del, al',
    slideCount: 3,
  },
  {
    id: 'adjective-agreement',
    title: 'Adjective Agreement',
    slideCount: 6,
  },
]

const FR_MODULES: TheoryModule[] = [
  {
    id: 'noun-gender-basics',
    title: 'Noun Gender Basics',
    slideCount: THEORY_SLIDES.fr.length,
    slides: THEORY_SLIDES.fr,
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
    slideCount: THEORY_SLIDES.it.length,
    slides: THEORY_SLIDES.it,
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
