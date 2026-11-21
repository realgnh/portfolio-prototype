import { useEffect, useRef, useState } from 'react'
import { sections } from '../../content/sections'
import { skills } from '../../content/skills'
import { motionAllowed } from '../../lib/preferences'
import { BrandIcon } from '../ui/BrandIcon'

/** How long the loading screen stays up on a first visit or refresh (milliseconds). */
const DURATION = 2800
/** One hop of the cube (milliseconds). Logos change once per hop. */
const HOP = 720
/** Number of segments in the loading bar. */
const SEGMENTS = 20
/** Tests set this in localStorage to skip the screen. */
const SKIP_KEY = 'portfolio-skip-loader'

function shouldShow() {
  try { return localStorage.getItem(SKIP_KEY) !== '1' } catch { return true }
}

/**
 * Game-style loading screen: a little cube rolls and hops along a segmented bar,
 * showing a different skill logo after every hop, while tips rotate underneath.
 * Shown once per page load (first visit or refresh), not on page changes.
 *
 * Performance: everything that moves is a CSS animation on `transform`, which the browser
 * runs on the GPU even while the page underneath is still loading:
 *   - the cube slides along the bar (`run`, same easing as the percentage),
 *   - hops and rolls (`hop`, `roll`),
 *   - and swaps logos by sliding a strip of icons one step per hop (`logos`).
 * JavaScript only updates the percentage text, bar segments and tip, and never re-renders React.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(shouldShow)
  const [duration] = useState(() => (motionAllowed() ? DURATION : 600))
  const root = useRef<HTMLDivElement>(null)
  const percent = useRef<HTMLSpanElement>(null)
  const tip = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const icons = useRef(skills.filter(skill => skill.icon)).current

  useEffect(() => {
    if (!visible) return
    const html = document.documentElement
    html.dataset.loading = ''
    const animated = duration === DURATION
    const tips = sections.loader.tips
    const started = performance.now()
    let frame = 0
    let lastFilled = -1
    let lastTip = -1
    let timer = 0

    function render(value: number) {
      const element = root.current
      if (!element) return
      element.setAttribute('aria-valuenow', String(value))
      if (percent.current) percent.current.textContent = `${value}%`
      const filled = Math.round((value / 100) * SEGMENTS)
      if (filled !== lastFilled && bar.current) {
        lastFilled = filled
        Array.from(bar.current.children).forEach((segment, index) => segment.toggleAttribute('data-on', index < filled))
      }
      const tipIndex = Math.min(tips.length - 1, Math.floor((value / 100) * tips.length))
      if (tipIndex !== lastTip && tip.current) { lastTip = tipIndex; tip.current.textContent = tips[tipIndex] }
    }

    function tick(now: number) {
      const t = Math.min((now - started) / duration, 1)
      // Ease in and out (matches the cube's CSS easing) so the bar never rushes or stalls.
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      render(Math.round(eased * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
      else {
        root.current?.setAttribute('data-leaving', 'true')
        timer = window.setTimeout(() => { setVisible(false); delete html.dataset.loading }, animated ? 500 : 0)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer); delete html.dataset.loading }
  }, [visible, duration])

  if (!visible) return null

  return (
    <div
      ref={root}
      className="loader"
      style={{ '--run': `${duration}ms`, '--hop': `${HOP}ms`, '--logos': icons.length } as React.CSSProperties}
      role="progressbar" aria-label={sections.loader.title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <div className="loader-card">
        <p className="loader-title">{sections.loader.title}<span className="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></p>
        <div className="loader-track">
          <div className="loader-runner">
            <div className="loader-hop">
              <div className="loader-block">
                <div className="loader-logos-window">
                  <div className="loader-logos">
                    {icons.map(skill => <span key={skill.name}><BrandIcon skill={skill} /></span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="loader-shadow" />
          </div>
          <div ref={bar} className="loader-bar" aria-hidden="true">
            {Array.from({ length: SEGMENTS }, (_, index) => <span key={index} />)}
          </div>
        </div>
        <div className="loader-meta">
          <span ref={tip} className="loader-tip">{sections.loader.tips[0]}</span>
          <span ref={percent} className="loader-percent">0%</span>
        </div>
      </div>
    </div>
  )
}
