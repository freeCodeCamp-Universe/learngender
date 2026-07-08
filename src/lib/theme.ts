import { useEffect, useState } from 'react'
import type { ThemePref } from '../types'
import { getSettings } from './storage'

// Resolve a stored preference to a concrete theme. 'system' follows the OS.
export function resolveTheme(pref: ThemePref): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Read the current preference from settings and apply the resolved theme to
// <html data-theme>. Safe to call anytime — SettingsPanel calls it on change,
// App calls it on mount.
export function applyThemeFromSettings(): void {
  document.documentElement.dataset.theme = resolveTheme(getSettings().theme)
}

// Keep one always-on listener for OS scheme changes. It re-applies from
// settings, which is a no-op unless the preference is 'system'. Returns a
// cleanup function.
export function startThemeSync(): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => applyThemeFromSettings()
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

// Reactively read the resolved theme from <html data-theme>. Updates whenever
// the attribute changes (settings toggle or OS change), so components like the
// mountain scene re-render immediately.
export function useResolvedTheme(): 'light' | 'dark' {
  const read = (): 'light' | 'dark' =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(read)
  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => setTheme(read()))
    obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
    setTheme(read())
    return () => obs.disconnect()
  }, [])
  return theme
}
