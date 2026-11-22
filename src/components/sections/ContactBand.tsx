import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { Button } from '../ui/Button'

/** Closing section on Home: full-width signal orange. */
export function ContactBand() {
  return (
    <section className="contact-band" aria-labelledby="contact-band-title" data-scene="Contact">
      <div className="shell contact-band-inner">
        <h2 id="contact-band-title">{sections.contactBand.heading}</h2>
        <p>{sections.contactBand.text}</p>
        <div className="button-row">
          <Button to="/contact">{sections.hero.primary} <span aria-hidden="true">→</span></Button>
          <a className="contact-band-email" href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </div>
    </section>
  )
}
