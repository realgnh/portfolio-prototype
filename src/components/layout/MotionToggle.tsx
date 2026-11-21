import { sections } from '../../content/sections'
import { toggleMotion, useMotion } from '../../lib/preferences'

/** Turns the site's animations on or off. On by default; the choice is remembered. */
export function MotionToggle() {
  const motion = useMotion()
  const label = motion === 'on' ? sections.motion.on : sections.motion.off
  return (
    <button type="button" className="icon-button" aria-label={sections.motion.label} aria-pressed={motion === 'on'} title={label} onClick={toggleMotion}>
      {motion === 'on' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" /><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      )}
    </button>
  )
}
