import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { ui } from '../data/site'

export function ExperimentCard({ project, number }: { project: Project; number: string }) {
  const [result] = project.metrics
  return (
    <article className="experiment-card">
      <header className="experiment-meta label">
        <span>{ui.experiment} {number}</span>
        <span>{project.tags?.join(' / ')}</span>
      </header>
      <h3>
        <Link to={`/projects/${project.slug}`} className="experiment-title">
          {project.title}<span className="experiment-arrow" aria-hidden="true"> ↗</span>
        </Link>
      </h3>
      <dl className="field-list">
        <div><dt className="label">{ui.hypothesis}</dt><dd>{project.hypothesis}</dd></div>
        <div><dt className="label">{ui.method}</dt><dd>{project.method}</dd></div>
        <div>
          <dt className="label">{ui.result}</dt>
          <dd className="result"><mark>{result.value}</mark> <strong>{result.label.toLowerCase()}</strong></dd>
        </div>
      </dl>
    </article>
  )
}
