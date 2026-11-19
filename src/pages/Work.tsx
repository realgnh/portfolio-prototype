import { Hero } from '../components/Hero'
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
      <Hero />
      <section className="work shell" aria-labelledby="selected-work">
        <header className="section-index">
          <h2 id="selected-work">{site.work.heading}</h2>
          <p>{site.work.caption}</p>
        </header>
        <ul className="project-list">
          {projects.map(project => <Reveal key={project.slug}><ProjectCard project={project} /></Reveal>)}
        </ul>
      </section>
    </>
  )
}
