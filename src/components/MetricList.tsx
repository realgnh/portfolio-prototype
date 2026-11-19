import type { Project } from '../data/projects'

export function MetricList({ metrics }: { metrics: Project['metrics'] }) {
  return (
    <dl className="metrics">
      {metrics.map(({ value, label }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
