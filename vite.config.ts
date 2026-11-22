import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { fetchContributions, isValidLogin } from './src/lib/contributions'

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
        const login = new URL(request.url ?? '', 'http://localhost').searchParams.get('login') ?? ''
        response.setHeader('content-type', 'application/json')
        if (!isValidLogin(login)) { response.statusCode = 400; response.end('{"error":"bad-login"}'); return }
        try {
          response.end(JSON.stringify(await fetchContributions(login)))
        } catch {
          response.statusCode = 502
          response.end('{"error":"github-unavailable"}')
        }
      })
    },
  }
}

export default defineConfig({ plugins: [react(), devGitHubContributions()] })
