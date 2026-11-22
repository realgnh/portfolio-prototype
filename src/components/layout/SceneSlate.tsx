import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motionAllowed } from '../../lib/preferences'
import { sceneName } from '../../lib/sceneName'

/**
 * Page transition: a quick film-slate wipe showing the new page's name ("WORK"),
 * like a scene cut. Skipped on the first load (the loading screen covers that) and
 * when animations are off. Styles: .slate in layout.css.
 */
export function SceneSlate() {
  const { pathname } = useLocation()
  const first = useRef(true)
  const [cut, setCut] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!motionAllowed()) return
    setCut(current => ({ id: (current?.id ?? 0) + 1, name: sceneName(pathname) }))
  }, [pathname])

  if (!cut) return null
  return (
    <div key={cut.id} className="slate" aria-hidden="true" onAnimationEnd={event => { if (event.animationName === 'slate-wipe') setCut(null) }}>
      <div className="slate-clapper" />
      <p className="slate-name">{cut.name}</p>
    </div>
  )
}
