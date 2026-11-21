import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { sections } from '../../content/sections'
import { ToastProvider } from '../../lib/toast'
import { CommandMenu } from './CommandMenu'
import { Footer } from './Footer'
import { Header } from './Header'
import { LoadingScreen } from './LoadingScreen'
import { RouteProgress } from './RouteProgress'

/** The frame around every page: loading screen, header, main content, footer, quick search and toasts. */
export function Layout() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)
  const main = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const focusBeforeMenu = useRef<HTMLElement | null>(null)

  // Remember what had focus before Quick search opened, and put it back when it closes.
  function openMenu() {
    focusBeforeMenu.current = document.activeElement as HTMLElement | null
    setMenuOpen(true)
  }
  function closeMenu() {
    setMenuOpen(false)
    requestAnimationFrame(() => focusBeforeMenu.current?.focus())
  }

  useLayoutEffect(() => {
    const changed = previousPath.current !== pathname
    previousPath.current = pathname
    if (changed) main.current?.focus({ preventScroll: true })
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else if (changed && navigationType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, navigationType])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (document.querySelector('.command-menu')) closeMenu()
        else openMenu()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <ToastProvider>
      <LoadingScreen />
      <RouteProgress />
      <a className="skip-link" href="#main-content">{sections.skip}</a>
      <Header onOpenSearch={openMenu} />
      <main id="main-content" ref={main} tabIndex={-1}>
        <div className="route-frame" key={pathname}><Outlet /></div>
      </main>
      <Footer />
      {menuOpen && <CommandMenu onClose={closeMenu} />}
    </ToastProvider>
  )
}
