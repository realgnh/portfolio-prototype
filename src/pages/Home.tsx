import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Metadata } from '../components/Metadata'
import { site } from '../data/site'

export function Home() {
  const { about, skills, resume } = site
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
        <Link className="cta-button cta-primary" to="/work">
          <span className="cta-shimmer" aria-hidden="true" />
          {site.work.browse} <span className="cta-icon" aria-hidden="true">↗</span>
        </Link>
      </section>
      <section id="about" className="home-section profile-section shell" aria-labelledby="about-title">
        <header className="home-section-heading">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 id="about-title">{about.heading}</h2>
          <p>{about.bio}</p>
        </header>
        <div className="side-projects">
          <h3>{about.roblox.heading}</h3>
          <p>{about.roblox.intro}</p>
          <ul>
            {about.roblox.games.map(({ name, description, href }) => (
              <li key={name}>
                <a href={href}>{name} <span aria-hidden="true">↗</span></a>
                <p>{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="resume" className="home-section resume-section shell" aria-labelledby="resume-title">
        <header className="home-section-heading">
          <p className="eyebrow">{resume.eyebrow}</p>
          <h2 id="resume-title">{resume.heading}</h2>
          <p>{resume.intro}</p>
        </header>
        <a className="cta-button" href={resume.download.href} download>
          <span className="cta-shimmer" aria-hidden="true" />
          {resume.download.label} <span className="cta-icon" aria-hidden="true">↓</span>
        </a>
      </section>
    </>
  )
}
