import { lazy, Suspense, useEffect, useState } from 'react'
import { sections } from '../../content/sections'

// The chat panel's code downloads only the first time someone opens it.
const AskPortfolio = lazy(() => import('./AskPortfolio'))

type Props = { open: boolean; onOpen: () => void; onClose: () => void; onShortcuts: () => void }

/**
 * Floating buttons at the bottom-left: "Ask my portfolio" (opens the chat panel) and a small
 * keyboard button that opens the shortcuts list. State lives in Layout.
 */
export function ChatLauncher({ open, onOpen, onClose, onShortcuts }: Props) {
  // Shrinks to a small round button once you scroll down, so it doesn't cover the page.
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const update = () => setCompact(window.scrollY > 400)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <>
      {!open && (
        <div className="floating-actions">
          <button type="button" className="chat-launcher" data-compact={compact} onClick={onOpen} aria-label={sections.chat.title} title={sections.chat.title} aria-keyshortcuts="A">
            <span className="chat-launcher-short" aria-hidden="true">{sections.chat.short}</span>
            <span className="chat-launcher-label" aria-hidden="true">{sections.chat.rest}</span>
          </button>
          <button type="button" className="shortcuts-button" onClick={onShortcuts} aria-label={sections.shortcuts.title} title={sections.shortcuts.title}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7.5 14h9" />
            </svg>
            <kbd className="shortcuts-key" aria-hidden="true">?</kbd>
          </button>
        </div>
      )}
      {open && (
        <Suspense fallback={<div className="chat-panel chat-loading" aria-busy="true" />}>
          <AskPortfolio onClose={onClose} />
        </Suspense>
      )}
    </>
  )
}
