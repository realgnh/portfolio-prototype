import type { ReactNode } from 'react'

/** Section heading with an optional action (e.g. "All work →") on the right. */
export function SectionHeading({ id, title, action }: { id: string; title: string; action?: ReactNode }) {
  return (
    <header className="section-heading">
      <div>
        <h2 id={id}>{title}</h2>
      </div>
      {action}
    </header>
  )
}
