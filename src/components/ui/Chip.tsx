import type { ReactNode } from 'react'
import type { Tone } from '../../content/skills'

/** Small pastel pill. `tone` comes from a skill area (see content/skills.ts). */
export function Chip({ tone, children }: { tone?: Tone; children: ReactNode }) {
  return <span className="chip" data-tone={tone}>{children}</span>
}
