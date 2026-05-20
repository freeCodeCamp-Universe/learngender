import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIN_WORDS = 2000

const languages = [
  { code: 'it', file: 'words_it.json' },
  { code: 'fr', file: 'words_fr.json' },
  { code: 'es', file: 'words_es.json' },
  { code: 'pt', file: 'words_pt.json' },
]

let hasWarning = false

for (const { code, file } of languages) {
  const path = join(__dirname, 'src/data', file)
  const words = JSON.parse(readFileSync(path, 'utf-8'))
  const count = words.length
  if (count < MIN_WORDS) {
    console.warn(`⚠️  ${code.toUpperCase()}: ${count} words (minimum is ${MIN_WORDS} — add ${MIN_WORDS - count} more)`)
    hasWarning = true
  } else {
    console.log(`✓  ${code.toUpperCase()}: ${count} words`)
  }
}

if (hasWarning) {
  console.warn('\nSome word lists are below the minimum. Consider adding more words before deploying.')
}
