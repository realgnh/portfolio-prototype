import { useEffect, useRef } from 'react'
import { sections } from '../../content/sections'
import { skills, toneOf } from '../../content/skills'
import { BrandIcon } from '../ui/BrandIcon'

/**
 * Where each bubble sits around the hero, as % of the hero's width/height,
 * plus how strongly it follows the cursor (depth). Add more spots if you add skills;
 * extra skills beyond this list wrap to the start.
 */
const spots = [
  { x: 8, y: 22, depth: 18 }, { x: 22, y: 10, depth: 10 }, { x: 5, y: 58, depth: 14 },
  { x: 90, y: 20, depth: 16 }, { x: 76, y: 9, depth: 9 }, { x: 95, y: 55, depth: 12 },
  { x: 85, y: 86, depth: 20 }, { x: 14, y: 88, depth: 15 }, { x: 68, y: 95, depth: 8 },
]

/** Brand-logo bubbles that drift and lean toward the cursor. Hover or focus shows the name. */
export function SkillBubbles() {
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const element = list.current
    const hero = element?.parentElement
    if (!element || !hero) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function onMove(event: PointerEvent) {
      if (reduced.matches || event.pointerType !== 'mouse') return
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
            tabIndex={0}
            aria-label={skill.name}
            style={{ '--x': `${spot.x}%`, '--y': `${spot.y}%`, '--depth': `${spot.depth}px`, '--delay': `${index * -1.3}s` } as React.CSSProperties}
          >
            <span className="bubble-inner"><BrandIcon skill={skill} /></span>
            <span className="bubble-tip" aria-hidden="true">{skill.name}</span>
          </li>
        )
      })}
    </ul>
  )
}
