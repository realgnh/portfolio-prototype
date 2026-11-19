import { site } from '../data/site'
import { Portrait } from './Portrait'

export function Hero() {
  const { before, accent, after } = site.tagline
  return (
    <section className="hero shell" aria-labelledby="intro-title">
      <div className="hero-frame">
        <div className="hero-bar eyebrow">
          <span>{site.name} / {site.hero.tab}</span>
          <span className="hero-status">{site.hero.status}</span>
        </div>
        <div className="hero-content">
          <div className="hero-copy">
            <h1 id="intro-title">{before}<br />{site.hero.secondLine}<em>{accent}</em>{after}</h1>
            <p>{site.hero.intro}</p>
          </div>
          <Portrait />
        </div>
        <a className="hero-scroll" href="#stack"><span aria-hidden="true">↓</span>{site.hero.scroll}</a>
      </div>
    </section>
  )
}
