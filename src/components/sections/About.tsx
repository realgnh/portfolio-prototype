import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { ImageSlot } from '../ui/ImageSlot'

/** Bold "About me": a big statement, a photo slot, two short paragraphs, quick facts and the Now playing / learning line. */
export function About() {
  const { about, now } = profile
  return (
    <section id="about" className="section shell about" aria-labelledby="about-title">
      <p className="eyebrow" id="about-title">{sections.about.heading}</p>
      <p className="about-statement">{about.statement}</p>
      <div className="about-grid">
        <div className="about-photo">
          <ImageSlot src={about.photo} folder="root" alt={`Photo of ${profile.name}`} label={sections.placeholders.photo} tone="lilac" shape="square" />
        </div>
        <div className="about-body">
          {about.paragraphs.map(text => <p key={text}>{text}</p>)}
          <dl className="about-facts">
            {about.facts.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          {(now.playing || now.learning) && (
            <ul className="now-line" aria-label="Now">
              {now.playing && (
                <li><span className="equalizer" aria-hidden="true"><i /><i /><i /></span><strong>{sections.about.nowPlaying}:</strong> {now.playing}</li>
              )}
              {now.learning && <li><span className="now-dot" aria-hidden="true">✦</span><strong>{sections.about.nowLearning}:</strong> {now.learning}</li>}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
