import { site } from '../data/site'
import { ProfileLinks } from './ProfileLinks'

export function Footer() {
  return (
    <footer className="footer shell">
      <div>
        <h2>{site.footer.heading}</h2>
        <ProfileLinks includeEmail />
      </div>
      <p>{site.footer.note}</p>
    </footer>
  )
}
