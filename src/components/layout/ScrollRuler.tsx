import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { smoothScrollToElement } from '../../lib/smoothScroll'

type Keyframe = { name: string; at: number; element: HTMLElement }

/** Where something sits along the page, 0–1 (top of page → bottom of page). */
function positionOf(y: number) {
  return Math.min(1, Math.max(0, y / Math.max(1, document.documentElement.scrollHeight)))
}

/**
 * The timeline ruler across the top of the page, like in animation software.
 * - Each section marked `data-scene="Name"` gets a ◆ keyframe and a label at its place on the page.
 * - The orange playhead marks the middle of the screen, so it reaches a keyframe as that section
 *   scrolls into view; the current section's keyframe lights up.
 * - Click a keyframe (or its label) to jump to that section.
 * Styles: src/styles/ruler.css.
 */
export function ScrollRuler() {
  const { pathname } = useLocation()
  const root = useRef<HTMLDivElement>(null)
  const [keys, setKeys] = useState<Keyframe[]>([])
  const [active, setActive] = useState('')

  // Find this page's sections and where they sit. Re-measure when the page grows or shrinks.
  useEffect(() => {
    let frame = 0
    function measure() {
      frame = 0
      setKeys(Array.from(document.querySelectorAll<HTMLElement>('main [data-scene]')).map(element => ({
        name: element.dataset.scene!,
        at: positionOf(element.getBoundingClientRect().top + window.scrollY),
        element,
      })))
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(measure) }
    queue()
    const settle = window.setTimeout(queue, 600) // after fonts and images settle
    const observer = new ResizeObserver(queue)
    observer.observe(document.body)
    return () => { window.clearTimeout(settle); observer.disconnect(); cancelAnimationFrame(frame) }
  }, [pathname])

  // Move the playhead (a CSS variable, no re-render) and track which section is current.
  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const middle = positionOf(window.scrollY + window.innerHeight / 2)
      root.current?.style.setProperty('--progress', middle.toFixed(4))
      const current = [...keys].reverse().find(key => key.at <= middle + 0.001)
      setActive(current?.name ?? '')
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); cancelAnimationFrame(frame) }
  }, [keys])

  return (
    <nav ref={root} className="ruler" aria-label="Page sections">
      <div className="ruler-ticks" aria-hidden="true" />
      <div className="ruler-fill" aria-hidden="true" />
      {keys.map(key => (
        <button
          key={key.name}
          type="button"
          className="ruler-key"
          data-active={key.name === active || undefined}
          data-passed={key.name !== active && keys.indexOf(key) < keys.findIndex(item => item.name === active) || undefined}
          style={{ left: `${key.at * 100}%` }}
          onClick={() => smoothScrollToElement(key.element)}
        >
          <span className="ruler-diamond" aria-hidden="true" />
          <span className="ruler-key-label">{key.name}</span>
        </button>
      ))}
      <div className="ruler-playhead" aria-hidden="true" />
    </nav>
  )
}
