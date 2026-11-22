import { useEffect, useRef } from 'react'
import { shortcuts } from '../../content/shortcuts'
import { sections } from '../../content/sections'

/** The "?" cheat sheet listing every keyboard shortcut. Data: src/content/shortcuts.ts. */
export function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => closeButton.current?.focus(), [])

  return (
    <div className="command-backdrop" onMouseDown={onClose}>
      <div
        className="shortcuts-help"
        role="dialog"
        aria-modal="true"
        aria-label={sections.shortcuts.title}
        onMouseDown={event => event.stopPropagation()}
        onKeyDown={event => { if (event.key === 'Escape' || event.key === '?') { event.preventDefault(); onClose() } }}
      >
        <header>
          <h2>{sections.shortcuts.title}</h2>
          <button ref={closeButton} type="button" className="icon-button" aria-label="Close" onClick={onClose}>×</button>
        </header>
        <dl>
          {shortcuts.map(({ keys, label }) => (
            <div key={keys.join('')}>
              <dt>{label}</dt>
              <dd>{keys.map((key, index) => <span key={index}>{index > 0 && <small>then</small>}<kbd>{key === '/' ? '/' : key.toUpperCase()}</kbd></span>)}</dd>
            </div>
          ))}
        </dl>
        <p className="muted">{sections.shortcuts.hint}</p>
      </div>
    </div>
  )
}
