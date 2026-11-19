import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { ui } from '../data/site'
import { Footer } from './Footer'
import { PillNav } from './PillNav'
import { ProfileLinks } from './ProfileLinks'

export function Layout() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    main.current?.focus({ preventScroll: true })
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return (
    <>
      <a className="skip-link" href="#main-content">{ui.skip}</a>
      <header className="masthead">
        <PillNav />
        <ProfileLinks className="masthead-links" />
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
