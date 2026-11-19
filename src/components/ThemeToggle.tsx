import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { ui } from '../data/site'

type Theme = 'dark' | 'light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const choseTheme = useRef(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    function followSystem(event: MediaQueryListEvent) {
      if (choseTheme.current) return
      try {
        const savedTheme = localStorage.getItem('portfolio-theme')
        if (savedTheme === 'light' || savedTheme === 'dark') return
      } catch {}
      const next = event.matches ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      setTheme(next)
    }
    preference.addEventListener('change', followSystem)
    return () => preference.removeEventListener('change', followSystem)
  }, [])

  const next = theme === 'dark' ? 'light' : 'dark'
  const label = next === 'light' ? ui.switchToLight : ui.switchToDark

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement
    if (root.hasAttribute('data-theme-transition')) return
    choseTheme.current = true
    try {
      localStorage.setItem('portfolio-theme', next)
    } catch {
      // The current theme still works when storage is unavailable.
    }
    function applyTheme() {
      root.dataset.theme = next
      setTheme(next)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme()
      return
    }
    if (!document.startViewTransition) {
      root.setAttribute('data-theme-fallback', '')
      applyTheme()
      return
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    root.style.setProperty('--switch-x', `${x}px`)
    root.style.setProperty('--switch-y', `${y}px`)
    root.style.setProperty('--switch-radius', `${radius}px`)
    root.setAttribute('data-theme-transition', '')

    function reset() {
      root.removeAttribute('data-theme-transition')
      for (const name of ['--switch-x', '--switch-y', '--switch-radius']) root.style.removeProperty(name)
    }
    const transition = document.startViewTransition(() => flushSync(applyTheme))
    void transition.finished.then(reset, reset)
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={label} title={label}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {next === 'light' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
          </>
        ) : <path d="M20.8 15.2A9 9 0 0 1 8.8 3.2a9.1 9.1 0 1 0 12 12Z" />}
      </svg>
    </button>
  )
}
