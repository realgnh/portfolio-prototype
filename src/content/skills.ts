import { siDocker, siFastapi, siGit, siPostgresql, siPython, siPytorch, siReact, siTypescript } from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

/**
 * SKILL AREAS — each area has a pastel "tone" reused on chips, skill bubbles,
 * project cards and placeholders. Tones are defined in src/styles/tokens.css
 * as --tone-<name> (background) and --tone-<name>-ink (text on it).
 */
export const skillAreas = {
  languages: { label: 'Languages', tone: 'butter' },
  frontend: { label: 'Frontend', tone: 'peach' },
  backend: { label: 'Backend & data', tone: 'mint' },
  ai: { label: 'AI / ML', tone: 'lilac' },
  tools: { label: 'Tools', tone: 'sky' },
} as const

export type Area = keyof typeof skillAreas
export type Tone = (typeof skillAreas)[Area]['tone']

/**
 * SKILLS — shown as floating logo bubbles on Home and as a list on the résumé.
 *
 * - `icon`: a brand logo from the simple-icons package (https://simpleicons.org).
 *   To add one, import it above by its "si" name, e.g. `siJavascript`.
 *   Use 'database' for a generic database glyph. Leave it out to show initials.
 */
export type Skill = { name: string; area: Area; icon?: SimpleIcon | 'database' }

export const skills: Skill[] = [
  { name: 'Python', area: 'languages', icon: siPython },
  { name: 'TypeScript', area: 'languages', icon: siTypescript },
  { name: 'SQL', area: 'languages', icon: 'database' },
  { name: 'React', area: 'frontend', icon: siReact },
  { name: 'FastAPI', area: 'backend', icon: siFastapi },
  { name: 'PostgreSQL', area: 'backend', icon: siPostgresql },
  { name: 'PyTorch', area: 'ai', icon: siPytorch },
  { name: 'Git', area: 'tools', icon: siGit },
  { name: 'Docker', area: 'tools', icon: siDocker },
]

export function toneOf(area: Area): Tone {
  return skillAreas[area].tone
}
