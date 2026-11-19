import { Link } from 'react-router-dom'
import { Metadata } from '../components/Metadata'
import { projects } from '../data/projects'
import { site } from '../data/site'

export function Resume() {
  const { resume, skills } = site
  const selectedProjects = projects.filter(project => resume.projectSlugs.includes(project.slug))

  return (
    <article className="inner-page shell">
      <Metadata {...site.pages.resume} />
      <header className="page-heading resume-heading">
        <div>
          <p className="eyebrow">{resume.eyebrow} · {site.name}</p>
          <h1>{resume.heading}</h1>
          <p className="lede">{resume.intro}</p>
        </div>
        <a className="cta-button resume-download" href={resume.download.href} download>
          <span className="cta-shimmer" aria-hidden="true" />
          {resume.download.label} <span className="cta-icon" aria-hidden="true">↓</span>
        </a>
      </header>

      <div className="resume-grid">
        <section className="resume-block" aria-labelledby="resume-education">
          <h2 id="resume-education">Education</h2>
          <ul className="resume-entries">
            {resume.education.map(({ program, school, period }) => (
              <li key={`${school}-${program}`}>
                <h3>{program}</h3>
                <p>{school} · {period}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="resume-block" aria-labelledby="resume-experience">
          <h2 id="resume-experience">Experience</h2>
          <ul className="resume-entries">
            {resume.experience.map(({ role, organization, period, highlights }) => (
              <li key={`${organization}-${role}-${period}`}>
                <h3>{role}</h3>
                <p>{organization} · {period}</p>
                <ul className="resume-highlights">
                  {highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>
        <section className="resume-block" aria-labelledby="resume-skills">
          <h2 id="resume-skills">Skills</h2>
          <dl className="resume-skills">
            {skills.groups.map(({ title, tools }) => (
              <div key={title}>
                <dt>{title}</dt>
                <dd>{tools.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="resume-block" aria-labelledby="resume-projects">
          <h2 id="resume-projects">Selected projects</h2>
          <ul className="resume-entries">
            {selectedProjects.map(({ slug, title, summary }) => (
              <li key={slug}>
                <h3><Link className="action" to={`/projects/${slug}`}>{title} <span aria-hidden="true">↗</span></Link></h3>
                <p>{summary}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
