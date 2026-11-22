import { sections } from '../../content/sections'
import { skillAreas, skills } from '../../content/skills'
import type { Area } from '../../content/skills'
import { BrandIcon } from '../ui/BrandIcon'
import { SectionHeading } from '../ui/SectionHeading'

/** Skills grouped by area in plain columns. Data: src/content/skills.ts. */
export function SkillsGrid() {
  const areas = (Object.keys(skillAreas) as Area[]).filter(area => skills.some(skill => skill.area === area))
  return (
    <section id="skills" className="section shell" aria-labelledby="skills-title" data-scene="Skills">
      <SectionHeading id="skills-title" title={sections.skills.heading} intro={sections.skills.intro} />
      <div className="skills-grid">
        {areas.map(area => (
          <section key={area} className="skill-group" aria-labelledby={`skills-${area}`}>
            <h3 id={`skills-${area}`}>{skillAreas[area].label}</h3>
            <ul>
              {skills.filter(skill => skill.area === area).map(skill => (
                <li key={skill.name}><span className="skill-icon"><BrandIcon skill={skill} /></span>{skill.name}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
