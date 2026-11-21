import { hobbies } from '../../content/hobbies'
import { sections } from '../../content/sections'
import { BrandIcon } from '../ui/BrandIcon'
import { Chip } from '../ui/Chip'
import { SectionHeading } from '../ui/SectionHeading'

/** Hobby cards (Roblox animation and game development). Data: src/content/hobbies.ts. */
export function Hobbies() {
  return (
    <section id="hobbies" className="section shell" aria-labelledby="hobbies-title">
      <SectionHeading id="hobbies-title" title={sections.hobbies.heading} intro={sections.hobbies.intro} />
      <ul className="hobby-grid">
        {hobbies.map(({ title, description, tone, icons, tags }) => (
          <li key={title} className="hobby-card" data-tone={tone}>
            <div className="hobby-icons">
              {icons.map(icon => <span key={icon.slug} className="hobby-icon" title={icon.title}><BrandIcon skill={{ name: icon.title, icon }} /></span>)}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul className="chip-row" aria-label={`${title} tags`}>
              {tags.map(tag => <li key={tag}><Chip>{tag}</Chip></li>)}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
