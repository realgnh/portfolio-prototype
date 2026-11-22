import { Button } from '../components/ui/Button'
import { JumpGame } from '../components/ui/JumpGame'
import { Metadata } from '../components/ui/Metadata'
import { sections } from '../content/sections'

/** 404 page: a short message, a way back, and the jump game to pass the time. */
export function NotFound() {
  return (
    <section className="page shell not-found">
      <Metadata title={sections.notFound.title} description={sections.notFound.description} />
      <header className="page-header" data-scene="Not found">
        <p className="mono-meta">{sections.notFound.code}</p>
        <h1>{sections.notFound.title}</h1>
        <p className="muted">{sections.notFound.description}</p>
      </header>
      <JumpGame />
      <div><Button to="/work">{sections.project.back} <span aria-hidden="true">→</span></Button></div>
    </section>
  )
}
