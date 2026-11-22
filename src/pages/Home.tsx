import { Link } from 'react-router-dom'
import { About } from '../components/sections/About'
import { ContactBand } from '../components/sections/ContactBand'
import { CurrentlyList } from '../components/sections/CurrentlyList'
import { ExperienceList } from '../components/sections/ExperienceList'
import { GitHubActivity } from '../components/sections/GitHubActivity'
import { Hero } from '../components/sections/Hero'
import { Hobbies } from '../components/sections/Hobbies'
import { ProjectCard } from '../components/sections/ProjectCard'
import { SkillsGrid } from '../components/sections/SkillsGrid'
import { Metadata } from '../components/ui/Metadata'
import { SectionHeading } from '../components/ui/SectionHeading'
import { pages } from '../content/navigation'
import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { sections } from '../content/sections'

/** Home, top to bottom. Reorder or remove sections here. */
export function Home() {
  return (
    <>
      <Metadata title={pages.home.title} description={pages.home.description} />
      <Hero />

      <section id="experience" className="section shell" aria-labelledby="experience-title">
        <SectionHeading
          id="experience-title"
          title={sections.experience.heading}
          intro={sections.experience.intro}
          action={<Link className="arrow-link" to="/experience">{sections.experience.all} <span aria-hidden="true">→</span></Link>}
        />
        <ExperienceList compact limit={sections.experience.homeCount} />
      </section>

      <About />

      <section id="projects" className="section shell" aria-labelledby="projects-title">
        <SectionHeading
          id="projects-title"
          title={sections.projects.heading}
          intro={sections.projects.intro}
          action={<Link className="arrow-link" to="/projects">{sections.projects.all} <span aria-hidden="true">→</span></Link>}
        />
        <ul className="project-grid">
          {projects.slice(0, profile.featuredCount).map(project => <li key={project.slug}><ProjectCard project={project} /></li>)}
        </ul>
      </section>

      <GitHubActivity />
      <SkillsGrid />
      <Hobbies />
      <CurrentlyList />
      <ContactBand />
    </>
  )
}
