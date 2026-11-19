import { Link, useMatch, useLocation } from 'react-router-dom'
import { site, ui } from '../data/site'
import { ThemeToggle } from './ThemeToggle'

export function PillNav() {
  const caseStudy = useMatch('/work/:slug')
  const { pathname } = useLocation()
  return (
    <nav className="pill-nav" aria-label={ui.navigation}>
      {site.navItems.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          viewTransition
          aria-current={pathname === to || (to === '/' && caseStudy) ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
      <ThemeToggle />
    </nav>
  )
}
