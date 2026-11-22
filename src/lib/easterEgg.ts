/**
 * Listens for the easter-egg triggers defined in src/content/easterEggs.ts.
 * Typing inside inputs (e.g. Quick search) never counts.
 */
import { useEffect } from 'react'
import { easterEgg } from '../content/easterEggs'

const BRICK_KEY = 'portfolio-brick'
/** Fire this event (e.g. from Quick search) to play the easter egg directly. */
export const EASTER_EGG_EVENT = 'portfolio:easter-egg'

export function brickModeOn() {
  try { return localStorage.getItem(BRICK_KEY) === '1' } catch { return false }
}

/** Turns on the brick loading cube; returns true if it wasn't on before. */
export function unlockBrickMode() {
  const first = !brickModeOn()
  try { localStorage.setItem(BRICK_KEY, '1') } catch { /* ignore */ }
  return first
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

export function useEasterEggTriggers(onTrigger: () => void) {
  useEffect(() => {
    const word = easterEgg.secretWord.toLowerCase()
    const code = easterEgg.arrowCode
    let typed = ''
    let arrows: string[] = []
    let clicks = 0
    let clickTimer = 0

    function onKey(event: KeyboardEvent) {
      if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.startsWith('Arrow')) {
        arrows = [...arrows, event.key].slice(-code.length)
        if (arrows.join() === code.join()) { arrows = []; onTrigger() }
        return
      }
      if (event.key.length !== 1) return
      typed = (typed + event.key.toLowerCase()).slice(-word.length)
      if (word && typed === word) { typed = ''; onTrigger() }
    }

    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element) || !event.target.closest('.monogram')) return
      clicks += 1
      window.clearTimeout(clickTimer)
      clickTimer = window.setTimeout(() => { clicks = 0 }, 1500)
      if (clicks >= easterEgg.logoClicks) { clicks = 0; onTrigger() }
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    window.addEventListener(EASTER_EGG_EVENT, onTrigger)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
      window.removeEventListener(EASTER_EGG_EVENT, onTrigger)
      window.clearTimeout(clickTimer)
    }
  }, [onTrigger])
}
