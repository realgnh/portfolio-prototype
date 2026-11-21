import { useEffect, useRef } from 'react'
import { sections } from '../../content/sections'
import { skills, toneOf } from '../../content/skills'
import { motionAllowed } from '../../lib/preferences'
import { BrandIcon } from '../ui/BrandIcon'

/**
 * Where each bubble sits around the hero (% of width/height), how strongly it leans
 * toward the cursor (depth), which wandering path it follows (1–3) and how long one
 * loop takes (seconds). Different paths and speeds keep the motion from looking robotic.
 * Add a spot if you add a skill; extra skills reuse spots from the start.
 */
const spots = [
  { x: 8, y: 24, depth: 18, path: 1, speed: 19 },
  { x: 21, y: 9, depth: 10, path: 2, speed: 23 },
  { x: 4, y: 58, depth: 14, path: 3, speed: 21 },
  { x: 91, y: 22, depth: 16, path: 2, speed: 18 },
  { x: 77, y: 8, depth: 9, path: 3, speed: 25 },
  { x: 95, y: 56, depth: 12, path: 1, speed: 22 },
  { x: 85, y: 85, depth: 20, path: 3, speed: 20 },
  { x: 15, y: 86, depth: 15, path: 2, speed: 24 },
  { x: 68, y: 94, depth: 8, path: 1, speed: 26 },
  { x: 32, y: 95, depth: 11, path: 3, speed: 21 },
]

/** Brand-logo bubbles that wander slowly, tilt a little and lean toward the cursor. Hover or focus shows the name. */
export function SkillBubbles() {
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const element = list.current
    const hero = element?.parentElement
    if (!element || !hero) return
    let frame = 0
    function onMove(event: PointerEvent) {
      if (!motionAllowed() || event.pointerType !== 'mouse') return
      const box = hero!.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width - 0.5
      const y = (event.clientY - box.top) / box.height - 0.5
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        element!.style.setProperty('--mx', x.toFixed(3))
        element!.style.setProperty('--my', y.toFixed(3))
      })
    }
    hero.addEventListener('pointermove', onMove)
    return () => { hero.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame) }
  }, [])

  return (
    <ul ref={list} className="skill-bubbles" aria-label={sections.hero.skillsLabel}>
      {skills.map((skill, index) => {
        const spot = spots[index % spots.length]
        return (
          <li
            key={skill.name}
            className="bubble"
            data-tone={toneOf(skill.area)}
            data-path={spot.path}
            tabIndex={0}
            aria-label={skill.name}
            style={{
              '--x': `${spot.x}%`, '--y': `${spot.y}%`, '--depth': `${spot.depth}px`,
              '--speed': `${spot.speed}s`, '--delay': `${index * -2.7}s`, '--enter': `${index * 70}ms`,
            } as React.CSSProperties}
          >
            <span className="bubble-float">
              <span className="bubble-inner"><BrandIcon skill={skill} /></span>
            </span>
            <span className="bubble-tip" aria-hidden="true">{skill.name}</span>
          </li>
        )
      })}
    </ul>
  )
}
