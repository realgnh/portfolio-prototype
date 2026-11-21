import type { Skill } from '../../content/skills'

/** Renders a skill's brand logo, a database glyph, or its initials as a fallback. */
export function BrandIcon({ skill }: { skill: Skill }) {
  const { icon, name } = skill
  if (icon === 'database') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" /><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
      </svg>
    )
  }
  if (icon) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" style={{ color: `#${icon.hex}` }} className="brand-logo">
        <path d={icon.path} fill="currentColor" />
      </svg>
    )
  }
  return <span aria-hidden="true" className="brand-initials">{name.slice(0, 2)}</span>
}
