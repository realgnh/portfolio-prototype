import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { sections } from '../../content/sections'

type Theme = 'light' | 'dark'
const storageKey = 'portfolio-theme'

/** Light/dark switch. Follows the system until the visitor picks one, then remembers it. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    function follow(event: MediaQueryListEvent) {
      try { if (localStorage.getItem(storageKey)) return } catch {}
      apply(event.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  }, [])

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem(storageKey, next) } catch {}
    if (document.startViewTransition) document.startViewTransition(() => flushSync(() => apply(next)))
    else apply(next)
  }

  return (
    <button type="button" className="icon-button" onClick={toggle} aria-label={sections.theme.label} aria-pressed={theme === 'dark'}>
      {theme === 'dark' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  )
}
