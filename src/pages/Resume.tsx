import { Link } from 'react-router-dom'
import { Metadata } from '../components/Metadata'
import { projects } from '../data/projects'
import { recordNumber, site, ui } from '../data/site'

export function Resume() {
  const { resume, skills } = site
  const selected = projects
    .map((project, index) => ({ project, number: recordNumber(index) }))
    .filter(({ project }) => resume.projectSlugs.includes(project.slug))

  return (
    <article className="page shell">
      <Metadata {...site.pages.resume} />
      <header className="sheet-head resume-head">
        <div>
          <p className="label">{resume.eyebrow}</p>
          <h1>{resume.heading}</h1>
          <p className="lede">{resume.intro}</p>
        </div>
        <a className="button" href={resume.download.href} download>
          {resume.download.label} <span aria-hidden="true">↓</span>
        </a>
      </header>

      <div className="resume-grid">
        <section className="resume-block" aria-labelledby="resume-education">
          <h2 id="resume-education" className="label">Education</h2>
          <ul>
            {resume.education.map(({ program, school, period }) => (
              <li key={`${school}-${program}`}>
                <h3>{program}</h3>
                <p className="label">{school} / {period}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="resume-block" aria-labelledby="resume-experience">
          <h2 id="resume-experience" className="label">Experience</h2>
          <ul>
            {resume.experience.map(({ role, organization, period, highlights }) => (
              <li key={`${organization}-${role}-${period}`}>
                <h3>{role}</h3>
                <p className="label">{organization} / {period}</p>
                <ul className="bullets">{highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
              </li>
            ))}
          </ul>
        </section>
        <section className="resume-block" aria-labelledby="resume-skills">
          <h2 id="resume-skills" className="label">Skills</h2>
          <dl className="field-list">
            {skills.groups.map(({ title, tools }) => (
              <div key={title}><dt className="label">{title}</dt><dd>{tools.join(' · ')}</dd></div>
            ))}
          </dl>
        </section>
        <section className="resume-block" aria-labelledby="resume-projects">
          <h2 id="resume-projects" className="label">Selected experiments</h2>
          <ul>
            {selected.map(({ project, number }) => (
              <li key={project.slug}>
                <h3><Link to={`/projects/${project.slug}`}>{project.title} <span aria-hidden="true">↗</span></Link></h3>
                <p className="label">{ui.experiment} {number} / {project.metrics[0].value} {project.metrics[0].label.toLowerCase()}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
