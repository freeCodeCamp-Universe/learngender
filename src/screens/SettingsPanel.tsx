import { useEffect, useState } from 'react'
import type { Settings } from '../types'
import { getSettings, setSettings } from '../lib/storage'

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [settings, setLocalSettings] = useState<Settings>(getSettings)

  function toggle(key: keyof Settings) {
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      setSettings(updated)
      return updated
    })
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div className="settings-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="settings-panel__header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <ul className="settings-list">
          <li className="settings-item">
            <label className="settings-item__label" htmlFor="toggle-sound">
              Sound effects
            </label>
            <button
              id="toggle-sound"
              className={`toggle ${settings.soundEnabled ? 'toggle--on' : 'toggle--off'}`}
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => toggle('soundEnabled')}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </li>

          <li className="settings-item">
            <label className="settings-item__label" htmlFor="toggle-translation">
              Show translation by default
            </label>
            <button
              id="toggle-translation"
              className={`toggle ${settings.showTranslationByDefault ? 'toggle--on' : 'toggle--off'}`}
              role="switch"
              aria-checked={settings.showTranslationByDefault}
              onClick={() => toggle('showTranslationByDefault')}
            >
              {settings.showTranslationByDefault ? 'ON' : 'OFF'}
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}
