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
  const { problem, role, actions, outcome } = project.caseStudy

  return (
    <article className="inner-page shell">
      <Metadata title={project.title} description={`${ui.caseStudy}. ${project.summary}`} />
      <Link className="action back-link" to="/work" viewTransition><span aria-hidden="true">←</span> {ui.allWork}</Link>
      <header className="page-heading case-heading">
        <div>
          <p className="eyebrow">{ui.caseStudy} · {project.year}</p>
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          <p className="eyebrow">{[project.role, ...(project.tags ?? [])].join(' · ')}</p>
        </div>
        <Thumbnail variant={project.thumbnail} />
      </header>
      <div className="case-sections">
        <section><h2>{ui.problem}</h2><p>{problem}</p></section>
        <section><h2>{ui.role}</h2><p>{role}</p></section>
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
        <Link className="next-project" to={`/work/${next.slug}`} viewTransition>
          <span className="eyebrow">{ui.next}</span>
          <span>{next.title} <span aria-hidden="true">↗</span></span>
        </Link>
      )}
    </article>
  )
}
