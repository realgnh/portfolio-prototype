import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { toneOf } from '../../content/skills'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { SkillBubbles } from './SkillBubbles'

/** Top of Home: status, big name, role chips, intro and the two buttons, with floating skill bubbles. */
export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <SkillBubbles />
      <div className="hero-content">
        {profile.status && <p className="status-chip">{profile.status}</p>}
        <h1 id="hero-title"><span className="hero-im">I’m </span>{profile.name}</h1>
        <ul className="chip-row hero-roles" aria-label="Roles">
          {profile.roles.map(({ label, area }) => <li key={label}><Chip tone={toneOf(area)}>{label}</Chip></li>)}
        </ul>
        <p className="hero-intro muted">{profile.intro}</p>
        <div className="button-row">
          <Button to="/contact">{sections.hero.primary} <span aria-hidden="true">→</span></Button>
          <Button variant="outline" href={profile.resume.href} download>{sections.hero.secondary} <span aria-hidden="true">↓</span></Button>
        </div>
      </div>
    </section>
  )
}
