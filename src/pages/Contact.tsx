import { useEffect, useState } from 'react'
import { GitHubActivity } from '../components/sections/GitHubActivity'
import { Button } from '../components/ui/Button'
import { Metadata } from '../components/ui/Metadata'
import { pages } from '../content/navigation'
import { profile } from '../content/profile'
import { sections } from '../content/sections'
import { differenceFrom, greetingFor } from '../lib/timeGreeting'
import { useCopyEmail } from '../lib/useCopyEmail'
import { newTab } from '../lib/links'

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', timeZone: profile.timeZone }).format(date)
}

export function Contact() {
  const copy = sections.contact
  const copyEmail = useCopyEmail()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <article className="page shell">
        <Metadata title={pages.contact.title} description={pages.contact.description} />
        <header className="page-header">
          <h1>{copy.heading}</h1>
          <p className="lede muted">{profile.contactIntro}</p>
        </header>

        <div className="contact-grid">
          <section className="contact-card contact-card-main" aria-labelledby="contact-email">
            <h2 id="contact-email" className="eyebrow">{copy.email}</h2>
            <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
            <div className="button-row">
              <button type="button" className="button button-primary" onClick={copyEmail}>{copy.copy}</button>
              <Button variant="outline" href={profile.resume.href} download>{profile.resume.label} <span aria-hidden="true">↓</span></Button>
            </div>
          </section>

          <section className="contact-card" data-tone="sky" aria-labelledby="contact-time">
            <h2 id="contact-time" className="eyebrow">{copy.localTime}</h2>
            <p className="local-time"><time dateTime={now.toISOString()}>{formatTime(now)}</time></p>
            <p className="muted">{profile.location}</p>
            <p className="time-greeting">
              <strong>{greetingFor(now.getHours())}</strong> {differenceFrom(profile.timeZone, now)}
            </p>
          </section>

          <section className="contact-card contact-card-elsewhere" aria-labelledby="contact-elsewhere">
            <h2 id="contact-elsewhere" className="eyebrow">{copy.elsewhere}</h2>
            <ul className="social-list" aria-label="Contact links">
              {profile.socials.map(({ label, href }, index) => (
                <li key={href} data-rank={Math.min(index + 1, 3)}>
                  <a className="social-link" href={href} {...newTab}>
                    <span>{label}</span>
                    <span className="social-handle muted">{href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                    <span className="social-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
      <GitHubActivity />
    </>
  )
}
