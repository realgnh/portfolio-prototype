import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { ImageSlot } from '../ui/ImageSlot'

/** "The short version": photo slot, one bold line, one paragraph, quick facts, Now playing / learning and a one-line "Currently building". */
export function About() {
  const { about, now } = profile
  return (
    <section id="about" className="section shell about" aria-labelledby="about-title" data-scene="About">
      <div className="about-grid">
        <div className="about-photo">
          <ImageSlot src={about.photo} folder="root" alt={`Photo of ${profile.name}`} label={sections.placeholders.photo} tone="lilac" shape="square" />
        </div>
        <div className="about-body">
          <h2 id="about-title" className="eyebrow">{sections.about.heading}</h2>
          <p className="about-statement">{about.statement}</p>
          <p>{about.paragraph}</p>
          <dl className="about-facts">
            {about.facts.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          {(now.playing || now.learning) && (
            <ul className="now-line" aria-label="Now">
              {now.playing && (
                <li><span className="equalizer" aria-hidden="true"><i /><i /><i /></span><strong>{sections.about.nowPlaying}:</strong> {now.playing}</li>
              )}
              {now.learning && <li><span className="now-dot" aria-hidden="true">◆</span><strong>{sections.about.nowLearning}:</strong> {now.learning}</li>}
            </ul>
          )}
          {profile.currently && <p className="currently mono-meta">{sections.about.currently} <span>{profile.currently}</span></p>}
        </div>
      </div>
    </section>
  )
}
