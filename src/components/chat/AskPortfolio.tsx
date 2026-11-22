import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { chat } from '../../content/chat'
import { sections } from '../../content/sections'
import { localAnswer } from '../../lib/localAnswer'

type Message = { role: 'user' | 'assistant'; content: string; link?: string; offline?: boolean; animate?: boolean }

/** Waits at most this long for the AI before answering offline (ms). */
const TIMEOUT = 12000
/** The "typing…" dots show for at least this long, so answers don't pop in instantly (ms). */
const MIN_THINKING = 700
/** Delay between words as an answer fades in (ms). */
const WORD_DELAY = 28

/** An answer that fades in word by word, like a chatbot typing; its link appears when the text has finished. */
function FadingText({ text, link, onLink }: { text: string; link?: string; onLink: () => void }) {
  const parts = text.split(/(\s+)/)
  let word = 0
  return (
    <>
      <p className="chat-words">
        {parts.map((part, index) => /^\s+$/.test(part)
          ? part
          : <span key={index} style={{ '--i': word++ } as React.CSSProperties}>{part}</span>)}
      </p>
      {link && <Link to={link} className="arrow-link chat-link" style={{ '--i': word } as React.CSSProperties} onClick={onLink}>{sections.chat.open} <span aria-hidden="true">→</span></Link>}
    </>
  )
}

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
      if (data.answer) return { role: 'assistant', content: data.answer, animate: true }
    }
  } catch { /* fall through to the offline answer */ }
  const offline = localAnswer(question)
  return { role: 'assistant', content: offline.text, link: offline.link, offline: true, animate: true }
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
  const panel = useRef<HTMLDivElement>(null)

  // Scrolling over the chat scrolls the chat only, never the page behind it.
  useEffect(() => {
    const element = panel.current
    if (!element) return
    function onWheel(event: WheelEvent) {
      let node = event.target as HTMLElement | null
      while (node && node !== element) {
        const scrollable = node.scrollHeight > node.clientHeight && /(auto|scroll)/.test(getComputedStyle(node).overflowY)
        if (scrollable) {
          const atTop = node.scrollTop <= 0 && event.deltaY < 0
          const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1 && event.deltaY > 0
          if (!atTop && !atBottom) return // let this box scroll normally
          break
        }
        node = node.parentElement
      }
      event.preventDefault()
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [])

  // All suggestions at first; afterwards up to three you haven't asked yet.
  const asked = new Set(messages.filter(message => message.role === 'user').map(message => message.content))
  const unasked = chat.suggestions.filter(suggestion => !asked.has(suggestion))
  const suggestions = messages.length === 1 ? unasked : unasked.slice(0, 3)

  useEffect(() => input.current?.focus(), [])
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }) }, [messages, busy])

  async function send(question: string) {
    const text = question.trim()
    if (!text || busy) return
    const history = messages.slice(1)
    setMessages(current => [...current, { role: 'user', content: text }])
    setDraft('')
    setBusy(true)
    const [reply] = await Promise.all([ask(text, history), new Promise(resolve => window.setTimeout(resolve, MIN_THINKING))])
    setMessages(current => [...current, reply])
    setBusy(false)
    input.current?.focus()
  }

  return (
    <div ref={panel} className="chat-panel" role="dialog" aria-label={copy.title} onKeyDown={event => { if (event.key === 'Escape') onClose() }}>
      <header className="chat-header">
        <p><strong>{copy.title}</strong> <span className="muted">{copy.subtitle}</span></p>
        <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>×</button>
      </header>
      <ol ref={list} className="chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <li key={index} data-role={message.role}>
            {message.animate
              ? <FadingText text={message.content} link={message.link} onLink={onClose} />
              : <p>{message.content}</p>}
          </li>
        ))}
        {busy && <li data-role="assistant" className="chat-typing" aria-label={copy.thinking}><span className="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></li>}
      </ol>
      {!busy && suggestions.length > 0 && (
        <ul className="chat-suggestions" aria-label="Suggested questions">
          {suggestions.map(suggestion => (
            <li key={suggestion}><button type="button" className="chat-chip" onClick={() => send(suggestion)}>{suggestion}</button></li>
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
