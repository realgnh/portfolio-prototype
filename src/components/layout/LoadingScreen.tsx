import { useEffect, useRef, useState } from 'react'
import { sections } from '../../content/sections'
import { skills } from '../../content/skills'
import { motionAllowed } from '../../lib/preferences'
import { BrandIcon } from '../ui/BrandIcon'

/** How long the loading screen stays up on a first visit or refresh (milliseconds). */
const DURATION = 1700
/** Number of segments in the loading bar. */
const SEGMENTS = 20
/** Tests set this in localStorage to skip the screen. */
const SKIP_KEY = 'portfolio-skip-loader'

function shouldShow() {
  try { return localStorage.getItem(SKIP_KEY) !== '1' } catch { return true }
}

/**
 * Game-style loading screen: a little block hops along a segmented bar,
 * switching to a different skill logo on every hop, while tips rotate below.
 * Shown once per page load (first visit or refresh), not on page changes.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(shouldShow)
  const [leaving, setLeaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hop, setHop] = useState(0)
  const icons = useRef(skills.filter(skill => skill.icon)).current
  const animated = useRef(motionAllowed()).current

  useEffect(() => {
    if (!visible) return
    document.documentElement.dataset.loading = ''
    const duration = animated ? DURATION : 500
    const started = performance.now()
    let frame = 0
    function tick(now: number) {
      const t = Math.min((now - started) / duration, 1)
      setProgress(Math.round((1 - (1 - t) ** 2.2) * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
      else {
        setLeaving(true)
        window.setTimeout(() => {
          setVisible(false)
          delete document.documentElement.dataset.loading
        }, animated ? 450 : 0)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); delete document.documentElement.dataset.loading }
  }, [visible, animated])

  if (!visible) return null
  const tips = sections.loader.tips
  const filled = Math.round((progress / 100) * SEGMENTS)

  return (
    <div className="loader" data-leaving={leaving} role="progressbar" aria-label={sections.loader.title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
      <div className="loader-card">
        <p className="loader-title">{sections.loader.title}<span className="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></p>
        <div className="loader-track">
          <div className="loader-runner" style={{ left: `${progress}%` }}>
            <div className="loader-block" onAnimationIteration={() => setHop(value => value + 1)}>
              <BrandIcon skill={icons[hop % icons.length]} />
            </div>
            <div className="loader-shadow" />
          </div>
          <div className="loader-bar" aria-hidden="true">
            {Array.from({ length: SEGMENTS }, (_, index) => <span key={index} data-on={index < filled} />)}
          </div>
        </div>
        <div className="loader-meta">
          <span className="loader-tip">{tips[Math.floor(progress / (100 / tips.length + 0.01)) % tips.length]}</span>
          <span className="loader-percent">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
