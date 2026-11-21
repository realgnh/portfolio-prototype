import { profile } from '../../content/profile'
import { sections } from '../../content/sections'

export function CurrentlyList() {
  return (
    <section className="section shell" aria-labelledby="currently-title">
      <h2 id="currently-title">{sections.currently.heading}</h2>
      <dl className="currently-list">
        {profile.currently.map(({ label, text }) => (
          <div key={label}><dt>{label}</dt><dd>{text}</dd></div>
        ))}
      </dl>
    </section>
  )
}
