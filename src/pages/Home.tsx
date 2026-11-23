import { Link } from 'react-router-dom'
import { About } from '../components/sections/About'
import { ContactBand } from '../components/sections/ContactBand'
import { ExperienceList } from '../components/sections/ExperienceList'
import { Hero } from '../components/sections/Hero'
import { SelectedWork } from '../components/sections/SelectedWork'
import { SkillsGrid } from '../components/sections/SkillsGrid'
import { Metadata } from '../components/ui/Metadata'
import { SectionHeading } from '../components/ui/SectionHeading'
import { pages } from '../content/navigation'
import { sections } from '../content/sections'

/**
 * Home, top to bottom. Reorder or remove sections here.
 * Each section's `data-scene` name becomes a ◆ keyframe on the scroll ruler.
 */
export function Home() {
  return (
    <>
      <Metadata title={pages.home.title} description={pages.home.description} />
      <Hero />

      <section id="experience" className="section shell" aria-labelledby="experience-title" data-scene="Experience">
        <SectionHeading
          id="experience-title"
          title={sections.experience.heading}
          action={<Link className="arrow-link" to="/experience">{sections.experience.all} <span aria-hidden="true">→</span></Link>}
        />
        <ExperienceList compact limit={sections.experience.homeCount} />
      </section>

      <SelectedWork />
      <SkillsGrid />
      <About />
      <ContactBand />
    </>
  )
}
