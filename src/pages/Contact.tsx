import { CopyEmail } from '../components/CopyEmail'
import { Metadata } from '../components/Metadata'
import { contactLinks, site, ui } from '../data/site'

export function Contact() {
  // EXTENSION POINT: Add a contact form and submit handler here.
  return (
    <article className="page shell">
      <Metadata {...site.pages.contact} />
      <header className="sheet-head">
        <p className="label">{site.contact.eyebrow}</p>
        <h1>{site.contact.heading}</h1>
        <p className="lede">{site.contact.intro}</p>
      </header>
      <ul className="contact-list" aria-label={ui.contactLinks}>
        {contactLinks.map(link => (
          <li key={link.href}>
            <span className="label">{'channel' in link ? link.channel : link.label}</span>
            <a href={link.href}>{'channel' in link ? link.label : link.href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')} <span aria-hidden="true">↗</span></a>
            {'channel' in link && <CopyEmail />}
          </li>
        ))}
      </ul>
    </article>
  )
}
