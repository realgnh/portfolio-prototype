import { Link } from 'react-router-dom'
import { Metadata } from '../components/Metadata'
import { ui } from '../data/site'

export function NotFound() {
  return (
    <section className="inner-page shell">
      <Metadata {...ui.notFound} />
      <header className="page-heading">
        <h1>{ui.notFound.title}</h1>
        <p className="lede">{ui.notFound.description}</p>
      </header>
      <Link className="action" to="/work" viewTransition>{ui.allWork}</Link>
    </section>
  )
}
