import { Metadata } from '../components/ui/Metadata'
import { ImageSlot } from '../components/ui/ImageSlot'
import { OnionText } from '../components/ui/OnionText'
import { Tags } from '../components/ui/Tags'
import { hobbyProjects } from '../content/hobbyProjects'
import { pages } from '../content/navigation'
import { sections } from '../content/sections'

/**
 * /hobby-projects — Roblox games, the Luau systems behind them and an animation reel.
 * Data: src/content/hobbyProjects.ts. Styles: "Hobby projects" in pages.css.
 */
export function HobbyProjects() {
  const { featured, games, systems, reel, intro } = hobbyProjects
  const copy = sections.hobby

  return (
    <>
      <section className="page shell" aria-labelledby="hobby-title">
        <Metadata title={pages.hobby.title} description={pages.hobby.description} />
        <header className="page-header" data-scene={pages.hobby.title}>
          <OnionText as="h1" id="hobby-title" text={pages.hobby.title} />
          <p className="lede muted">{intro}</p>
        </header>

        <article className="game-featured" aria-labelledby="featured-game" data-scene={copy.featured}>
          <ImageSlot src={featured.image} folder="hobby" alt={`${featured.title} screenshot`} label={sections.placeholders.project} />
          <div className="game-featured-body">
            <p className="eyebrow">{copy.featured}</p>
            <h2 id="featured-game">{featured.title}</h2>
            <p className="mono-meta">{featured.genre} · {featured.role}</p>
            <p>{featured.summary}</p>
            <dl className="big-stats">
              {featured.stats.map(stat => <div key={stat.label}><dd>{stat.value}</dd><dt>{stat.label}</dt></div>)}
            </dl>
            <Tags items={featured.tags} />
            {featured.url && <a className="button button-primary" href={featured.url}>{copy.play} <span aria-hidden="true">↗</span></a>}
          </div>
        </article>

        <section aria-labelledby="more-games" data-scene={copy.more}>
          <h2 id="more-games" className="section-title">{copy.more}</h2>
          <ul className="game-list">
            {games.map(game => (
              <li key={game.title}>
                <div>
                  <h3>{game.title}</h3>
                  <p className="mono-meta">{game.genre} · {game.role}</p>
                </div>
                <p className="muted">{game.summary}</p>
                <p className="game-stat">{game.stats.map(stat => <span key={stat.label}><strong>{stat.value}</strong> {stat.label}</span>)}</p>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section className="band" aria-labelledby="systems-title" data-scene={copy.systems}>
        <div className="shell band-inner">
          <h2 id="systems-title" className="section-title">{copy.systems}</h2>
          <p className="band-intro">{copy.systemsIntro}</p>
          <ul className="system-grid">
            {systems.map(system => (
              <li key={system.title}>
                <h3>{system.title}</h3>
                <p>{system.summary}</p>
                <Tags items={system.tags} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell section" aria-labelledby="reel-title" data-scene={reel.title}>
        <h2 id="reel-title" className="section-title">{reel.title}</h2>
        <p className="muted">{reel.summary}</p>
        <div className="reel">
          {reel.video
            ? <video src={`/videos/hobby/${reel.video}`} controls playsInline preload="metadata" />
            : <ImageSlot folder="hobby" alt={reel.title} label={copy.reelPlaceholder} />}
        </div>
      </section>
    </>
  )
}
