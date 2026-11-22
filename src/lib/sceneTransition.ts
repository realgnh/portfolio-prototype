/**
 * Scene-cut page changes: instead of navigating straight away, we ask the slate
 * (components/layout/SceneSlate.tsx) to wipe across the screen first, switch pages while
 * it fully covers the screen, then wipe off to reveal the new page.
 *
 * Links are handled automatically (SceneSlate listens for clicks on internal links).
 * For navigation in code (Quick search, keyboard shortcuts), call `sceneNavigate(to, navigate)`.
 */
import type { NavigateFunction } from 'react-router-dom'
import { motionAllowed } from './preferences'

/** When the slate fully covers the screen (ms after it starts). Keep in sync with `slate-wipe` in layout.css. */
export const SLATE_COVER_MS = 240

type Request = (to: string) => void
let request: Request | null = null

/** Used by SceneSlate to receive navigation requests. */
export function onSceneRequest(handler: Request) {
  request = handler
  return () => { if (request === handler) request = null }
}

export function sceneNavigate(to: string, navigate: NavigateFunction) {
  const target = new URL(to, window.location.href)
  const samePage = target.pathname === window.location.pathname
  if (!request || !motionAllowed() || samePage) navigate(to)
  else request(to)
}
