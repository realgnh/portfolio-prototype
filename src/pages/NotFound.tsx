import { Button } from '../components/ui/Button'
import { Metadata } from '../components/ui/Metadata'
import { sections } from '../content/sections'

export function NotFound() {
  return (
    <section className="page shell">
      <Metadata title={sections.notFound.title} description={sections.notFound.description} />
      <header className="page-header">
        <h1>{sections.notFound.title}</h1>
        <p className="muted">{sections.notFound.description}</p>
      </header>
      <div><Button to="/projects">{sections.project.back} <span aria-hidden="true">→</span></Button></div>
    </section>
  )
}
