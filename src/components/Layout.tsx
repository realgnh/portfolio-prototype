import { useLayoutEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { site, ui } from '../data/site'
import { Footer } from './Footer'
import { PillNav } from './PillNav'

export function Layout() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)
  const main = useRef<HTMLElement>(null)
  const featuredLink = site.socialLinks.find(link => link.featured)

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
      <header className="masthead">
        <Link to="/" viewTransition className="wordmark">
          <span>{site.name}</span>
          <small>{site.role}</small>
        </Link>
        <PillNav />
        <div className="masthead-links">
          {featuredLink && <a href={featuredLink.href}>{featuredLink.label} <span aria-hidden="true">↗</span></a>}
          <Link to="/#resume" viewTransition>{ui.resume} <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        <div className="route-frame" key={pathname}><Outlet /></div>
      </main>
      <Footer />
    </>
  )
}
