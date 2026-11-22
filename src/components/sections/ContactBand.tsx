import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { newTab } from '../../lib/links'

const links = ['GitHub', 'LinkedIn']
  .map(label => profile.socials.find(social => social.label === label))
  .filter((social): social is NonNullable<typeof social> => Boolean(social))

/** Closing section on Home: full-width signal orange. */
export function ContactBand() {
  return (
    <section className="contact-band" aria-labelledby="contact-band-title" data-scene="Contact">
      <div className="shell contact-band-inner">
        <h2 id="contact-band-title">{sections.contactBand.heading}</h2>
        <p>{sections.contactBand.text}</p>
        <ul className="contact-band-links">
          <li><a href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a></li>
          {links.map(({ label, href }) => (
            <li key={label}><a href={href} {...newTab}>{label} <span aria-hidden="true">↗</span></a></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
