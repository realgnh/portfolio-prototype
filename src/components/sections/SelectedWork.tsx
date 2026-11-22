import { Link } from 'react-router-dom'
import { hobbyProjects } from '../../content/hobbyProjects'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import { sections } from '../../content/sections'
import { ImageSlot } from '../ui/ImageSlot'
import { Tags } from '../ui/Tags'
import { ProjectCard } from './ProjectCard'

/**
 * "Selected work" on Home, on a black band: one big featured project, two smaller ones
 * and the featured hobby game. Which projects: the first `profile.featuredCount` in projects.ts.
 */
export function SelectedWork() {
  const [lead, ...rest] = projects.slice(0, profile.featuredCount)
  const game = hobbyProjects.featured
  const [result] = lead.metrics

  return (
    <section id="work" className="band" aria-labelledby="work-title" data-scene="Work">
      <div className="shell band-inner">
        <header className="band-heading">
          <h2 id="work-title" className="section-title">{sections.projects.heading}</h2>
          <Link className="arrow-link" to="/work">{sections.projects.all} <span aria-hidden="true">→</span></Link>
        </header>

        <article className="work-lead">
          <ImageSlot src={lead.image} folder="projects" alt={lead.imageAlt ?? `${lead.title} screenshot`} label={sections.placeholders.project} />
          <div className="work-lead-body">
            <Tags items={[...lead.tags, lead.year]} />
            <h3><Link to={`/work/${lead.slug}`} className="card-link">{lead.title}</Link></h3>
            <p>{lead.summary}</p>
            <p className="work-lead-result"><strong>{result.value}</strong> {result.label.toLowerCase()}</p>
          </div>
        </article>

        <ul className="work-grid">
          {rest.map(project => <li key={project.slug}><ProjectCard project={project} /></li>)}
          <li>
            <article className="project-card project-card-hobby">
              <ImageSlot src={game.image} folder="hobby" alt={`${game.title} screenshot`} label={sections.placeholders.project} />
              <div className="project-card-body">
                <Tags items={[sections.projects.hobbyTag, game.genre]} />
                <h3><Link to="/hobby-projects" className="card-link">{game.title}</Link></h3>
                <p className="muted">{game.summary}</p>
                <p className="card-result"><strong>{game.stats[0].value}</strong> {game.stats[0].label}</p>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </section>
  )
}
