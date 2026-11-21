import { useSearchParams } from 'react-router-dom'
import { ExperimentCard } from '../components/ExperimentCard'
import { Metadata } from '../components/Metadata'
import { Reveal } from '../components/Reveal'
import { projects } from '../data/projects'
import { recordNumber, site, ui } from '../data/site'

const topics = [...new Set(projects.flatMap(project => project.tags ?? []))]

export function Projects() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('topic')
  const topic = requested && topics.includes(requested) ? requested : null
  const records = projects
    .map((project, index) => ({ project, number: recordNumber(index) }))
    .filter(({ project }) => !topic || project.tags?.includes(topic))

  function choose(next: string | null) {
    setParams(next ? { topic: next } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <section className="page shell" aria-labelledby="register-title">
      <Metadata {...site.pages.projects} />
      <header className="sheet-head">
        <p className="label">Sheet 02.00 / {site.projects.register}</p>
        <h1 id="register-title">{site.pages.projects.title}</h1>
      </header>
      <div className="filter-bar">
        <div className="chip-row" role="group" aria-label={site.projects.filterLabel}>
          <button type="button" className="chip" aria-pressed={!topic} onClick={() => choose(null)}>{site.projects.allLabel}</button>
          {topics.map(name => (
            <button key={name} type="button" className="chip" aria-pressed={topic === name} onClick={() => choose(name)}>{name}</button>
          ))}
        </div>
        <p className="label" role="status">{recordNumber(records.length - 1)} {ui.records} / {site.projects.caption}</p>
      </div>
      <ul className="experiment-grid">
        {records.map(({ project, number }) => (
          <Reveal key={project.slug}><ExperimentCard project={project} number={number} /></Reveal>
        ))}
      </ul>
    </section>
  )
}
