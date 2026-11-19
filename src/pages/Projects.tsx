import { Metadata } from '../components/Metadata'
import { ProjectCard } from '../components/ProjectCard'
import { Reveal } from '../components/Reveal'
import { projects } from '../data/projects'
import { site } from '../data/site'

export function Projects() {
  // EXTENSION POINT: Filter projects by tag before mapping them into cards.
  return (
    <>
      <Metadata {...site.pages.projects} />
      <section className="inner-page shell" aria-labelledby="selected-projects">
        <header className="page-heading">
          <p className="eyebrow">{site.projects.caption}</p>
          <h1 id="selected-projects">{site.projects.heading}</h1>
        </header>
        <ul className="project-list">
          {projects.map(project => <Reveal key={project.slug}><ProjectCard project={project} /></Reveal>)}
        </ul>
      </section>
    </>
  )
}
