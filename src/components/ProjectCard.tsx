import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { MetricList } from './MetricList'
import { Thumbnail } from './Thumbnail'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Thumbnail variant={project.thumbnail} />
      <div className="project-content">
        <p className="eyebrow">{project.year} · {project.tags?.[0] ?? project.role}</p>
        <h2>
          <Link to={`/projects/${project.slug}`} className="project-title">
            {project.title} <span aria-hidden="true">↗</span>
          </Link>
        </h2>
        <p className="project-summary">{project.summary}</p>
        <MetricList metrics={project.metrics} />
      </div>
    </article>
  )
}
