import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { sections } from '../../content/sections'
import type { ShortcutAction } from '../../content/shortcuts'
import { toggleMotion, toggleTheme } from '../../lib/preferences'
import { useSectionReveal } from '../../lib/reveal'
import { smoothScrollTo } from '../../lib/smoothScroll'
import { ToastProvider } from '../../lib/toast'
import { useShortcuts } from '../../lib/useShortcuts'
import { ChatLauncher } from '../chat/ChatLauncher'
import { CommandMenu } from './CommandMenu'
import { EasterEgg } from './EasterEgg'
import { Footer } from './Footer'
import { Header } from './Header'
import { LoadingScreen } from './LoadingScreen'
import { RouteProgress } from './RouteProgress'
import { ShortcutsHelp } from './ShortcutsHelp'

/**
 * The frame around every page: loading screen, header, main content, footer, Quick search,
 * Ask my portfolio, the keyboard-shortcut cheat sheet, the easter egg and toasts.
 */
export function Layout() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)
  const main = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  useSectionReveal(frame, pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const focusBeforeMenu = useRef<HTMLElement | null>(null)
  const menuIsOpen = useRef(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const navigate = useNavigate()

  // Remember what had focus before Quick search opened, and put it back when it closes.
  function openMenu() {
    focusBeforeMenu.current = document.activeElement as HTMLElement | null
    menuIsOpen.current = true
    setMenuOpen(true)
  }
  function closeMenu() {
    menuIsOpen.current = false
    setMenuOpen(false)
    // Only hand focus back if Quick search wasn't reopened in the meantime.
    requestAnimationFrame(() => { if (!menuIsOpen.current) focusBeforeMenu.current?.focus() })
  }

  // Keyboard shortcuts (src/content/shortcuts.ts).
  const runShortcut = useCallback((action: ShortcutAction) => {
    if (action.type === 'go') navigate(action.to)
    else if (action.type === 'theme') toggleTheme()
    else if (action.type === 'motion') toggleMotion()
    else if (action.type === 'search') openMenu()
    else if (action.type === 'ask') setChatOpen(true)
    else if (action.type === 'help') setHelpOpen(open => !open)
    else if (action.type === 'top') smoothScrollTo(0)
  }, [navigate])
  useShortcuts(runShortcut)

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
        if (menuIsOpen.current) closeMenu()
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
        <div className="route-frame" key={pathname} ref={frame}><Outlet /></div>
      </main>
      <Footer />
      {menuOpen && <CommandMenu onClose={closeMenu} onAsk={() => setChatOpen(true)} onShortcuts={() => setHelpOpen(true)} />}
      {helpOpen && <ShortcutsHelp onClose={() => setHelpOpen(false)} />}
      <ChatLauncher open={chatOpen} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} onShortcuts={() => setHelpOpen(true)} />
      <EasterEgg />
    </ToastProvider>
  )
}
