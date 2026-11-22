import { Link } from 'react-router-dom'
import { easterEgg } from '../../content/easterEggs'
import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { useCopyEmail } from '../../lib/useCopyEmail'

export function Footer() {
  const copyEmail = useCopyEmail()
  return (
    <footer className="site-footer shell">
      <div className="footer-row">
        <Link to="/" className="monogram">{profile.initials}<span>.</span></Link>
        <div className="footer-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <button type="button" className="text-button" onClick={copyEmail}>{sections.contact.copy}</button>
          {profile.socials.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
        </div>
      </div>
      <p className="muted footer-note">{profile.footerNote}</p>
      {easterEgg.hint && <p className="footer-hint">🎮 {easterEgg.hint}</p>}
    </footer>
  )
}
