import { site } from '../data/site'
import { IterationFigure } from './IterationFigure'

export function Hero() {
  return (
    <section id="about" className="hero shell" aria-labelledby="intro-title">
      <div className="hero-sheet">
        <p className="label hero-sheet-label">
          <span>{site.hero.sheet}</span>
          <span aria-hidden="true">/</span>
          <span>{site.hero.title}</span>
        </p>
        <h1 id="intro-title">{site.name}</h1>
        <p className="hero-intro">{site.hero.intro}</p>
      </div>
      <IterationFigure />
    </section>
  )
}
