import { Link } from 'react-router-dom'
import { Metadata } from '../components/Metadata'
import { ui } from '../data/site'

export function NotFound() {
  return (
    <section className="page shell">
      <Metadata {...ui.notFound} />
      <header className="sheet-head">
        <p className="label">Sheet 404</p>
        <h1>{ui.notFound.title}</h1>
        <p className="lede">{ui.notFound.description}</p>
      </header>
      <Link className="text-link label" to="/projects">{ui.allProjects} <span aria-hidden="true">→</span></Link>
    </section>
  )
}
