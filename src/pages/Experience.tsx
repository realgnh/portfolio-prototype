import { ExperienceList } from '../components/sections/ExperienceList'
import { Metadata } from '../components/ui/Metadata'
import { pages } from '../content/navigation'
import { sections } from '../content/sections'

/** /experience — every role with all its highlights. Data: src/content/experience.ts. */
export function Experience() {
  return (
    <section className="page shell" aria-labelledby="experience-page-title">
      <Metadata title={pages.experience.title} description={pages.experience.description} />
      <header className="page-header">
        <h1 id="experience-page-title">{pages.experience.title}</h1>
        <p className="muted">{sections.experience.pageIntro}</p>
      </header>
      <ExperienceList />
    </section>
  )
}
