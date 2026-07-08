import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language, Settings, ThemePref } from '../types'
import { LANGUAGE_LABELS } from '../types'
import { getSettings, resetLanguageProgress, resetProgress, setSettings } from '../lib/storage'
import { applyThemeFromSettings } from '../lib/theme'

const THEME_OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

interface SettingsPanelProps {
  onClose: () => void
}

type SettingsView = 'settings' | 'keybinds' | 'reset' | 'confirm-reset'

// What a pending reset will clear: a single language, or every language.
type ResetTarget = Language | 'all'

const LANGUAGES: Language[] = ['pt', 'es', 'fr', 'it']

const VIEW_TITLES: Record<SettingsView, string> = {
  settings: 'Settings',
  keybinds: 'Keybinds',
  reset: 'Reset progress',
  'confirm-reset': 'Confirm reset',
}

const KEYBIND_SECTIONS = [
  {
    title: 'Navigation',
    items: [
      { keys: 'Tab', description: 'Move to the next button or control' },
      { keys: 'Shift + Tab', description: 'Move to the previous button or control' },
      { keys: 'Enter / Space', description: 'Activate the focused button or toggle' },
    ],
  },
  {
    title: 'Game',
    items: [
      { keys: 'Left Arrow', description: 'Answer feminine on the active card' },
      { keys: 'Right Arrow', description: 'Answer masculine on the active card' },
      { keys: 'T', description: 'Toggle translation on the active card' },
    ],
  },
  {
    title: 'Dialogs',
    items: [
      { keys: 'Escape', description: 'Close the settings panel' },
    ],
  },
]

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [settings, setLocalSettings] = useState<Settings>(getSettings)
  const [view, setView] = useState<SettingsView>('settings')
  const [resetTarget, setResetTarget] = useState<ResetTarget | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  // Remember what had focus before the panel opened so we can restore it on close
  useEffect(() => {
    triggerRef.current = document.activeElement
    return () => {
      (triggerRef.current as HTMLElement | null)?.focus()
    }
  }, [])

  function toggle(key: 'soundEnabled' | 'hapticsEnabled' | 'showTranslationByDefault') {
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      setSettings(updated)
      return updated
    })
  }

  function setThemePref(theme: ThemePref) {
    setLocalSettings((prev) => {
      const updated = { ...prev, theme }
      setSettings(updated)
      applyThemeFromSettings() // instant preview
      return updated
    })
  }

  const closeWithAnimation = useCallback(function closeWithAnimation() {
    setIsClosing(true)
  }, [])

  function startReset(target: ResetTarget) {
    setResetTarget(target)
    setView('confirm-reset')
  }

  function confirmReset() {
    if (resetTarget === 'all') {
      resetProgress()
    } else if (resetTarget) {
      resetLanguageProgress(resetTarget)
    }
    // Reload so every screen re-reads storage and reflects the cleared progress.
    window.location.reload()
  }

  // Step back one level: confirm → reset menu, everything else → settings.
  function goBack() {
    setView(view === 'confirm-reset' ? 'reset' : 'settings')
  }

  // Focus first button on open and when view changes
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()
  }, [view])

  // Escape + focus trap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeWithAnimation(); return }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled])'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeWithAnimation])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`settings-backdrop${isClosing ? ' settings-backdrop--closing' : ''}`}
        onClick={closeWithAnimation}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id="settings-panel"
        className={`settings-panel${isClosing ? ' settings-panel--closing' : ''}`}
        role={view === 'confirm-reset' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-label={VIEW_TITLES[view]}
        aria-describedby={view === 'confirm-reset' ? 'confirm-reset-desc' : undefined}
        onAnimationEnd={() => {
          if (isClosing) onClose()
        }}
      >
        <div className="settings-panel__header">
          <div className="settings-panel__header-title">
            {view !== 'settings' && (
              <button
                className="icon-btn"
                onClick={goBack}
                aria-label={view === 'confirm-reset' ? 'Back to reset options' : 'Back to settings'}
              >
                ←
              </button>
            )}
            <h2>{VIEW_TITLES[view]}</h2>
          </div>
          <button className="icon-btn" onClick={closeWithAnimation} aria-label="Close settings">
            ✕
          </button>
        </div>

        {view === 'settings' ? (
          <ul className="settings-list">
            <li className="settings-item settings-item--stack">
              <span className="settings-item__label" id="theme-label">
                Appearance
              </span>
              <div className="segmented" role="radiogroup" aria-labelledby="theme-label">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={settings.theme === opt.value}
                    className={`segmented__option${settings.theme === opt.value ? ' segmented__option--active' : ''}`}
                    onClick={() => setThemePref(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </li>

            <li className="settings-item">
              <span className="settings-item__label" id="toggle-sound-label">
                Sound effects
              </span>
              <button
                id="toggle-sound"
                className={`toggle ${settings.soundEnabled ? 'toggle--on' : 'toggle--off'}`}
                role="switch"
                aria-checked={settings.soundEnabled}
                aria-labelledby="toggle-sound-label"
                onClick={() => toggle('soundEnabled')}
              >
                {settings.soundEnabled ? 'ON' : 'OFF'}
              </button>
            </li>

            <li className="settings-item">
              <span className="settings-item__label" id="toggle-haptics-label">
                Haptics
              </span>
              <button
                id="toggle-haptics"
                className={`toggle ${settings.hapticsEnabled ? 'toggle--on' : 'toggle--off'}`}
                role="switch"
                aria-checked={settings.hapticsEnabled}
                aria-labelledby="toggle-haptics-label"
                onClick={() => toggle('hapticsEnabled')}
              >
                {settings.hapticsEnabled ? 'ON' : 'OFF'}
              </button>
            </li>

            <li className="settings-item">
              <span className="settings-item__label" id="toggle-translation-label">
                Show translation by default
              </span>
              <button
                id="toggle-translation"
                className={`toggle ${settings.showTranslationByDefault ? 'toggle--on' : 'toggle--off'}`}
                role="switch"
                aria-checked={settings.showTranslationByDefault}
                aria-labelledby="toggle-translation-label"
                onClick={() => toggle('showTranslationByDefault')}
              >
                {settings.showTranslationByDefault ? 'ON' : 'OFF'}
              </button>
            </li>

            <li className="settings-item settings-item--nav">
              <span className="settings-item__label" id="keybinds-link-label">Keyboard shortcuts</span>
              <button
                className="settings-link-btn"
                aria-labelledby="keybinds-link-label keybinds-link-open"
                onClick={() => setView('keybinds')}
              >
                <span id="keybinds-link-open">Open</span>
              </button>
            </li>

            <li className="settings-item settings-item--nav">
              <span className="settings-item__label" id="reset-link-label">Reset progress</span>
              <button
                className="settings-link-btn"
                aria-labelledby="reset-link-label reset-link-open"
                onClick={() => setView('reset')}
              >
                <span id="reset-link-open">Open</span>
              </button>
            </li>
          </ul>
        ) : view === 'reset' ? (
          <div className="reset-menu">
            <p className="reset-menu__intro">
              Reset one language or everything. Your settings are kept.
            </p>
            <ul className="settings-list">
              {LANGUAGES.map((lang) => (
                <li key={lang} className="settings-item settings-item--nav">
                  <span className="settings-item__label" id={`reset-${lang}-label`}>
                    {LANGUAGE_LABELS[lang].name}
                  </span>
                  <button
                    className="settings-danger-btn"
                    aria-labelledby={`reset-${lang}-label reset-${lang}-action`}
                    onClick={() => startReset(lang)}
                  >
                    <span id={`reset-${lang}-action`}>Reset</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="settings-danger-btn settings-danger-btn--block"
              onClick={() => startReset('all')}
            >
              Reset everything
            </button>
          </div>
        ) : view === 'confirm-reset' ? (
          <div className="confirm-reset">
            <p className="confirm-reset__text" id="confirm-reset-desc">
              {resetTarget === 'all' ? (
                <>
                  This clears <strong>all progress in every language</strong>: scores, levels,
                  streak, and word mastery. Settings are kept. You can't undo this.
                </>
              ) : (
                <>
                  This clears your{' '}
                  <strong>{resetTarget ? LANGUAGE_LABELS[resetTarget].name : ''}</strong> score, level,
                  and word mastery. Your streak, other languages, and settings are kept. You can't undo this.
                </>
              )}
            </p>
            <div className="confirm-reset__actions">
              <button className="settings-link-btn" onClick={() => setView('reset')}>
                Cancel
              </button>
              <button className="settings-danger-btn" onClick={confirmReset}>
                {resetTarget === 'all'
                  ? 'Reset everything'
                  : `Reset ${resetTarget ? LANGUAGE_LABELS[resetTarget].name : ''}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="keybinds-panel">
            {KEYBIND_SECTIONS.map((section) => (
              <section key={section.title} className="keybinds-section">
                <h3 className="keybinds-section__title">{section.title}</h3>
                <ul className="keybinds-list">
                  {section.items.map((item) => (
                    <li key={`${section.title}-${item.keys}`} className="keybinds-item">
                      <span className="keybinds-item__keys">{item.keys}</span>
                      <span className="keybinds-item__description">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
