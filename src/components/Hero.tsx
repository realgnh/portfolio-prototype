import { site } from '../data/site'

export function Hero() {
  const { before, accent, after } = site.tagline
  return (
    <section className="hero shell">
      <h1>{before}<em>{accent}</em>{after}</h1>
      <p>{[site.name, site.role, site.location, site.background].join(' · ')}</p>
    </section>
  )
}
