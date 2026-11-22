import { useCallback, useEffect, useState } from 'react'
import { easterEgg } from '../../content/easterEggs'
import { unlockBrickMode, useEasterEggTriggers } from '../../lib/easterEgg'
import { useToast } from '../../lib/toast'

/**
 * The easter egg: a blocky character drops in at the bottom-right, waves and says hi,
 * then hops away. Triggers and text: src/content/easterEggs.ts. Styles: layout.css.
 */
export function EasterEgg() {
  const [run, setRun] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const toast = useToast()

  const trigger = useCallback(() => {
    setLeaving(false)
    setRun(value => value + 1)
    if (unlockBrickMode()) window.setTimeout(() => toast(easterEgg.brickUnlocked), 1200)
  }, [toast])

  useEasterEggTriggers(trigger)

  // Start leaving after `stay` ms (or when dismissed), then remove once the hop-away finishes.
  useEffect(() => {
    if (!run) return
    const leave = window.setTimeout(() => setLeaving(true), easterEgg.stay)
    return () => window.clearTimeout(leave)
  }, [run])
  useEffect(() => {
    if (!leaving) return
    const gone = window.setTimeout(() => { setRun(0); setLeaving(false) }, 600)
    return () => window.clearTimeout(gone)
  }, [leaving])

  if (!run) return null

  return (
    <div key={run} className="egg" data-leaving={leaving} role="status">
      <p className="egg-speech">{easterEgg.speech}</p>
      <button type="button" className="egg-close" aria-label="Dismiss" onClick={() => setLeaving(true)}>×</button>
      <svg className="egg-character" viewBox="-16 -16 96 112" overflow="visible" aria-hidden="true">
        {/* Waving arm sits behind the body so the shoulder joint is hidden. */}
        <g className="egg-arm-wave"><rect x="46" y="12" width="12" height="26" rx="3" fill="#f5c84c" /></g>
        <rect x="6" y="38" width="12" height="26" rx="3" fill="#f5c84c" />
        <rect x="18" y="36" width="28" height="30" rx="3" fill="#2f6fde" />
        <rect x="18" y="66" width="13" height="26" rx="2" fill="#4caf50" />
        <rect x="33" y="66" width="13" height="26" rx="2" fill="#4caf50" />
        <rect x="20" y="8" width="24" height="26" rx="5" fill="#f5c84c" />
        <circle cx="28" cy="19" r="2.2" fill="#121315" />
        <circle cx="36" cy="19" r="2.2" fill="#121315" />
        <path d="M26.5 25.5q5.5 4.5 11 0" fill="none" stroke="#121315" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
