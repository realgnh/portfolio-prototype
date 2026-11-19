import { useLayoutEffect, useRef } from 'react'
import { Link, useMatch, useLocation } from 'react-router-dom'
import { site, ui } from '../data/site'
import { ThemeToggle } from './ThemeToggle'

export function PillNav() {
  const projects = useMatch('/projects/*')
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const activePath = projects ? '/projects' : pathname

  useLayoutEffect(() => {
    const nav = navRef.current
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!nav || !active) return

    function align() {
      if (!nav || !active) return
      nav.style.setProperty('--tab-left', `${active.offsetLeft}px`)
      nav.style.setProperty('--tab-width', `${active.offsetWidth}px`)
    }
    align()
    const observer = new ResizeObserver(align)
    observer.observe(nav)
    observer.observe(active)
    return () => observer.disconnect()
  }, [activePath])

  return (
    <nav className="pill-nav" ref={navRef} aria-label={ui.navigation}>
      <span className="pill-indicator" aria-hidden="true" />
      {site.navItems.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          aria-current={activePath === to ? 'page' : undefined}
        >
          <span>{label}</span>
        </Link>
      ))}
      <ThemeToggle />
    </nav>
  )
}
