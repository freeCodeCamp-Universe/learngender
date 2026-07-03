import type { KeyboardEvent } from 'react'

export function handleTabListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'))
  const currentIndex = tabs.indexOf(document.activeElement as HTMLElement)
  if (currentIndex === -1) return
  e.preventDefault()
  const nextIndex = e.key === 'ArrowRight'
    ? (currentIndex + 1) % tabs.length
    : (currentIndex - 1 + tabs.length) % tabs.length
  tabs[nextIndex].focus()
  tabs[nextIndex].click()
}
