/**
 * Cloudflare Pages Function: GET /api/github-contributions?login=<github login>[&year=2025]
 * Returns { total, days: [{ date, count, level }] } for the GitHub contribution chart.
 * Cached for an hour at Cloudflare's edge so GitHub is asked at most once an hour per location.
 */
import { fetchContributions, isValidLogin, isValidYear } from '../../src/lib/contributions'

const ONE_HOUR = 3600

export async function onRequestGet({ request }: { request: Request }) {
  const url = new URL(request.url)
  const login = url.searchParams.get('login') ?? ''
  if (!isValidLogin(login)) return Response.json({ error: 'bad-login' }, { status: 400 })
  const yearParam = url.searchParams.get('year')
  const year = yearParam ? Number(yearParam) : undefined
  if (year !== undefined && !isValidYear(year)) return Response.json({ error: 'bad-year' }, { status: 400 })

  const cache = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default
  const key = new Request(`https://contributions.cache/${login.toLowerCase()}/${year ?? 'last'}`)
  const hit = await cache?.match(key)
  if (hit) return hit

  try {
    const data = await fetchContributions(login, year)
    const response = Response.json(data, { headers: { 'cache-control': `public, max-age=${ONE_HOUR}` } })
    await cache?.put(key, response.clone())
    return response
  } catch {
    return Response.json({ error: 'github-unavailable' }, { status: 502 })
  }
}
