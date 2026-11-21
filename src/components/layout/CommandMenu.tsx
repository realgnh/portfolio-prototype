import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { navItems } from '../../content/navigation'
import { projects } from '../../content/projects'
import { sections } from '../../content/sections'
import { profile } from '../../content/profile'
import { toggleMotion, toggleTheme } from '../../lib/preferences'
import { useCopyEmail } from '../../lib/useCopyEmail'

type Item = { id: string; group: string; label: string; run: () => void }

/**
 * Quick search (Ctrl/⌘+K): jump to a page or project, or run an action like copying the email.
 * Rendered only while open (see Layout.tsx), so it starts empty every time. Add actions to `items`.
 */
export function CommandMenu({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const copyEmail = useCopyEmail()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()
  const copy = sections.commandMenu

  const items = useMemo<Item[]>(() => [
    ...navItems.map(({ to, label }) => ({ id: `page-${to}`, group: copy.pages, label, run: () => navigate(to) })),
    ...projects.map(({ slug, title }) => ({ id: `project-${slug}`, group: copy.projects, label: title, run: () => navigate(`/projects/${slug}`) })),
    { id: 'copy-email', group: copy.actions, label: copy.copyEmail, run: () => void copyEmail() },
    { id: 'download-resume', group: copy.actions, label: copy.downloadResume, run: () => {
      const link = Object.assign(document.createElement('a'), { href: profile.resume.href, download: '' })
      link.click()
    } },
    { id: 'toggle-theme', group: copy.actions, label: copy.toggleTheme, run: () => toggleTheme() },
    { id: 'toggle-motion', group: copy.actions, label: copy.toggleMotion, run: toggleMotion },
  ], [navigate, copyEmail, copy])

  const results = items.filter(item => item.label.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => input.current?.focus(), [])

  function choose(item: Item | undefined) {
    if (!item) return
    onClose()
    item.run()
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); onClose() }
    else if (event.key === 'ArrowDown') { event.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    else if (event.key === 'Enter') { event.preventDefault(); choose(results[active]) }
  }

  return (
    <div className="command-backdrop" onMouseDown={onClose}>
      <div className="command-menu" role="dialog" aria-modal="true" aria-label={copy.label} onMouseDown={event => event.stopPropagation()} onKeyDown={onKeyDown}>
        <input
          ref={input}
          autoFocus
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
          aria-label={copy.placeholder}
          placeholder={copy.placeholder}
          value={query}
          onChange={event => { setQuery(event.target.value); setActive(0) }}
        />
        <ul id={listId} role="listbox" aria-label={copy.label}>
          {results.length === 0 && <li className="command-empty muted">{copy.empty}</li>}
          {results.map((item, index) => (
            <li
              key={item.id}
              id={`${listId}-${item.id}`}
              role="option"
              aria-selected={index === active}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(item)}
            >
              <span>{item.label}</span>
              <span className="muted">{item.group}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
