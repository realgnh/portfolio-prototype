import { Link, useParams } from 'react-router-dom'
import { Metadata } from '../components/Metadata'
import { MetricList } from '../components/MetricList'
import { Thumbnail } from '../components/Thumbnail'
import { projects } from '../data/projects'
import { ui } from '../data/site'
import { NotFound } from './NotFound'

export function CaseStudy() {
  const { slug } = useParams()
  const index = projects.findIndex(project => project.slug === slug)
  if (index === -1) return <NotFound />
  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const { problem, actions, outcome } = project.caseStudy
  const { accomplished, measuredBy, byDoing } = project.xyz

  return (
    <article className="inner-page shell">
      <Metadata title={project.title} description={`${ui.caseStudy}. ${project.summary}`} />
      <Link className="action back-link" to="/projects"><span aria-hidden="true">←</span> {ui.allProjects}</Link>
      <header className="page-heading case-heading">
        <div>
          <p className="eyebrow">{ui.caseStudy} · {project.year}</p>
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          {project.tags?.length ? <p className="eyebrow">{project.tags.join(' · ')}</p> : null}
        </div>
        <Thumbnail variant={project.thumbnail} />
      </header>
      <section className="project-xyz" aria-labelledby="project-xyz-title">
        <h2 className="eyebrow" id="project-xyz-title">{ui.projectXyz}</h2>
        <p>{accomplished}, as measured by <strong>{measuredBy}</strong>, by {byDoing}.</p>
      </section>
      <div className="case-sections">
        <section><h2>{ui.problem}</h2><p>{problem}</p></section>
        <section><h2>{ui.actions}</h2><ul>{actions.map(action => <li key={action}>{action}</li>)}</ul></section>
        <section><h2>{ui.outcome}</h2><p>{outcome}</p><MetricList metrics={project.metrics} /></section>
      </div>
      <section className="project-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">{ui.faq}</h2>
        <div>
          {project.faq.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      {next !== project && (
        <Link className="next-project" to={`/projects/${next.slug}`}>
          <span className="eyebrow">{ui.next}</span>
          <span>{next.title} <span aria-hidden="true">↗</span></span>
        </Link>
      )}
    </article>
  )
}
