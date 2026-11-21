import { Link } from 'react-router-dom'
import { site } from '../data/site'

// A hand-drawn-style schematic: baseline, dip while observing, climb while building, plateau once measured.
const trace = 'M38 92H110L148 112H196L246 76H288L342 54H378'
const points = [
  { x: 148, y: 112, labelY: 28 },
  { x: 246, y: 76, labelY: 136 },
  { x: 342, y: 54, labelY: 22 },
]

export function IterationFigure() {
  const { caption, steps } = site.hero.figure
  return (
    <figure className="hero-figure">
      <svg viewBox="0 0 400 150" role="img" aria-labelledby="fig-a-caption">
        <g className="fig-axes">
          <path d="M28 128V18M22 24l6-7 6 7M28 128H392M386 122l7 6-7 6" />
          <text x="22" y="146">t₀</text>
        </g>
        <path className="fig-trace" d={trace} pathLength={1} />
        {points.map(({ x, y, labelY }, index) => {
          const step = steps[index]
          const label = (
            <>
              <path className="fig-guide" d={`M${x} ${Math.min(y, labelY + 6)}V${Math.max(y, labelY - 12)}`} />
              <circle className="fig-point" cx={x} cy={y} r="4" style={{ animationDelay: `${0.5 + index * 0.35}s` }} />
              <text className="fig-label" x={x} y={labelY} textAnchor="middle">{step.label}</text>
            </>
          )
          return (
            <g key={step.label} className="fig-step">
              {step.to.startsWith('#')
                ? <a href={step.to}>{label}</a>
                : <Link to={step.to}>{label}</Link>}
            </g>
          )
        })}
      </svg>
      <figcaption id="fig-a-caption" className="label">{caption}</figcaption>
    </figure>
  )
}
