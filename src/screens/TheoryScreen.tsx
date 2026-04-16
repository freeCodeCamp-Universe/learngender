import { useEffect, useRef, useState, useCallback } from 'react'
import homeIcon from '../components/icons/home.svg'
import starIcon from '../components/icons/star.svg'
import type { Language } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { THEORY_SLIDES } from '../data/theory'
import type { TheorySlide } from '../data/theory'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']

// Minimal markdown-lite renderer: **bold**, > blockquote, \n\n paragraph breaks
function renderBody(text: string) {
  const paragraphs = text.split('\n\n')
  return paragraphs.map((para, i) => {
    if (para.startsWith('> ')) {
      const inner = para.replace(/^> /gm, '')
      return (
        <blockquote key={i} className="theory-slide__blockquote">
          {renderInline(inner)}
        </blockquote>
      )
    }
    return <p key={i} className="theory-slide__para">{renderInline(para)}</p>
  })
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function SlideView({ slide }: { slide: TheorySlide }) {
  return (
    <div className={`theory-slide theory-slide--${slide.type}`}>
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
            <p className="theory-slide__table-note">{renderInline(slide.table.note)}</p>
          )}
        </div>
      )}

      {slide.note && (
        <p className="theory-slide__note">{renderInline(slide.note)}</p>
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

  // Reset to slide 0 when language changes
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
  const goRef  = useCallback(() => {
    const refSlide = slides.findIndex(s => s.isReference)
    if (refSlide !== -1) goTo(refSlide)
  }, [slides, goTo])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  // Swipe / drag navigation
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

  // Tap left/right edges
  function onSlideClick(e: React.MouseEvent<HTMLDivElement>) {
    if (dragStart.current !== null) return // was a drag, not a tap
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const third = rect.width / 3
    if (x < third) goPrev()
    else if (x > rect.width - third) goNext()
  }

  const slide = slides[index]
  const hasRef = slides.some(s => s.isReference)
  const isAtRef = slide.isReference

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
        onClick={onSlideClick}
      >
        <SlideView key={`${lang}-${index}`} slide={slide} />
      </div>

      {/* Progress dots */}
      <div className="theory-screen__dots" aria-label={`Slide ${index + 1} of ${total}`}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`theory-screen__dot${i === index ? ' theory-screen__dot--active' : ''}${slides[i].isReference ? ' theory-screen__dot--ref' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Reference shortcut */}
      {hasRef && !isAtRef && (
        <button className="theory-screen__ref-btn" onClick={goRef}>
          Reference →
        </button>
      )}

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
