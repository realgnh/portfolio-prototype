import { useEffect, useLayoutEffect, useRef } from 'react'
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

  useEffect(() => {
    let pressed: Element | null = null

    function release(event?: PointerEvent) {
      if (event && (event.pointerType !== 'touch' || !event.isPrimary)) return
      pressed?.removeAttribute('data-touch-pressed')
      pressed = null
    }

    function press(event: PointerEvent) {
      if (event.pointerType !== 'touch' || !event.isPrimary || !(event.target instanceof Element)) return
      release()
      pressed = event.target.closest('a, button, summary')
      pressed?.setAttribute('data-touch-pressed', '')
    }

    document.addEventListener('pointerdown', press)
    document.addEventListener('pointerup', release)
    document.addEventListener('pointercancel', release)
    return () => {
      release()
      document.removeEventListener('pointerdown', press)
      document.removeEventListener('pointerup', release)
      document.removeEventListener('pointercancel', release)
    }
  }, [])

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
        <Link to="/" className="wordmark">
          <span>{site.name}</span>
          <small>{site.role}</small>
        </Link>
        <PillNav />
        <div className="masthead-links">
          {featuredLink && <a href={featuredLink.href}>{featuredLink.label} <span aria-hidden="true">↗</span></a>}
          <Link to="/#resume">{ui.resume} <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        <div className="route-frame" key={pathname}><Outlet /></div>
      </main>
      <Footer />
    </>
  )
}
