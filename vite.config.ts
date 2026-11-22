import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { fetchContributions, isValidLogin, isValidYear } from './src/lib/contributions'

/**
 * In `npm run dev` there are no Cloudflare functions, so serve the GitHub contribution chart here
 * (same code as functions/api/github-contributions.ts). /api/ask isn't served in dev; the chat
 * falls back to its offline answers.
 */
function devGitHubContributions(): Plugin {
  return {
    name: 'dev-github-contributions',
    configureServer(server) {
      server.middlewares.use('/api/github-contributions', async (request, response) => {
        const params = new URL(request.url ?? '', 'http://localhost').searchParams
        const login = params.get('login') ?? ''
        const year = params.get('year') ? Number(params.get('year')) : undefined
        response.setHeader('content-type', 'application/json')
        if (!isValidLogin(login) || (year !== undefined && !isValidYear(year))) { response.statusCode = 400; response.end('{"error":"bad-request"}'); return }
        try {
          response.end(JSON.stringify(await fetchContributions(login, year)))
        } catch {
          response.statusCode = 502
          response.end('{"error":"github-unavailable"}')
        }
      })
    },
  }
}

export default defineConfig({ plugins: [react(), devGitHubContributions()] })
