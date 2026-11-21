import { Link } from 'react-router-dom'
import { ExperienceList } from '../components/sections/ExperienceList'
import { BrandIcon } from '../components/ui/BrandIcon'
import { Button } from '../components/ui/Button'
import { Metadata } from '../components/ui/Metadata'
import { pages } from '../content/navigation'
import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { sections } from '../content/sections'
import { skillAreas, skills } from '../content/skills'
import type { Area } from '../content/skills'

export function Resume() {
  const copy = sections.resume
  const selected = projects.filter(project => copy.projectSlugs.includes(project.slug))

  return (
    <article className="page shell">
      <Metadata title={pages.resume.title} description={pages.resume.description} />
      <header className="page-header page-header-split">
        <div>
          <h1>{copy.heading}</h1>
          <p className="muted">{copy.intro}</p>
        </div>
        <Button href={profile.resume.href} download>{profile.resume.label} <span aria-hidden="true">↓</span></Button>
      </header>

      <section className="resume-section" aria-labelledby="resume-experience">
        <h2 id="resume-experience">{copy.experience}</h2>
        <ExperienceList />
      </section>

      <section className="resume-section" aria-labelledby="resume-education">
        <h2 id="resume-education">{copy.education}</h2>
        <ul className="plain-list">
          {profile.education.map(({ program, school, period }) => (
            <li key={program}><h3>{program}</h3><p className="muted">{school} · {period}</p></li>
          ))}
        </ul>
      </section>

      <section className="resume-section" aria-labelledby="resume-skills">
        <h2 id="resume-skills">{copy.skills}</h2>
        <dl className="skill-table">
          {(Object.keys(skillAreas) as Area[]).map(area => (
            <div key={area}>
              <dt>{skillAreas[area].label}</dt>
              <dd className="tool-list">
                {skills.filter(skill => skill.area === area).map(skill => (
                  <span key={skill.name} className="tool"><span className="tool-icon"><BrandIcon skill={skill} /></span>{skill.name}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="resume-section" aria-labelledby="resume-projects">
        <h2 id="resume-projects">{copy.projects}</h2>
        <ul className="plain-list">
          {selected.map(project => (
            <li key={project.slug}>
              <h3><Link className="arrow-link" to={`/projects/${project.slug}`}>{project.title} <span aria-hidden="true">↗</span></Link></h3>
              <p className="muted">{project.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
