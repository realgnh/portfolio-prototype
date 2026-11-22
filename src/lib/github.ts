/**
 * Public GitHub data for the "On GitHub" section (Contact page), fetched in the browser.
 * - Account looked up by permanent ID (profile.github.id), so renames are picked up automatically.
 * - Contribution chart from /api/github-contributions (see lib/contributions.ts); it includes
 *   private contributions as counts, like on your GitHub profile.
 * - "Contribution activity" (commits, new repositories, pull requests) for this month and last,
 *   built from the public REST API. Private repositories aren't visible to visitors.
 * Everything is cached in the browser for an hour (GitHub allows 60 anonymous requests/hour).
 */
import { profile } from '../content/profile'
import type { Contributions } from './contributions'

export type GitHubRepo = { name: string; description: string | null; language: string | null; stars: number; url: string; pushedAt: string; createdAt: string }
export type ActivityMonth = {
  month: string // 'YYYY-MM'
  contributions: number | null
  commits: { repo: string; url: string; count: number }[]
  created: { repo: string; url: string; language: string | null; date: string }[]
  pullRequests: { repo: string; title: string; url: string; merged: boolean; date: string }[]
}
export type GitHubData = {
  login: string; name: string | null; avatar: string; url: string; publicRepos: number; followers: number
  repos: GitHubRepo[]; languages: { name: string; count: number }[]
  contributions: Contributions | null
  activity: ActivityMonth[]
}

const CACHE_KEY = 'portfolio-github-v3'
const CACHE_MS = 60 * 60 * 1000
/** How many recently pushed repositories to count commits in (one request each). */
const COMMIT_REPOS = 5

async function get<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!response.ok) throw new Error(`GitHub ${response.status}`)
  return response.json() as Promise<T>
}

type RawUser = { login: string; name: string | null; avatar_url: string; html_url: string; public_repos: number; followers: number }
type RawRepo = { name: string; full_name: string; description: string | null; language: string | null; stargazers_count: number; html_url: string; pushed_at: string; created_at: string; fork: boolean; private?: boolean; visibility?: string }
type RawEvent = { type: string; repo: { name: string }; created_at: string; payload?: { action?: string; number?: number } }
type RawCommit = { commit: { author: { date: string } } }
type RawPull = { title: string; html_url: string; merged_at: string | null; created_at: string }

const monthOf = (iso: string) => iso.slice(0, 7)

/** First day of last month (UTC), as an ISO string: the start of the activity window. */
function windowStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString()
}

async function loadContributions(login: string): Promise<Contributions | null> {
  try {
    const response = await fetch(`/api/github-contributions?login=${encodeURIComponent(login)}`)
    return response.ok ? await response.json() as Contributions : null
  } catch { return null }
}

export async function loadGitHub(): Promise<GitHubData> {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as { at: number; id: number; data: GitHubData } | null
    if (cached && cached.id === profile.github.id && Date.now() - cached.at < CACHE_MS) return cached.data
  } catch { /* ignore broken cache */ }

  const user = await get<RawUser>(`https://api.github.com/user/${profile.github.id}`)
  const login = user.login
  const since = windowStart()
  const [repos, events, contributions] = await Promise.all([
    get<RawRepo[]>(`https://api.github.com/users/${login}/repos?type=owner&sort=pushed&per_page=30`),
    get<RawEvent[]>(`https://api.github.com/users/${login}/events/public?per_page=100`).catch(() => [] as RawEvent[]),
    loadContributions(login),
  ])
  // Only your own, public repositories (never forks or private ones).
  const own = repos.filter(repo => !repo.fork && !repo.private && (repo.visibility ?? 'public') === 'public')

  // Commits per repository, per month (only commits GitHub links to this account).
  const recent = own.filter(repo => repo.pushed_at >= since).slice(0, COMMIT_REPOS)
  const commitLists = await Promise.all(recent.map(repo =>
    get<RawCommit[]>(`https://api.github.com/repos/${repo.full_name}/commits?author=${login}&since=${since}&per_page=100`).catch(() => [] as RawCommit[])))

  // Pull requests opened in the window (event payloads no longer include titles, so look them up).
  const opened = events.filter(event => event.type === 'PullRequestEvent' && event.payload?.action === 'opened' && event.created_at >= since && event.payload.number).slice(0, 3)
  const pulls = await Promise.all(opened.map(event =>
    get<RawPull>(`https://api.github.com/repos/${event.repo.name}/pulls/${event.payload!.number}`).then(pull => ({ pull, repo: event.repo.name })).catch(() => null)))

  const months = [monthOf(new Date().toISOString()), monthOf(since)]
  const activity: ActivityMonth[] = months.map(month => ({
    month,
    contributions: contributions ? contributions.days.filter(day => day.date.startsWith(month)).reduce((sum, day) => sum + day.count, 0) : null,
    commits: recent.map((repo, index) => ({ repo: repo.full_name, url: `${repo.html_url}/commits?author=${login}`, count: commitLists[index].filter(commit => monthOf(commit.commit.author.date) === month).length }))
      .filter(item => item.count > 0).sort((a, b) => b.count - a.count),
    created: own.filter(repo => monthOf(repo.created_at) === month)
      .map(repo => ({ repo: repo.full_name, url: repo.html_url, language: repo.language, date: repo.created_at })),
    pullRequests: pulls.filter(item => item && monthOf(item.pull.created_at) === month)
      .map(item => ({ repo: item!.repo, title: item!.pull.title, url: item!.pull.html_url, merged: Boolean(item!.pull.merged_at), date: item!.pull.created_at })),
  })).filter(month => month.contributions || month.commits.length || month.created.length || month.pullRequests.length)

  const languageCounts = new Map<string, number>()
  for (const repo of own) if (repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1)

  const data: GitHubData = {
    login, name: user.name, avatar: user.avatar_url, url: user.html_url, publicRepos: user.public_repos, followers: user.followers,
    repos: own.slice(0, profile.github.repoCount).map(repo => ({
      name: repo.name, description: repo.description, language: repo.language, stars: repo.stargazers_count, url: repo.html_url, pushedAt: repo.pushed_at, createdAt: repo.created_at,
    })),
    languages: [...languageCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5),
    contributions,
    activity,
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

/** 'YYYY-MM' → 'November 2026'. */
export function monthLabel(month: string) {
  const [year, number] = month.split('-').map(Number)
  return new Date(Date.UTC(year, number - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/** Common GitHub language colours for the little dots. */
export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572a5', HTML: '#e34c26', CSS: '#563d7c', Lua: '#000080', Luau: '#00a2ff',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600', Go: '#00add8', Rust: '#dea584', Shell: '#89e051', 'Jupyter Notebook': '#da5b0b',
}
