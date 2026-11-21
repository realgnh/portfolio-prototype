import { site } from '../data/site'
import { CopyEmail } from './CopyEmail'

export function Footer() {
  return (
    <footer className="footer shell">
      <div className="footer-row">
        <p className="label">{site.footer.label} / {site.initials}</p>
        <div className="footer-email">
          <a href={`mailto:${site.email}`}>{site.email} <span aria-hidden="true">↗</span></a>
          <CopyEmail />
        </div>
      </div>
      <p className="footer-note">{site.footer.note}</p>
    </footer>
  )
}
