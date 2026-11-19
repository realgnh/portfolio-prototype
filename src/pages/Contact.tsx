import { Metadata } from '../components/Metadata'
import { contactLinks, site, ui } from '../data/site'

export function Contact() {
  // EXTENSION POINT: Add a contact form and submit handler here.
  return (
    <article className="inner-page contact-page shell">
      <Metadata {...site.pages.contact} />
      <header className="page-heading">
        <p className="eyebrow">{site.contact.eyebrow}</p>
        <h1>{site.pages.contact.title}</h1>
        <p className="lede">{site.contact.intro}</p>
      </header>
      <ul className="contact-links" aria-label={ui.contactLinks}>
        {contactLinks.map(link => (
          <li key={link.href}>
            <a href={link.href}>
              {'channel' in link && <span className="eyebrow" aria-hidden="true">{link.channel}</span>}
              <span>{link.label}</span>
              <span className="contact-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
