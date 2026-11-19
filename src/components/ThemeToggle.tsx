import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { ui } from '../data/site'

type Theme = 'dark' | 'light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const choseTheme = useRef(false)
  const frame = useRef(0)
  const blend = useRef(theme === 'dark' ? 1 : 0)
  const activeTransition = useRef<ViewTransition | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    function followSystem(event: MediaQueryListEvent) {
      if (choseTheme.current) return
      try {
        const savedTheme = localStorage.getItem('portfolio-theme')
        if (savedTheme === 'light' || savedTheme === 'dark') return
      } catch {}
      const next = event.matches ? 'dark' : 'light'
      root.dataset.theme = next
      blend.current = event.matches ? 1 : 0
      setTheme(next)
    }
    preference.addEventListener('change', followSystem)
    return () => {
      preference.removeEventListener('change', followSystem)
      cancelAnimationFrame(frame.current)
      activeTransition.current?.skipTransition()
      root.style.removeProperty('--theme-blend')
    }
  }, [])

  function toggle() {
    if (activeTransition.current) return
    const root = document.documentElement
    const next = theme === 'dark' ? 'light' : 'dark'
    const from = blend.current
    const to = next === 'dark' ? 1 : 0
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 780
    let started: number | undefined

    choseTheme.current = true
    try {
      localStorage.setItem('portfolio-theme', next)
    } catch {}

    function applyTheme() {
      root.dataset.theme = next
      setTheme(next)
    }

    if (document.startViewTransition && document.visibilityState === 'visible') {
      const transition = document.startViewTransition(() => {
        blend.current = to
        flushSync(applyTheme)
      })
      activeTransition.current = transition
      const reset = () => { activeTransition.current = null }
      void transition.ready.catch(() => {})
      void transition.finished.then(reset, reset)
      return
    }

    cancelAnimationFrame(frame.current)
    root.style.setProperty('--theme-blend', from.toFixed(3))
    applyTheme()

    function animate(now: number) {
      started ??= now
      const progress = Math.min((now - started) / duration, 1)
      const eased = progress * progress * (3 - 2 * progress)
      blend.current = Math.round((from + (to - from) * eased) * 1000) / 1000
      if (progress < 1) {
        root.style.setProperty('--theme-blend', blend.current.toFixed(3))
        frame.current = requestAnimationFrame(animate)
      } else {
        root.style.removeProperty('--theme-blend')
        frame.current = 0
      }
    }

    frame.current = requestAnimationFrame(animate)
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={ui.darkMode}
      aria-pressed={theme === 'dark'}
    >
      <svg className="theme-sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
      <svg className="theme-moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 15.2A9 9 0 0 1 8.8 3.2a9.1 9.1 0 1 0 12 12Z" />
      </svg>
      <span className="theme-label" aria-hidden="true">{theme === 'dark' ? ui.lightTheme : ui.darkTheme}</span>
    </button>
  )
}
