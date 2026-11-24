import { useSearchParams } from 'react-router-dom'
import { ProjectCard } from '../components/sections/ProjectCard'
import { Metadata } from '../components/ui/Metadata'
import { pages } from '../content/navigation'
import { projects } from '../content/projects'
import { sections } from '../content/sections'
import { skillAreas } from '../content/skills'
import type { Area } from '../content/skills'

const usedAreas = (Object.keys(skillAreas) as Area[]).filter(area => projects.some(project => project.area === area))

export function Projects() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('area') as Area | null
  const area = requested && usedAreas.includes(requested) ? requested : null
  const shown = area ? projects.filter(project => project.area === area) : projects

  function choose(next: Area | null) {
    setParams(next ? { area: next } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <section className="page shell" aria-labelledby="projects-title">
      <Metadata title={pages.projects.title} description={pages.projects.description} />
      <header className="page-header" data-scene="Work">
        <h1 id="projects-title">{pages.projects.title}</h1>
      </header>
      <div className="filter-row" role="group" aria-label="Filter projects by area">
        <button type="button" className="filter" aria-pressed={!area} onClick={() => choose(null)}>{sections.projects.allFilter}</button>
        {usedAreas.map(name => (
          <button key={name} type="button" className="filter" aria-pressed={area === name} onClick={() => choose(name)}>
            {skillAreas[name].label}
          </button>
        ))}
        <span className="muted filter-count" role="status">{shown.length} of {projects.length}</span>
      </div>
      {shown.length === 0 && <p className="muted">{sections.projects.empty}</p>}
      <ul className="project-grid">
        {shown.map(project => <li key={project.slug}><ProjectCard project={project} /></li>)}
      </ul>
    </section>
  )
}
