import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BrandIcon } from '../components/ui/BrandIcon'
import { Chip } from '../components/ui/Chip'
import { ProjectMedia } from '../components/sections/ProjectMedia'
import { Metadata } from '../components/ui/Metadata'
import { projects } from '../content/projects'
import { demos } from '../demos'
import { sections } from '../content/sections'
import { skills, toneOf } from '../content/skills'
import { NotFound } from './NotFound'

export function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex(project => project.slug === slug)
  if (index === -1) return <NotFound />
  const project = projects[index]
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const tone = toneOf(project.area)
  const copy = sections.project
  const { accomplished, measuredBy, byDoing } = project.xyz
  const Demo = demos[project.slug]
  const tools = project.tools.map(name => skills.find(skill => skill.name === name) ?? { name, area: project.area })

  return (
    <article className="page shell project-page">
      <Metadata title={project.title} description={project.summary} />
      <Link className="arrow-link back-link" to="/projects"><span aria-hidden="true">←</span> {copy.back}</Link>

      <header className="page-header">
        <ul className="chip-row" aria-label="Tags">
          {project.tags.map(tag => <li key={tag}><Chip tone={tone}>{tag}</Chip></li>)}
        </ul>
        <h1>{project.title}</h1>
        <p className="lede muted">{project.summary}</p>
      </header>

      <ProjectMedia project={project} tone={tone} />

      <dl className="facts">
        <div><dt>{copy.year}</dt><dd>{project.year}</dd></div>
        <div>
          <dt>{copy.tools}</dt>
          <dd className="tool-list">
            {tools.map(skill => <span key={skill.name} className="tool"><span className="tool-icon"><BrandIcon skill={skill} /></span>{skill.name}</span>)}
          </dd>
        </div>
      </dl>

      <section aria-labelledby="results-title">
        <h2 id="results-title" className="visually-hidden">Results</h2>
        <dl className="metrics">
          {project.metrics.map(({ value, label }) => (
            <div key={label} data-tone={tone}><dd>{value}</dd><dt>{label}</dt></div>
          ))}
        </dl>
      </section>

      {Demo && (
        <section className="demo-section" aria-labelledby="demo-title">
          <h2 id="demo-title">{copy.demo}</h2>
          <p className="muted">{copy.demoIntro}</p>
          <Suspense fallback={<div className="demo demo-loading" aria-busy="true" />}><Demo /></Suspense>
        </section>
      )}

      <section className="summary-card" aria-labelledby="summary-title">
        <h2 id="summary-title">{copy.summary}</h2>
        <p>{accomplished}, as measured by <mark>{measuredBy}</mark>, by {byDoing}.</p>
      </section>

      <div className="story">
        <section aria-labelledby="problem-title"><h2 id="problem-title">{copy.problem}</h2><p>{project.caseStudy.problem}</p></section>
        <section aria-labelledby="approach-title">
          <h2 id="approach-title">{copy.approach}</h2>
          <ol className="steps">{project.caseStudy.actions.map(action => <li key={action}>{action}</li>)}</ol>
        </section>
        <section aria-labelledby="result-title"><h2 id="result-title">{copy.result}</h2><p>{project.caseStudy.outcome}</p></section>
      </div>

      <section className="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">{copy.faq}</h2>
        {project.faq.map(({ question, answer }) => (
          <details key={question}>
            <summary>{question}</summary>
            <p className="muted">{answer}</p>
          </details>
        ))}
      </section>

      {next !== project && (
        <nav className="pager" aria-label="More projects">
          <Link to={`/projects/${previous.slug}`} rel="prev"><span className="muted">← {copy.previous}</span><strong>{previous.title}</strong></Link>
          <Link to={`/projects/${next.slug}`} rel="next"><span className="muted">{copy.next} →</span><strong>{next.title}</strong></Link>
        </nav>
      )}
    </article>
  )
}
