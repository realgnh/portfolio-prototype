/**
 * Notes (the blog): every Markdown file in src/content/notes/ except README.md.
 * Each starts with a small header (title, date, summary, tags) between --- lines.
 */
export type Note = { slug: string; title: string; date: string; summary: string; tags: string[]; body: string; minutes: number }

const files = import.meta.glob('../content/notes/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parse(path: string, raw: string): Note {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  const fields: Record<string, string> = {}
  for (const line of (match?.[1] ?? '').split('\n')) {
    const at = line.indexOf(':')
    if (at > 0) fields[line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  const body = match?.[2] ?? raw
  return {
    slug,
    title: fields.title || slug,
    date: fields.date || '',
    summary: fields.summary || '',
    tags: (fields.tags || '').split(',').map(tag => tag.trim()).filter(Boolean),
    body,
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
  }
}

/** All notes, newest first. */
export const notes: Note[] = Object.entries(files)
  .filter(([path]) => !path.endsWith('/README.md'))
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date))

/** '2026-11-18' → '18 November 2026'. */
export function formatNoteDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
