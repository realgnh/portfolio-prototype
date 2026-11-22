/**
 * Public GitHub data for the activity panel, fetched in the browser from api.github.com.
 * Looked up by your permanent account ID (profile.github.id), so a rename is picked up automatically.
 * Results are cached in the browser for an hour: GitHub allows 60 anonymous requests per hour per visitor.
 */
import { profile } from '../content/profile'

export type GitHubRepo = { name: string; description: string | null; language: string | null; stars: number; url: string; pushedAt: string }
export type GitHubEvent = { type: string; repo: string; createdAt: string; commits: number }
export type GitHubData = {
  login: string; name: string | null; avatar: string; url: string; publicRepos: number; followers: number
  repos: GitHubRepo[]; languages: { name: string; count: number }[]; events: GitHubEvent[]
}

const CACHE_KEY = 'portfolio-github'
const CACHE_MS = 60 * 60 * 1000

async function get<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!response.ok) throw new Error(`GitHub ${response.status}`)
  return response.json() as Promise<T>
}

type RawUser = { login: string; name: string | null; avatar_url: string; html_url: string; public_repos: number; followers: number }
type RawRepo = { name: string; description: string | null; language: string | null; stargazers_count: number; html_url: string; pushed_at: string; fork: boolean }
type RawEvent = { type: string; repo: { name: string }; created_at: string; payload?: { size?: number; commits?: unknown[] } }

export async function loadGitHub(): Promise<GitHubData> {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as { at: number; id: number; data: GitHubData } | null
    if (cached && cached.id === profile.github.id && Date.now() - cached.at < CACHE_MS) return cached.data
  } catch { /* ignore broken cache */ }

  const user = await get<RawUser>(`https://api.github.com/user/${profile.github.id}`)
  const [repos, events] = await Promise.all([
    get<RawRepo[]>(`https://api.github.com/users/${user.login}/repos?sort=pushed&per_page=30`),
    get<RawEvent[]>(`https://api.github.com/users/${user.login}/events/public?per_page=30`).catch(() => [] as RawEvent[]),
  ])
  const own = repos.filter(repo => !repo.fork)
  const languageCounts = new Map<string, number>()
  for (const repo of own) if (repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1)

  const data: GitHubData = {
    login: user.login, name: user.name, avatar: user.avatar_url, url: user.html_url,
    publicRepos: user.public_repos, followers: user.followers,
    repos: own.slice(0, profile.github.repoCount).map(repo => ({
      name: repo.name, description: repo.description, language: repo.language, stars: repo.stargazers_count, url: repo.html_url, pushedAt: repo.pushed_at,
    })),
    languages: [...languageCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5),
    events: events.slice(0, 6).map(event => ({
      type: event.type, repo: event.repo.name, createdAt: event.created_at,
      commits: event.payload?.size ?? event.payload?.commits?.length ?? 0,
    })),
  }
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), id: profile.github.id, data })) } catch { /* ignore */ }
  return data
}

/** "3 days ago" style text. */
export function timeAgo(iso: string, now = Date.now()) {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60000)
  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  const months = Math.round(days / 30)
  return months < 12 ? `${months} mo ago` : `${Math.round(months / 12)} yr ago`
}

/** Friendly description of a GitHub event. */
export function describeEvent(event: GitHubEvent) {
  const repo = event.repo.split('/')[1] ?? event.repo
  switch (event.type) {
    case 'PushEvent': return `Pushed ${event.commits || ''} ${event.commits === 1 ? 'commit' : 'commits'} to ${repo}`.replace('  ', ' ')
    case 'CreateEvent': return `Created ${repo}`
    case 'PullRequestEvent': return `Opened a pull request in ${repo}`
    case 'IssuesEvent': return `Worked on an issue in ${repo}`
    case 'WatchEvent': return `Starred ${repo}`
    case 'ForkEvent': return `Forked ${repo}`
    case 'ReleaseEvent': return `Published a release of ${repo}`
    default: return `Activity in ${repo}`
  }
}
