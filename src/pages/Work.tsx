import { Metadata } from '../components/Metadata'
import { ProjectCard } from '../components/ProjectCard'
import { Reveal } from '../components/Reveal'
import { projects } from '../data/projects'
import { site } from '../data/site'

export function Work() {
  // EXTENSION POINT: Filter projects by tag before mapping them into cards.
  return (
    <>
      <Metadata {...site.pages.work} />
      <section className="work inner-page shell" aria-labelledby="selected-work">
        <header className="page-heading">
          <p className="eyebrow">{site.work.caption}</p>
          <h1 id="selected-work">{site.work.heading}</h1>
        </header>
        <ul className="project-list">
          {projects.map(project => <Reveal key={project.slug}><ProjectCard project={project} /></Reveal>)}
        </ul>
      </section>
    </>
  )
}
