import { experience } from '../../content/experience'
import { formatDuration, formatRange } from '../../lib/dates'

function initials(name: string) {
  return name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase()
}

/**
 * Rows of company logo, role, company, dates and length.
 * `limit` shows only the first N roles; `compact` shows one highlight each.
 */
export function ExperienceList({ compact = false, limit }: { compact?: boolean; limit?: number }) {
  return (
    <ol className="experience-list">
      {experience.slice(0, limit).map(({ company, role, start, end, location, logo, url, highlights }) => (
        <li key={`${company}-${role}`} className="experience-item">
          <div className="company-logo">
            {logo
              ? <img src={`/images/companies/${logo}`} alt={`${company} logo`} loading="lazy" />
              : <span role="img" aria-label={`${company} logo (placeholder)`}>{initials(company)}</span>}
          </div>
          <div className="experience-text">
            <h3>{role}</h3>
            <p className="muted">{url ? <a href={url}>{company}</a> : company}{location ? ` · ${location}` : ''}</p>
            {(compact ? highlights.slice(0, 1) : highlights).map(line => <p key={line} className="experience-highlight">{line}</p>)}
          </div>
          <p className="experience-period">
            <span>{formatRange(start, end)}</span>
            <small className="muted">{formatDuration(start, end)}</small>
          </p>
        </li>
      ))}
    </ol>
  )
}
