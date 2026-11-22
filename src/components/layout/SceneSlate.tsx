import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sceneName } from '../../lib/sceneName'
import { onSceneRequest, SLATE_COVER_MS } from '../../lib/sceneTransition'

/** True for a plain left-click on a link to another page of this site. */
function internalLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return null
  const url = new URL(anchor.href)
  if (url.origin !== window.location.origin || /\.[a-z0-9]+$/i.test(url.pathname)) return null
  if (url.pathname === window.location.pathname) return null // same page (e.g. #section): no slate
  return url.pathname + url.search + url.hash
}

/**
 * Page transition: a film-slate wipe showing the new page's name ("WORK").
 * The slate covers the screen first and only then do we switch pages, so the new page
 * never flashes before the cut (see lib/sceneTransition.ts). Styles: .slate in layout.css.
 */
export function SceneSlate() {
  const navigate = useNavigate()
  const [cut, setCut] = useState<{ id: number; name: string } | null>(null)
  const pending = useRef(0)

  useEffect(() => {
    function start(to: string) {
      window.clearTimeout(pending.current)
      setCut(current => ({ id: (current?.id ?? 0) + 1, name: sceneName(new URL(to, window.location.href).pathname) }))
      pending.current = window.setTimeout(() => navigate(to), SLATE_COVER_MS)
    }
    const stop = onSceneRequest(start)

    // Catch link clicks before React Router does, so the slate can cover the screen first.
    function onClick(event: MouseEvent) {
      const to = internalLink(event)
      if (!to || document.documentElement.dataset.motion === 'off') return
      event.preventDefault()
      start(to)
    }
    window.addEventListener('click', onClick, true)
    return () => { stop(); window.removeEventListener('click', onClick, true); window.clearTimeout(pending.current) }
  }, [navigate])

  if (!cut) return null
  return (
    <div key={cut.id} className="slate" aria-hidden="true" onAnimationEnd={event => { if (event.animationName === 'slate-wipe') setCut(null) }}>
      <div className="slate-clapper" />
      <p className="slate-name">{cut.name}</p>
    </div>
  )
}
