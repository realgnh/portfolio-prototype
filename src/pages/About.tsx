import { Metadata } from '../components/Metadata'
import { Portrait } from '../components/Portrait'
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
        <Portrait />
      </div>
    </article>
  )
}
