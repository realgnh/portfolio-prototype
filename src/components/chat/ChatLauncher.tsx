import { lazy, Suspense, useEffect, useState } from 'react'
import { sections } from '../../content/sections'

// The chat panel's code downloads only the first time someone opens it.
const AskPortfolio = lazy(() => import('./AskPortfolio'))

/** Floating "Ask my portfolio" button (bottom-left) and the panel it opens. State lives in Layout. */
export function ChatLauncher({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
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
        <button type="button" className="chat-launcher" data-compact={compact} onClick={onOpen} aria-label={sections.chat.title} title={sections.chat.title} aria-keyshortcuts="A">
          <span aria-hidden="true">✦</span><span className="chat-launcher-label" aria-hidden="true">{sections.chat.title}</span>
        </button>
      )}
      {open && (
        <Suspense fallback={<div className="chat-panel chat-loading" aria-busy="true" />}>
          <AskPortfolio onClose={onClose} />
        </Suspense>
      )}
    </>
  )
}
