import { Link } from 'react-router-dom'
import { ExperimentCard } from '../components/ExperimentCard'
import { Hero } from '../components/Hero'
import { Metadata } from '../components/Metadata'
import { projects } from '../data/projects'
import { recordNumber, site, ui } from '../data/site'

export function Home() {
  const { skills, log } = site
  const featured = projects.slice(0, site.projects.featuredCount)

  return (
    <>
      <Metadata {...site.pages.home} />
      <Hero />

      <section id="register" className="section shell" aria-labelledby="register-title">
        <header className="section-head">
          <h2 id="register-title" className="label">{site.projects.register}</h2>
          <p className="label">{recordNumber(featured.length - 1)} of {recordNumber(projects.length - 1)} {ui.records} / {site.projects.caption}</p>
        </header>
        <ul className="experiment-grid">
          {featured.map((project, index) => (
            <li key={project.slug}><ExperimentCard project={project} number={recordNumber(index)} /></li>
          ))}
        </ul>
        <Link className="text-link label" to="/projects">{site.projects.browse} <span aria-hidden="true">→</span></Link>
      </section>

      <section id="stack" className="section shell" aria-labelledby="stack-title">
        <header className="section-head">
          <h2 id="stack-title" className="label">{skills.eyebrow}</h2>
          <p className="label">{skills.caption}</p>
        </header>
        <div className="instrument-table">
          {skills.groups.map(({ title, tools }) => (
            <section key={title} className="instrument-group" aria-labelledby={`group-${title}`}>
              <h3 id={`group-${title}`} className="label">{title}</h3>
              <ul>
                {tools.map(tool => {
                  const evidence = projects
                    .map((project, index) => ({ project, number: recordNumber(index) }))
                    .filter(({ project }) => project.tools.includes(tool))
                  return (
                    <li key={tool}>
                      <span className="instrument-name">{tool}</span>
                      <span className="instrument-evidence">
                        {evidence.length
                          ? evidence.map(({ project, number }) => (
                            <Link key={project.slug} to={`/projects/${project.slug}`} className="chip" title={project.title} aria-label={`${tool}: ${ui.experiment} ${number}, ${project.title}`}>
                              {number}
                            </Link>
                          ))
                          : <span className="instrument-empty">{skills.noEvidence}</span>}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section id="log" className="section shell" aria-labelledby="log-title">
        <header className="section-head">
          <h2 id="log-title" className="label">{log.eyebrow}</h2>
          <p className="label">{log.caption}</p>
        </header>
        <ol className="log-list">
          {log.entries.map(({ date, kind, note }) => (
            <li key={`${date}-${note}`}>
              <span className="label log-date">{date}</span>
              <span className="label log-kind">{kind}</span>
              <p>{note}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
