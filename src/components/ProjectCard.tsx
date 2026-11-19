import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { ui } from '../data/site'
import { MetricList } from './MetricList'
import { Thumbnail } from './Thumbnail'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Thumbnail variant={project.thumbnail} />
      <div className="project-content">
        <p className="eyebrow">{project.year} · {project.tags?.[0] ?? project.role}</p>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <MetricList metrics={project.metrics} />
        <Link to={`/work/${project.slug}`} className="action" aria-label={`${ui.readMore}: ${project.title}`}>
          {ui.readMore} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}
