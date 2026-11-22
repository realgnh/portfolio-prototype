import { Link } from 'react-router-dom'
import type { Project } from '../../content/projects'
import { sections } from '../../content/sections'
import { toneOf } from '../../content/skills'
import { Chip } from '../ui/Chip'
import { ImageSlot } from '../ui/ImageSlot'

/** Moves the card's soft glow (CSS ::before in home.css) to the cursor. */
function followCursor(event: React.PointerEvent<HTMLElement>) {
  const card = event.currentTarget
  const box = card.getBoundingClientRect()
  card.style.setProperty('--glow-x', `${event.clientX - box.left}px`)
  card.style.setProperty('--glow-y', `${event.clientY - box.top}px`)
}

/** One project tile: picture, title, one-line summary, headline result and tags. A pastel glow follows the cursor. */
export function ProjectCard({ project }: { project: Project }) {
  const tone = toneOf(project.area)
  const [result] = project.metrics
  return (
    <article className="project-card" data-tone={tone} onPointerMove={followCursor}>
      <ImageSlot src={project.image} folder="projects" alt={project.imageAlt ?? `${project.title} screenshot`} label={sections.placeholders.project} tone={tone} />
      <div className="project-card-body">
        <h3><Link to={`/projects/${project.slug}`} className="card-link">{project.title}</Link></h3>
        <p className="muted">{project.summary}</p>
        <div className="project-card-meta">
          <span className="result-pill" data-tone={tone}><strong>{result.value}</strong> {result.label.toLowerCase()}</span>
          <span className="muted">{project.year}</span>
        </div>
      </div>
      <ul className="chip-row" aria-label="Tags">
        {project.tags.map(tag => <li key={tag}><Chip>{tag}</Chip></li>)}
      </ul>
    </article>
  )
}
