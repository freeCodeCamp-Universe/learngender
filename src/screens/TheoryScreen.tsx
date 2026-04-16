import { useEffect, useRef, useState, useCallback } from 'react'
import type { Language } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { THEORY_MODULES, getModuleDone, setModuleDone } from '../data/theoryModules'
import type { TheoryModule } from '../data/theoryModules'
import type { TheorySlide } from '../data/theory'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']

// ─── Inline renderers ────────────────────────────────────────────

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  )
}

function parseExampleLine(line: string) {
  const stripped = line.replace(/^> ?[✓→] ?/, '').trim()
  const dashIdx = stripped.lastIndexOf(' — ')
  if (dashIdx !== -1) return { example: stripped.slice(0, dashIdx), label: stripped.slice(dashIdx + 3), isCheck: line.includes('✓') }
  return { example: stripped, label: '', isCheck: line.includes('✓') }
}

function renderBody(text: string) {
  return text.split('\n\n').map((para, i) => {
    if (para.startsWith('> ')) {
      const lines = para.split('\n')
      return (
        <div key={i} className="theory-slide__example-card">
          {lines.map((line, li) => {
            const { example, label, isCheck } = parseExampleLine(line)
            return (
              <div key={li} className="theory-slide__example-row">
                <div className={`theory-slide__example-icon ${isCheck ? 'theory-slide__example-icon--check' : 'theory-slide__example-icon--arrow'}`}>
                  {isCheck ? '✓' : '→'}
                </div>
                <div className="theory-slide__example-text">
                  {renderInline(example)}
                  {label && <span className="theory-slide__example-label">{label}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )
    }
    if (para.match(/^\*\*(Rule|Confidence|Important|How to|Memory|Rule of thumb)/)) {
      return (
        <div key={i} className="theory-slide__rule-box">
          <p className="theory-slide__rule-text">{renderInline(para)}</p>
        </div>
      )
    }
    return <p key={i} className="theory-slide__body-text">{renderInline(para)}</p>
  })
}

// ─── Slide view ──────────────────────────────────────────────────

function SlideView({ slide, index, total }: { slide: TheorySlide; index: number; total: number }) {
  return (
    <div className={`theory-slide theory-slide--${slide.type}`}>
      <p className="theory-slide__counter">Slide {index + 1} of {total}</p>
      <h2 className="theory-slide__title">{slide.title}</h2>

      {slide.body && <div className="theory-slide__body">{renderBody(slide.body)}</div>}

      {slide.exceptions && (
        <div className="theory-slide__table-wrap">
          <table className="theory-slide__table">
            <thead><tr><th>Word</th><th>Meaning</th><th>Surprise</th></tr></thead>
            <tbody>
              {slide.exceptions.map((ex, i) => (
                <tr key={i}>
                  <td className="theory-slide__table-td--key">
                    <span className={`theory-exception__article--${ex.gender}`}>{ex.article}</span>{' '}{ex.word}
                  </td>
                  <td>{ex.meaning}</td>
                  <td className="theory-slide__table-td--examples">{ex.tag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {slide.table && (
        <div className="theory-slide__table-wrap">
          <table className="theory-slide__table">
            <thead><tr>{slide.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {slide.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.cells.map((cell, ci) => (
                    <td key={ci} className={
                      ci === 0 ? 'theory-slide__table-td--key' :
                      ci === slide.table!.headers.length - 1 ? 'theory-slide__table-td--examples' : ''
                    }>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {slide.table.note && <div className="theory-slide__table-note">{renderInline(slide.table.note)}</div>}
        </div>
      )}
    </div>
  )
}

// ─── Slide viewer ─────────────────────────────────────────────────

interface ViewerProps {
  lang: Language
  module: TheoryModule
  onClose: () => void
  onComplete: () => void
}

function SlideViewer({ lang, module, onClose, onComplete }: ViewerProps) {
  const slides = module.slides!
  const total = slides.length
  const [index, setIndex] = useState(0)
  const refIndex = useRef(0)

  const goTo = useCallback((i: number) => {
    const c = Math.max(0, Math.min(total - 1, i))
    setIndex(c); refIndex.current = c
  }, [total])

  const goNext = useCallback(() => goTo(refIndex.current + 1), [goTo])
  const goPrev = useCallback(() => goTo(refIndex.current - 1), [goTo])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onClose])

  const dragStart = useRef<number | null>(null)
  function onPointerDown(e: React.PointerEvent) { dragStart.current = e.clientX }
  function onPointerUp(e: React.PointerEvent) {
    if (dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(delta) < 50) return
    if (delta < 0) goNext(); else goPrev()
  }

  const atFirst = index === 0
  const atLast = index === total - 1

  function handleNext() {
    if (atLast) {
      setModuleDone(lang, module.id)
      onComplete()
    } else {
      goNext()
    }
  }

  return (
    <div className="theory-viewer">
      {/* Header */}
      <div className="theory-viewer__header">
        <span className="theory-viewer__module-title">{module.title}</span>
        <button className="theory-viewer__close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Slide */}
      <div className="theory-screen__slide-area" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <SlideView key={index} slide={slides[index]} index={index} total={total} />
      </div>

      {/* Footer */}
      <div className="theory-screen__footer">
        <button className="theory-screen__arrow theory-screen__arrow--prev" onClick={goPrev} disabled={atFirst} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="theory-screen__dots">
          {slides.map((_, i) => (
            <button key={i} className={`theory-screen__dot${i === index ? ' theory-screen__dot--active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <button className="theory-screen__arrow theory-screen__arrow--next" onClick={handleNext} aria-label={atLast ? 'Complete' : 'Next'}>
          {atLast
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          }
        </button>
      </div>
    </div>
  )
}

// ─── Module list ──────────────────────────────────────────────────

interface ModuleListProps {
  lang: Language
  onSelect: (module: TheoryModule) => void
  onHome: () => void
  onMyWords: () => void
  onLangChange: (l: Language) => void
  refreshKey: number
}

function ModuleList({ lang, onSelect, onHome, onMyWords, onLangChange, refreshKey }: ModuleListProps) {
  const modules = THEORY_MODULES[lang]

  return (
    <div className="theory-screen">
      <div className="theory-screen__lang-tabs">
        {LANGUAGES.map(l => (
          <button key={l} className={`theory-screen__lang-tab${lang === l ? ' theory-screen__lang-tab--active' : ''}`} onClick={() => onLangChange(l)}>
            <span>{LANGUAGE_LABELS[l].flag}</span>
            <span>{LANGUAGE_LABELS[l].name}</span>
          </button>
        ))}
      </div>

      <div className="theory-module-list" key={refreshKey}>
        {modules.map((mod) => {
          const done = getModuleDone(lang, mod.id)
          const available = !!mod.slides
          return (
            <button
              key={mod.id}
              className={`theory-module-card${!available ? ' theory-module-card--locked' : ''}${done ? ' theory-module-card--done' : ''}`}
              onClick={() => available && onSelect(mod)}
              disabled={!available}
            >
              <div className="theory-module-card__main">
                <span className="theory-module-card__title">{mod.title}</span>
                <span className="theory-module-card__meta">{mod.slideCount} slides{done ? ' · completed ✓' : ''}</span>
              </div>
              <div className="theory-module-card__chevron">
                {available
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                }
              </div>
            </button>
          )
        })}
      </div>

      <div className="theory-screen__bottom-nav">
        <button className="bottom-nav__btn" onClick={onHome} aria-label="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </button>
        <button className="bottom-nav__btn bottom-nav__btn--active" aria-label="Theory">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <span>Theory</span>
        </button>
        <button className="bottom-nav__btn" onClick={onMyWords} aria-label="My Words">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>Words</span>
        </button>
      </div>
    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────

interface TheoryScreenProps {
  onHome: () => void
  onMyWords: () => void
}

export function TheoryScreen({ onHome, onMyWords }: TheoryScreenProps) {
  const [lang, setLang] = useState<Language>('pt')
  const [activeModule, setActiveModule] = useState<TheoryModule | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleComplete() {
    setActiveModule(null)
    setRefreshKey(k => k + 1) // re-render list to show ✓
  }

  if (activeModule) {
    return (
      <SlideViewer
        lang={lang}
        module={activeModule}
        onClose={() => setActiveModule(null)}
        onComplete={handleComplete}
      />
    )
  }

  return (
    <ModuleList
      lang={lang}
      onSelect={setActiveModule}
      onHome={onHome}
      onMyWords={onMyWords}
      onLangChange={setLang}
      refreshKey={refreshKey}
    />
  )
}
