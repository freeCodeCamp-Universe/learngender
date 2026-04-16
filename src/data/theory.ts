// Type definitions only — slide content lives in theory-pt.ts, theory-es.ts, etc.

export interface TableRow {
  cells: string[]
}

export interface ExceptionItem {
  article: string
  word: string
  meaning: string
  tag: string
  gender: 'masculine' | 'feminine'
}

export interface TheorySlide {
  title: string
  type: 'intro' | 'table' | 'pattern' | 'exceptions' | 'cheatsheet'
  body?: string
  table?: {
    headers: string[]
    rows: TableRow[]
    note?: string
  }
  exceptions?: ExceptionItem[]
  isReference?: boolean
}
