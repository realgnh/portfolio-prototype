/**
 * Runs the keyboard shortcuts from src/content/shortcuts.ts.
 * Ignored while typing in a text box or when Ctrl/⌘/Alt is held.
 */
import { useEffect } from 'react'
import { shortcuts } from '../content/shortcuts'
import type { ShortcutAction } from '../content/shortcuts'

/** How long you have to press the second key of a sequence like G then P (ms). */
const SEQUENCE_TIMEOUT = 1000

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

export function useShortcuts(run: (action: ShortcutAction) => void) {
  useEffect(() => {
    let pending: string[] = []
    let timer = 0

    function onKey(event: KeyboardEvent) {
      // Holding a key down doesn't repeat shortcuts (e.g. holding T would flicker the theme).
      if (event.repeat || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return // let open dialogs handle keys
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const sequence = [...pending, key]
      const exact = shortcuts.find(shortcut => shortcut.keys.join() === sequence.join())
      const partial = shortcuts.some(shortcut => shortcut.keys.length > sequence.length && shortcut.keys.slice(0, sequence.length).join() === sequence.join())
      window.clearTimeout(timer)
      if (exact) {
        event.preventDefault()
        pending = []
        run(exact.action)
      } else if (partial) {
        pending = sequence
        timer = window.setTimeout(() => { pending = [] }, SEQUENCE_TIMEOUT)
      } else {
        pending = []
      }
    }

    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); window.clearTimeout(timer) }
  }, [run])
}
