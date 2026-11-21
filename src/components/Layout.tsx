import { useLayoutEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { site, ui } from '../data/site'
import { Footer } from './Footer'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)
  const main = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const changed = previousPath.current !== pathname
    previousPath.current = pathname
    if (changed) main.current?.focus({ preventScroll: true })
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else if (changed && navigationType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, navigationType])

  return (
    <>
      <a className="skip-link" href="#main-content">{ui.skip}</a>
      <header className="masthead shell">
        <Link to="/" className="wordmark label" aria-label={`${site.name}, ${site.masthead}`}>
          {site.initials} / {site.masthead}
        </Link>
        <nav className="site-nav" aria-label={ui.navigation}>
          {site.navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className="label">{label}</NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        <div className="route-frame" key={pathname}><Outlet /></div>
      </main>
      <Footer />
    </>
  )
}
