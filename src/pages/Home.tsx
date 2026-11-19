import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Metadata } from '../components/Metadata'
import { site } from '../data/site'

export function Home() {
  const { skills, resume } = site
  return (
    <>
      <Metadata {...site.pages.home} />
      <Hero />
      <section id="stack" className="home-section shell" aria-labelledby="stack-title">
        <header className="home-section-heading">
          <p className="eyebrow">{skills.eyebrow}</p>
          <h2 id="stack-title">{skills.heading}</h2>
          <p>{skills.intro}</p>
        </header>
        <div className="stack">
          {skills.groups.map(({ title, tools }) => (
            <section key={title}>
              <h3>{title}</h3>
              <ul>{tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
            </section>
          ))}
        </div>
        <Link className="action" viewTransition to="/work">{site.work.browse} <span aria-hidden="true">↗</span></Link>
      </section>
      <section id="resume" className="home-section resume-section shell" aria-labelledby="resume-title">
        <header className="home-section-heading">
          <p className="eyebrow">{resume.eyebrow}</p>
          <h2 id="resume-title">{resume.heading}</h2>
          <p>{resume.intro}</p>
        </header>
        <div className="download-actions">
          {resume.downloads.map(({ label, href }) => (
            <a className="download-button" key={href} href={href} download>
              {label} <span aria-hidden="true">↓</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
