import { useEffect } from 'react'
import { site } from '../data/site'

export function Hero() {
  const { before, accent, after } = site.tagline

  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function update() {
      frame = 0
      const depth = Math.max(0, Math.min(window.scrollY / 520, 1))
      root.style.setProperty('--top-glow-opacity', (1 - depth * (reduced.matches ? 0.12 : 0.32)).toFixed(3))
    }

    function queueUpdate() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    reduced.addEventListener('change', queueUpdate)
    return () => {
      window.removeEventListener('scroll', queueUpdate)
      reduced.removeEventListener('change', queueUpdate)
      cancelAnimationFrame(frame)
      root.style.removeProperty('--top-glow-opacity')
    }
  }, [])
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
        </div>
        <a className="hero-scroll" href="#stack"><span aria-hidden="true">↓</span>{site.hero.scroll}</a>
      </div>
    </section>
  )
}
