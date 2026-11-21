import { experience } from '../../content/experience'

function initials(name: string) {
  return name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase()
}

/** Rows of company logo, role, company and dates. `compact` shows one highlight each. */
export function ExperienceList({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="experience-list">
      {experience.map(({ company, role, period, location, logo, url, highlights }) => (
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
          <p className="experience-period muted">{period}</p>
        </li>
      ))}
    </ol>
  )
}
