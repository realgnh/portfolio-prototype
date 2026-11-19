import { profileLinks, site, ui } from '../data/site'

export function ProfileLinks({ className, includeEmail = false }: { className?: string; includeEmail?: boolean }) {
  return (
    <ul className={className ?? 'profile-links'} aria-label={ui.profileLinks}>
      {includeEmail && <li><a href={`mailto:${site.email}`}>{site.email}</a></li>}
      {profileLinks.map(({ label, href }) => (
        <li key={label}><a href={href}>{label} <span aria-hidden="true">↗</span></a></li>
      ))}
    </ul>
  )
}
