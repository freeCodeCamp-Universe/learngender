import { useEffect, useRef, useState, useCallback } from 'react'
import homeIcon from '../components/icons/home.svg'
import starIcon from '../components/icons/star.svg'
import type { Language } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { THEORY_SLIDES } from '../data/theory'
import type { TheorySlide } from '../data/theory'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']

// Render **bold** inline
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

// Parse a "> ✓ **o** livro (the book) — masculine" line into parts
function parseExampleLine(line: string) {
  // Remove leading "> " and "✓ "
  const stripped = line.replace(/^> ?✓ ?/, '').trim()
  // Split on " — " to extract gender label
  const dashIdx = stripped.lastIndexOf(' — ')
  if (dashIdx !== -1) {
    const example = stripped.slice(0, dashIdx)
    const label = stripped.slice(dashIdx + 3)
    return { example, label }
  }
  return { example: stripped, label: '' }
}

function renderBody(text: string) {
  const paragraphs = text.split('\n\n')
  return paragraphs.map((para, i) => {
    // Blockquote block — lines starting with "> "
    if (para.startsWith('> ')) {
      const lines = para.split('\n')
      // Check if lines are example items (contain ✓)
      const isExamples = lines.every(l => l.includes('✓'))
      if (isExamples) {
        return (
          <div key={i} className="theory-slide__examples">
            {lines.map((line, li) => {
              const { example, label } = parseExampleLine(line)
              return (
                <div key={li} className="theory-slide__example-row">
                  <span className="theory-slide__check">✓</span>
                  <span className="theory-slide__example-text">{renderInline(example)}</span>
                  {label && <span className="theory-slide__example-label">{label}</span>}
                </div>
              )
            })}
          </div>
        )
      }
      // Generic blockquote (list of words, no ✓)
      const inner = para.replace(/^> /gm, '')
      return (
        <blockquote key={i} className="theory-slide__blockquote">
          {renderInline(inner)}
        </blockquote>
      )
    }

    // Rule callout — paragraphs starting with **Rule
    if (para.startsWith('**Rule')) {
      return (
        <div key={i} className="theory-slide__rule-callout">
          <p className="theory-slide__para">{renderInline(para)}</p>
        </div>
      )
    }

    // Memory trick callout
    if (para.startsWith('**Memory') || para.startsWith('**How to') || para.startsWith('**Rule of thumb')) {
      return (
        <div key={i} className="theory-slide__tip-callout">
          <p className="theory-slide__para">{renderInline(para)}</p>
        </div>
      )
    }

    return <p key={i} className="theory-slide__para">{renderInline(para)}</p>
  })
}

function SlideView({ slide, index, total }: { slide: TheorySlide; index: number; total: number }) {
  return (
    <div className={`theory-slide theory-slide--${slide.type}`}>
      <p className="theory-slide__counter">Slide {index + 1} of {total}</p>
      <h2 className="theory-slide__title">{slide.title}</h2>

      {slide.body && (
        <div className="theory-slide__body">
          {renderBody(slide.body)}
        </div>
      )}

      {slide.table && (
        <div className="theory-slide__table-wrap">
          <table className="theory-slide__table">
            <thead>
              <tr>
                {slide.table.headers.map((h, i) => (
                  <th key={i}>{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slide.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.cells.map((cell, ci) => (
                    <td key={ci}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {slide.table.note && (
            <div className="theory-slide__table-note">{renderInline(slide.table.note)}</div>
          )}
        </div>
      )}
    </div>
  )
}

interface TheoryScreenProps {
  onHome: () => void
  onMyWords: () => void
}

export function TheoryScreen({ onHome, onMyWords }: TheoryScreenProps) {
  const [lang, setLang] = useState<Language>('pt')
  const [index, setIndex] = useState(0)
  const slides = THEORY_SLIDES[lang]
  const total = slides.length
  const refIndex = useRef(index)

  useEffect(() => {
    setIndex(0)
    refIndex.current = 0
  }, [lang])

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i))
    setIndex(clamped)
    refIndex.current = clamped
  }, [total])

  const goNext = useCallback(() => goTo(refIndex.current + 1), [goTo])
  const goPrev = useCallback(() => goTo(refIndex.current - 1), [goTo])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  // Swipe
  const dragStart = useRef<number | null>(null)
  const SWIPE_THRESHOLD = 50

  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = e.clientX
  }

  function onPointerUp(e: React.PointerEvent) {
    if (dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    if (delta < 0) goNext()
    else goPrev()
  }

  const slide = slides[index]
  const atFirst = index === 0
  const atLast  = index === total - 1

  return (
    <div className="theory-screen">
      {/* Language tabs */}
      <div className="theory-screen__lang-tabs">
        {LANGUAGES.map(l => (
          <button
            key={l}
            className={`theory-screen__lang-tab${lang === l ? ' theory-screen__lang-tab--active' : ''}`}
            onClick={() => setLang(l)}
          >
            {LANGUAGE_LABELS[l].flag} {LANGUAGE_LABELS[l].name}
          </button>
        ))}
      </div>

      {/* Slide area */}
      <div
        className="theory-screen__slide-area"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <SlideView key={`${lang}-${index}`} slide={slide} index={index} total={total} />
      </div>

      {/* Nav row: ← dots → */}
      <div className="theory-screen__nav">
        <button
          className="theory-screen__nav-arrow theory-screen__nav-arrow--prev"
          onClick={goPrev}
          disabled={atFirst}
          aria-label="Previous slide"
        >
          ←
        </button>

        <div className="theory-screen__dots">
          {slides.map((s, i) => (
            <button
              key={i}
              className={`theory-screen__dot${i === index ? ' theory-screen__dot--active' : ''}${s.isReference ? ' theory-screen__dot--ref' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="theory-screen__nav-arrow theory-screen__nav-arrow--next"
          onClick={goNext}
          disabled={atLast}
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      {/* Bottom nav */}
      <div className="theory-screen__bottom-nav">
        <button className="bottom-nav__btn" onClick={onHome} aria-label="Home">
          <img src={homeIcon} alt="" width="22" height="22" className="bottom-nav__icon bottom-nav__icon--home" />
          <span>Home</span>
        </button>
        <button className="bottom-nav__btn bottom-nav__btn--active" aria-label="Theory">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
          <span>Theory</span>
        </button>
        <button className="bottom-nav__btn" onClick={onMyWords} aria-label="My Words">
          <img src={starIcon} alt="" width="22" height="22" className="bottom-nav__icon" />
          <span>Words</span>
        </button>
      </div>
    </div>
  )
}
