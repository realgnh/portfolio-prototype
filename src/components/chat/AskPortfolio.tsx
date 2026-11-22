import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { sections } from '../../content/sections'
import { localAnswer } from '../../lib/localAnswer'

type Message = { role: 'user' | 'assistant'; content: string; link?: string; offline?: boolean }

/** Waits at most this long for the AI before answering offline (ms). */
const TIMEOUT = 12000

async function ask(question: string, history: Message[]): Promise<Message> {
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT)
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question, history: history.map(({ role, content }) => ({ role, content })) }),
      signal: controller.signal,
    })
    window.clearTimeout(timer)
    if (response.ok) {
      const data = await response.json() as { answer?: string }
      if (data.answer) return { role: 'assistant', content: data.answer }
    }
  } catch { /* fall through to the offline answer */ }
  const offline = localAnswer(question)
  return { role: 'assistant', content: offline.text, link: offline.link, offline: true }
}

/**
 * "Ask my portfolio" panel. Sends questions to /api/ask (functions/api/ask.ts, Cloudflare Workers AI)
 * and falls back to an in-browser search (lib/localAnswer.ts) if the AI isn't available.
 * Loaded only when opened (see ChatLauncher.tsx), so it adds nothing to the first page load.
 */
export default function AskPortfolio({ onClose }: { onClose: () => void }) {
  const copy = sections.chat
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: copy.greeting }])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => input.current?.focus(), [])
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }) }, [messages, busy])

  async function send(question: string) {
    const text = question.trim()
    if (!text || busy) return
    const history = messages.slice(1)
    setMessages(current => [...current, { role: 'user', content: text }])
    setDraft('')
    setBusy(true)
    const reply = await ask(text, history)
    setMessages(current => [...current, reply])
    setBusy(false)
    input.current?.focus()
  }

  return (
    <div className="chat-panel" role="dialog" aria-label={copy.title} onKeyDown={event => { if (event.key === 'Escape') onClose() }}>
      <header className="chat-header">
        <p><strong>{copy.title}</strong> <span className="muted">{copy.subtitle}</span></p>
        <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>×</button>
      </header>
      <ol ref={list} className="chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <li key={index} data-role={message.role}>
            <p>{message.content}</p>
            {message.link && <Link to={message.link} className="arrow-link" onClick={onClose}>{copy.open} <span aria-hidden="true">→</span></Link>}
          </li>
        ))}
        {busy && <li data-role="assistant" className="chat-typing" aria-label={copy.thinking}><span className="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></li>}
      </ol>
      {messages.length === 1 && (
        <ul className="chat-suggestions" aria-label="Suggested questions">
          {copy.suggestions.map(suggestion => (
            <li key={suggestion}><button type="button" className="chip chat-chip" onClick={() => send(suggestion)}>{suggestion}</button></li>
          ))}
        </ul>
      )}
      <form className="chat-form" onSubmit={event => { event.preventDefault(); void send(draft) }}>
        <input ref={input} value={draft} onChange={event => setDraft(event.target.value)} maxLength={400} placeholder={copy.placeholder} aria-label={copy.placeholder} />
        <button type="submit" className="button button-primary" disabled={busy || !draft.trim()}>{copy.send}</button>
      </form>
    </div>
  )
}
