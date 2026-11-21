import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { Button } from '../ui/Button'

/** Closing call to action on Home. */
export function ContactBand() {
  return (
    <section className="contact-band shell" aria-labelledby="contact-band-title">
      <h2 id="contact-band-title">{sections.contactBand.heading}</h2>
      <p className="muted">{sections.contactBand.text}</p>
      <div className="button-row">
        <Button to="/contact">{sections.hero.primary} <span aria-hidden="true">→</span></Button>
        <Button variant="outline" href={profile.resume.href} download>{sections.hero.secondary} <span aria-hidden="true">↓</span></Button>
      </div>
    </section>
  )
}
