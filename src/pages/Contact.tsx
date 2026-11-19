import { Metadata } from '../components/Metadata'
import { ProfileLinks } from '../components/ProfileLinks'
import { site } from '../data/site'

export function Contact() {
  // EXTENSION POINT: Add a contact form and submit handler here.
  return (
    <article className="inner-page shell">
      <Metadata {...site.pages.contact} />
      <header className="page-heading">
        <p className="eyebrow">{site.contact.eyebrow}</p>
        <h1>{site.pages.contact.title}</h1>
        <p className="lede">{site.contact.intro}</p>
      </header>
      <ProfileLinks includeEmail />
    </article>
  )
}
