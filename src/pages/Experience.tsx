import { Timeline } from '../components/sections/Timeline'
import { Metadata } from '../components/ui/Metadata'
import { pages } from '../content/navigation'
import { sections } from '../content/sections'

/** /experience — roles, projects and milestones on one timeline. Data: src/lib/timeline.ts. */
export function Experience() {
  return (
    <section className="page shell" aria-labelledby="experience-page-title">
      <Metadata title={pages.experience.title} description={pages.experience.description} />
      <header className="page-header" data-scene="Experience">
        <h1 id="experience-page-title">{pages.experience.title}</h1>
      </header>
      <Timeline />
    </section>
  )
}
