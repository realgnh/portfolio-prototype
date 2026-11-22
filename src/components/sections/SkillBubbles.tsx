import { useEffect, useRef } from 'react'
import { sections } from '../../content/sections'
import { skills, toneOf } from '../../content/skills'
import { motionAllowed } from '../../lib/preferences'
import { BrandIcon } from '../ui/BrandIcon'

/**
 * Where each bubble sits around the hero (% of width/height), how strongly it leans
 * toward the cursor (depth), which wandering path it follows (1–3) and how long one
 * loop takes (seconds). Different paths and speeds keep the motion from looking robotic. Spots sit near the edges so they never cover the text.
 * Add a spot if you add a skill; extra skills reuse spots from the start.
 */
const spots = [
  { x: 16, y: 12, depth: 18, path: 1, speed: 19 },
  { x: 54, y: 7, depth: 10, path: 2, speed: 23 },
  { x: 88, y: 18, depth: 14, path: 3, speed: 21 },
  { x: 32, y: 36, depth: 16, path: 2, speed: 24 },
  { x: 72, y: 40, depth: 9, path: 1, speed: 26 },
  { x: 10, y: 62, depth: 16, path: 2, speed: 18 },
  { x: 48, y: 64, depth: 12, path: 3, speed: 25 },
  { x: 88, y: 66, depth: 12, path: 1, speed: 22 },
  { x: 26, y: 90, depth: 20, path: 3, speed: 20 },
  { x: 68, y: 90, depth: 11, path: 1, speed: 21 },
]

/** Directions of the firework sparks, in degrees (12 evenly spaced, slightly offset so it looks less rigid). */
const SPARK_ANGLES = [8, 38, 68, 98, 128, 158, 188, 218, 248, 278, 308, 338]

/**
 * Plays the click "pop" (squish + firework: .bubble-burst[data-pop] in home.css).
 * Clicking again mid-pop restarts it from the beginning. `data-popped` stops the
 * one-off "appear" firework from replaying afterwards.
 */
function pop(event: React.SyntheticEvent<HTMLElement>) {
  const burst = event.currentTarget.querySelector<HTMLElement>('.bubble-burst')
  if (!burst) return
  burst.setAttribute('data-popped', '')
  burst.removeAttribute('data-pop')
  void burst.offsetWidth // let the browser notice the removal so the animation restarts
  burst.setAttribute('data-pop', '')
}

/** Clears the pop once the sparks have finished falling. */
function endPop(event: React.AnimationEvent<HTMLElement>) {
  if (event.animationName === 'spark-fall') event.currentTarget.removeAttribute('data-pop')
}

/**
 * Brand-logo bubbles that pop in, wander slowly, tilt a little and lean toward the cursor.
 * Hover or focus shows the name; clicking (or Enter/Space) makes a bubble pop.
 */
export function SkillBubbles() {
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const element = list.current
    const hero = element?.closest('.hero') as HTMLElement | null
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
    // Pause the wandering while the hero is off-screen.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) delete element.dataset.paused
      else element.dataset.paused = ''
    })
    observer.observe(hero)
    return () => { hero.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame); observer.disconnect() }
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
            onClick={pop}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pop(event) } }}
            style={{
              '--x': `${spot.x}%`, '--y': `${spot.y}%`, '--depth': `${spot.depth}px`,
              '--speed': `${spot.speed}s`, '--delay': `${index * -2.7}s`, '--enter': `${150 + index * 90}ms`,
            } as React.CSSProperties}
          >
            <span className="bubble-float">
              <span className="bubble-burst" onAnimationEnd={endPop}>
                <span className="sparks" aria-hidden="true">
                  {SPARK_ANGLES.map(angle => <i key={angle} style={{ '--a': `${angle}deg` } as React.CSSProperties} />)}
                </span>
                <span className="bubble-inner"><BrandIcon skill={skill} /></span>
              </span>
            </span>
            <span className="bubble-tip" aria-hidden="true">{skill.name}</span>
          </li>
        )
      })}
    </ul>
  )
}
