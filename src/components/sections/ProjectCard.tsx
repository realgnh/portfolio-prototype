import { Link } from 'react-router-dom'
import type { Project } from '../../content/projects'
import { sections } from '../../content/sections'
import { ImageSlot } from '../ui/ImageSlot'
import { Tags } from '../ui/Tags'

/** Moves the card's soft glow (CSS ::before in home.css) to the cursor. */
function followCursor(event: React.PointerEvent<HTMLElement>) {
  const card = event.currentTarget
  const box = card.getBoundingClientRect()
  card.style.setProperty('--glow-x', `${event.clientX - box.left}px`)
  card.style.setProperty('--glow-y', `${event.clientY - box.top}px`)
}

/** One project tile: picture, tags, title, one-line summary and its headline result as a big number. A glow follows the cursor. */
export function ProjectCard({ project }: { project: Project }) {
  const [result] = project.metrics
  return (
    <article className="project-card" onPointerMove={followCursor}>
      <ImageSlot src={project.image} folder="projects" alt={project.imageAlt ?? `${project.title} screenshot`} label={sections.placeholders.project} />
      <div className="project-card-body">
        <Tags items={[...project.tags, project.year]} />
        <h3><Link to={`/work/${project.slug}`} className="card-link">{project.title}</Link></h3>
        <p className="muted">{project.summary}</p>
        <p className="card-result"><strong>{result.value}</strong> {result.label.toLowerCase()}</p>
      </div>
    </article>
  )
}
