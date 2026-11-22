import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { buildTimeline } from '../../lib/timeline'
import { motionAllowed } from '../../lib/preferences'

const entries = buildTimeline()
const kindLabel = { role: 'Role', project: 'Project', milestone: 'Milestone' } as const

function initials(name: string) {
  return name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase()
}

/**
 * Experience timeline: roles, projects and milestones on one vertical path.
 * The line draws itself as you scroll, and each dot lights up when the line reaches it.
 * Data comes from lib/timeline.ts (experience.ts + projects.ts + milestones.ts).
 */
export function Timeline() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const items = Array.from(element.querySelectorAll<HTMLElement>('.timeline-item'))
    let frame = 0

    function update() {
      frame = 0
      const box = element!.getBoundingClientRect()
      // The line's tip follows a point 60% down the screen.
      const reach = motionAllowed() ? window.innerHeight * 0.6 - box.top : box.height
      const fill = Math.max(0, Math.min(reach / box.height, 1))
      element!.style.setProperty('--fill', fill.toFixed(4))
      for (const item of items) item.toggleAttribute('data-reached', item.offsetTop + 18 <= fill * box.height)
    }
    function queue() { if (!frame) frame = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={root} className="timeline">
      <div className="timeline-line" aria-hidden="true"><div className="timeline-fill" /></div>
      <ol>
        {entries.map(entry => (
          <li key={entry.key} className="timeline-item" data-kind={entry.kind}>
            <div className="timeline-dot" aria-hidden="true">
              {entry.kind === 'role' && (entry.logo ? <img src={`/images/companies/${entry.logo}`} alt="" /> : initials(entry.company))}
              {entry.kind === 'project' && '◆'}
              {entry.kind === 'milestone' && entry.emoji}
            </div>
            <div className="timeline-card">
              <p className="timeline-meta">
                <span className="timeline-kind">{kindLabel[entry.kind]}</span>
                <span>{entry.when}</span>
                {entry.kind === 'role' && entry.length && <span className="muted">· {entry.length}</span>}
              </p>
              <h3>{entry.kind === 'project' ? <Link to={`/projects/${entry.slug}`}>{entry.title} <span aria-hidden="true">↗</span></Link> : entry.title}</h3>
              {'subtitle' in entry && <p className="muted">{entry.subtitle}</p>}
              {entry.text.map(line => <p key={line} className="timeline-text">{line}</p>)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
