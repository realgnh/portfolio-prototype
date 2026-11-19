import { site } from '../data/site'

export function Portrait() {
  return (
    <figure className="portrait-figure">
      <div className="portrait" role="img" aria-label={site.about.portraitLabel}>
        <svg aria-hidden="true" viewBox="0 0 164 174" fill="none">
          <path d="M26 155v-13c0-17 16-34 38-42m36 0c22 8 38 25 38 42v13M82 102c-17 0-30-20-30-40a30 30 0 0 1 60 0c0 20-13 40-30 40Z" stroke="currentColor" strokeWidth="1" />
          <path d="M11 32V13h19m104 0h19v19m-142 109v19h19m104 0h19v-19" stroke="currentColor" strokeWidth="1" />
          <path d="M77 87h10m-5-5v10" stroke="currentColor" strokeWidth=".7" opacity=".55" />
        </svg>
      </div>
      <figcaption className="eyebrow">{site.about.portraitCaption}</figcaption>
    </figure>
  )
}
