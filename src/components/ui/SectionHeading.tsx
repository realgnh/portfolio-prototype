import type { ReactNode } from 'react'

/** Heading + optional one-line intro + optional action on the right. */
export function SectionHeading({ id, title, intro, action }: { id: string; title: string; intro?: string; action?: ReactNode }) {
  return (
    <header className="section-heading">
      <div>
        <h2 id={id}>{title}</h2>
        {intro && <p className="muted">{intro}</p>}
      </div>
      {action}
    </header>
  )
}
