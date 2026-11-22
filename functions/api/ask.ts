/**
 * Cloudflare Pages Function: POST /api/ask  { question, history? }  →  { answer }
 *
 * Uses Cloudflare Workers AI through a binding named "AI". To switch it on:
 * Cloudflare dashboard → your Pages project → Settings → Bindings → Add → Workers AI → name it AI.
 * Without the binding this returns 503 and the site answers from its offline search instead.
 */
import { profile } from '../../src/content/profile'
import { knowledgeText } from '../../src/lib/knowledge'

/** The model. Small and fast; see https://developers.cloudflare.com/workers-ai/models/ for others. */
const MODEL = '@cf/meta/llama-3.1-8b-instruct'
const MAX_QUESTION = 400

type Message = { role: 'user' | 'assistant'; content: string }
type Env = { AI?: { run(model: string, input: unknown): Promise<{ response?: string }> } }

const instructions = `You are the assistant on ${profile.name}'s personal portfolio website.
Answer visitors' questions about ${profile.firstName} in 1–3 short, friendly sentences, in the third person.
Only use the facts below. If the answer isn't there, say you don't know and suggest emailing ${profile.email}.
Never invent projects, employers, dates or numbers. When a page is relevant, mention its path, e.g. /projects.

${knowledgeText()}`

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  if (!env.AI) return json({ error: 'ai-not-configured' }, 503)
  let payload: { question?: unknown; history?: unknown }
  try { payload = await request.json() } catch { return json({ error: 'bad-request' }, 400) }

  const question = typeof payload.question === 'string' ? payload.question.trim().slice(0, MAX_QUESTION) : ''
  if (!question) return json({ error: 'empty-question' }, 400)
  const history = Array.isArray(payload.history)
    ? (payload.history as Message[])
      .filter(message => (message?.role === 'user' || message?.role === 'assistant') && typeof message.content === 'string')
      .slice(-4)
      .map(message => ({ role: message.role, content: message.content.slice(0, MAX_QUESTION) }))
    : []

  try {
    const result = await env.AI.run(MODEL, {
      messages: [{ role: 'system', content: instructions }, ...history, { role: 'user', content: question }],
      max_tokens: 220,
      temperature: 0.3,
    })
    const answer = result.response?.trim()
    return answer ? json({ answer }) : json({ error: 'no-answer' }, 502)
  } catch {
    return json({ error: 'ai-failed' }, 502)
  }
}
