import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { smoothScrollToElement } from '../../lib/smoothScroll'
import { Button } from '../ui/Button'
import { OnionText } from '../ui/OnionText'
import { SkillBubbles } from './SkillBubbles'

/**
 * Top of Home, left-aligned: roles, big name (with onion-skin hover), one line, intro and buttons.
 * The skill bubbles float in their own stage on the right. Styles: "Hero" in home.css.
 */
export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title" data-scene="Intro">
      <div className="hero-content">
        <p className="hero-roles mono-meta">{profile.roles.join(' / ')}</p>
        <OnionText as="h1" id="hero-title" text={`${profile.name}.`} className="hero-name">
          {profile.name}<span className="hero-dot">.</span>
        </OnionText>
        <p className="hero-headline">{profile.headline}</p>
        <p className="hero-intro muted">{profile.intro}</p>
        <div className="button-row">
          <Button to="/contact">{sections.hero.primary} <span aria-hidden="true">→</span></Button>
          <Button variant="outline" href={profile.resume.href} download>{sections.hero.secondary} <span aria-hidden="true">↓</span></Button>
        </div>
        {profile.status && <p className="hero-status mono-meta">{profile.status}</p>}
      </div>
      <div className="hero-stage">
        <SkillBubbles />
      </div>
      <a
        className="scroll-cue"
        href="#experience"
        onClick={event => { event.preventDefault(); smoothScrollToElement(document.getElementById('experience')) }}
      >
        {sections.hero.scrollCue} <span className="scroll-cue-arrow" aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
