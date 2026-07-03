import { useCallback, useEffect, useRef, useState } from 'react'
import type { Settings } from '../types'
import { getSettings, setSettings } from '../lib/storage'

interface SettingsPanelProps {
  onClose: () => void
}

type SettingsView = 'settings' | 'keybinds'

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

  function toggle(key: keyof Settings) {
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      setSettings(updated)
      return updated
    })
  }

  const closeWithAnimation = useCallback(function closeWithAnimation() {
    setIsClosing(true)
  }, [])

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
        role="dialog"
        aria-modal="true"
        aria-label={view === 'settings' ? 'Settings' : 'Keybinds'}
        onAnimationEnd={() => {
          if (isClosing) onClose()
        }}
      >
        <div className="settings-panel__header">
          <div className="settings-panel__header-title">
            {view === 'keybinds' && (
              <button className="icon-btn" onClick={() => setView('settings')} aria-label="Back to settings">
                ←
              </button>
            )}
            <h2>{view === 'settings' ? 'Settings' : 'Keybinds'}</h2>
          </div>
          <button className="icon-btn" onClick={closeWithAnimation} aria-label="Close settings">
            ✕
          </button>
        </div>

        {view === 'settings' ? (
          <ul className="settings-list">
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
          </ul>
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
