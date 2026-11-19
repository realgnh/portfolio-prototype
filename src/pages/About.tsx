import { Metadata } from '../components/Metadata'
import { ProfileLinks } from '../components/ProfileLinks'
import { site } from '../data/site'

export function About() {
  const { about, pages } = site
  return (
    <article className="inner-page shell">
      <Metadata {...pages.about} />
      <header className="page-heading">
        <p className="eyebrow">{about.eyebrow}</p>
        <h1>{pages.about.title}</h1>
      </header>
      <div className="about-layout">
        <div>
          <p className="lede">{about.bio}</p>
          <ProfileLinks includeEmail />
          <section className="experience">
            <h2>{about.experienceHeading}</h2>
            <ul>
              {about.experience.map(({ organization, role, period }) => (
                <li key={organization}><div>{organization}<p>{role}</p></div><span className="eyebrow">{period}</span></li>
              ))}
            </ul>
          </section>
        </div>
        <figure>
          <div className="portrait" role="img" aria-label={about.portraitLabel}>
            <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.35">
              <circle cx="50" cy="37" r="13" />
              <path d="M25 78a25 25 0 0 1 50 0H25Z" />
            </svg>
          </div>
          <figcaption className="eyebrow">{about.portraitCaption}</figcaption>
        </figure>
      </div>
    </article>
  )
}
