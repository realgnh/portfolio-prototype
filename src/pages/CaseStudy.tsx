import { Link, useParams } from 'react-router-dom'
import { Metadata } from '../components/Metadata'
import { Thumbnail } from '../components/Thumbnail'
import { projects } from '../data/projects'
import { recordNumber, ui } from '../data/site'
import { NotFound } from './NotFound'

export function CaseStudy() {
  const { slug } = useParams()
  const index = projects.findIndex(project => project.slug === slug)
  if (index === -1) return <NotFound />
  const project = projects[index]
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const { problem, actions, outcome } = project.caseStudy
  const { accomplished, measuredBy, byDoing } = project.xyz

  return (
    <article className="page shell case">
      <Metadata title={project.title} description={`${ui.caseStudy}. ${project.summary}`} />
      <Link className="text-link label" to="/projects"><span aria-hidden="true">←</span> {ui.allProjects}</Link>

      <header className="case-head">
        <div>
          <p className="label">{ui.experiment} {recordNumber(index)} / {project.year} / {project.tags?.join(' / ')}</p>
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
        </div>
        <figure className="case-figure">
          <Thumbnail variant={project.thumbnail} />
          <figcaption className="label">Fig. {recordNumber(index)}</figcaption>
        </figure>
      </header>

      <dl className="field-list case-fields">
        <div><dt className="label">{ui.hypothesis}</dt><dd>{project.hypothesis}</dd></div>
        <div><dt className="label">{ui.method}</dt><dd>{project.method}</dd></div>
        <div><dt className="label">Role</dt><dd>{project.role}</dd></div>
        <div><dt className="label">{ui.instruments}</dt><dd>{project.tools.join(' · ')}</dd></div>
      </dl>

      <section className="readouts" aria-labelledby="readouts-title">
        <h2 id="readouts-title" className="label">{ui.readouts}</h2>
        <dl>
          {project.metrics.map(({ value, label }) => (
            <div key={label}><dt className="label">{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </section>

      <section className="xyz" aria-labelledby="xyz-title">
        <h2 id="xyz-title" className="label">{ui.projectXyz}</h2>
        <p>{accomplished}, as measured by <mark>{measuredBy}</mark>, by {byDoing}.</p>
      </section>

      <div className="case-sections">
        <section aria-labelledby="context-title"><h2 id="context-title" className="label">{ui.context}</h2><p>{problem}</p></section>
        <section aria-labelledby="procedure-title">
          <h2 id="procedure-title" className="label">{ui.procedure}</h2>
          <ol>{actions.map(action => <li key={action}>{action}</li>)}</ol>
        </section>
        <section aria-labelledby="result-title"><h2 id="result-title" className="label">{ui.result}</h2><p>{outcome}</p></section>
      </div>

      <section className="faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="label">{ui.faq}</h2>
        {project.faq.map(({ question, answer }) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      {next !== project && (
        <nav className="record-pager" aria-label="Experiments">
          <Link to={`/projects/${previous.slug}`} rel="prev">
            <span className="label"><span aria-hidden="true">← </span>{ui.previous}</span>
            <span>{previous.title}</span>
          </Link>
          <Link to={`/projects/${next.slug}`} rel="next">
            <span className="label">{ui.next}<span aria-hidden="true"> →</span></span>
            <span>{next.title}</span>
          </Link>
        </nav>
      )}
    </article>
  )
}
