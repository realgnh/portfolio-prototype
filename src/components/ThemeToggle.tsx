import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { ui } from '../data/site'

type Theme = 'dark' | 'light'

const bands = Array.from({ length: 25 }, (_, index) => Math.min(index, 24 - index))

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const [target, setTarget] = useState<Theme | null>(null)
  const choseTheme = useRef(false)
  const mask = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!target) return
    let cancelled = false
    const animations = mask.current?.getAnimations?.({ subtree: true }) ?? []
    if (!mask.current?.getAnimations) {
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 140 : 420
      const timeout = window.setTimeout(() => {
        applyTheme(target)
        setTarget(null)
      }, duration)
      return () => window.clearTimeout(timeout)
    }
    void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      if (cancelled) return
      applyTheme(target)
      setTarget(null)
    })
    return () => { cancelled = true }
  }, [target])

  function applyTheme(next: Theme) {
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  function toggle() {
    if (target) return
    const next = theme === 'dark' ? 'light' : 'dark'
    choseTheme.current = true
    try {
      localStorage.setItem('portfolio-theme', next)
    } catch {}

    setTarget(next)
  }

  const preview = target ?? theme

  return (
    <>
      <button
        className="theme-toggle"
        type="button"
        onClick={toggle}
        aria-label={ui.darkMode}
        aria-pressed={theme === 'dark'}
        data-preview-theme={preview}
      >
        <svg className="theme-sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </svg>
        <svg className="theme-moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.8 15.2A9 9 0 0 1 8.8 3.2a9.1 9.1 0 1 0 12 12Z" />
        </svg>
        <span className="theme-label" aria-hidden="true">{preview === 'dark' ? ui.lightTheme : ui.darkTheme}</span>
      </button>
      {target && createPortal(
        <div className="theme-mask" data-theme-target={target} ref={mask} aria-hidden="true">
          {bands.map((delay, index) => <div key={index} style={{ '--i': delay } as CSSProperties} />)}
        </div>,
        document.body,
      )}
    </>
  )
}
