import { useEffect, useRef, useState } from 'react'
import { site, ui } from '../data/site'

type State = 'idle' | 'copied' | 'failed'

export function CopyEmail() {
  const [state, setState] = useState<State>('idle')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(site.email)
      setState('copied')
    } catch {
      setState('failed')
    }
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }

  return (
    <span className="copy-email">
      <button type="button" className="chip" onClick={copy}>{ui.copyEmail}</button>
      <span className="copy-status label" role="status">
        {state === 'copied' ? ui.copied : state === 'failed' ? ui.copyFailed : ''}
      </span>
    </span>
  )
}
