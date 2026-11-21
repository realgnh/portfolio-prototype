import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navItems } from '../../content/navigation'
import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { ThemeToggle } from './ThemeToggle'

function isActive(to: string, pathname: string) {
  if (to.includes('#')) return false
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

/** Top bar: monogram, pill navigation, quick-menu button and theme toggle. */
export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link to="/" className="monogram" aria-label={`${profile.name}, home`}>{profile.initials}<span>.</span></Link>

        <nav className="pill-nav" aria-label="Main navigation" data-open={open}>
          {navItems.map(({ to, label }) => (
            <Link key={to} to={to} aria-current={isActive(to, pathname) ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-button kbd-button" onClick={onOpenMenu} aria-label={sections.commandMenu.label} aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
            <kbd aria-hidden="true">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <ThemeToggle />
          <button type="button" className="icon-button menu-button" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(value => !value)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
