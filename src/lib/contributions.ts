/**
 * GitHub contribution calendar ("42 contributions in the last year" + the green squares).
 * GitHub has no public API for it, so we read the same HTML fragment github.com uses:
 * https://github.com/users/<login>/contributions. Browsers can't fetch it directly (CORS),
 * so functions/api/github-contributions.ts (live site) and vite.config.ts (npm run dev) do.
 */
export type ContributionDay = { date: string; count: number; level: number }
export type Contributions = { total: number; days: ContributionDay[] }

/** Parses the contributions HTML into a total and one entry per day (oldest first). */
export function parseContributions(html: string): Contributions {
  const counts = new Map<string, number>()
  for (const match of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>\s*(No|\d[\d,]*) contributions?/g)) {
    counts.set(match[1], match[2] === 'No' ? 0 : Number(match[2].replace(/,/g, '')))
  }
  const days: ContributionDay[] = []
  for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = tag.match(/data-date="([^"]+)"/)?.[1]
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0)
    const id = tag.match(/\bid="([^"]+)"/)?.[1] ?? ''
    if (date) days.push({ date, level, count: counts.get(id) ?? (level ? 1 : 0) })
  }
  days.sort((a, b) => a.date.localeCompare(b.date))
  const totalText = html.replace(/\s+/g, ' ').match(/([\d,]+) contributions? in the last year/)?.[1]
  const total = totalText ? Number(totalText.replace(/,/g, '')) : days.reduce((sum, day) => sum + day.count, 0)
  return { total, days }
}

/** GitHub usernames: letters, digits and single hyphens, up to 39 characters. */
export function isValidLogin(login: string) {
  return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(login)
}

/** Fetches and parses the calendar from github.com (server side only: function or dev server). */
export async function fetchContributions(login: string): Promise<Contributions> {
  const response = await fetch(`https://github.com/users/${login}/contributions`, {
    headers: { 'User-Agent': 'portfolio-contributions', Accept: 'text/html' },
  })
  if (!response.ok) throw new Error(`GitHub ${response.status}`)
  return parseContributions(await response.text())
}
