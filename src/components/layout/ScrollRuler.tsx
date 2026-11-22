import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { smoothScrollToElement } from '../../lib/smoothScroll'

type Keyframe = { name: string; at: number; element: HTMLElement }

/**
 * The thin ruler across the top of the page, like an animation timeline:
 * a playhead (▼) follows your scroll, and each section marked with `data-scene="Name"`
 * gets a ◆ keyframe at its position. Hover a ◆ to see its name, click it to jump there.
 */
export function ScrollRuler() {
  const { pathname } = useLocation()
  const root = useRef<HTMLDivElement>(null)
  const [keys, setKeys] = useState<Keyframe[]>([])

  // Find the sections on this page and where they sit along the scroll.
  useEffect(() => {
    let frame = 0
    function measure() {
      frame = 0
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const found = Array.from(document.querySelectorAll<HTMLElement>('main [data-scene]')).map(element => ({
        name: element.dataset.scene!,
        at: Math.min(1, Math.max(0, (element.getBoundingClientRect().top + window.scrollY - 80) / scrollable)),
        element,
      }))
      setKeys(found)
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const settle = window.setTimeout(queue, 400) // after the page has rendered and fonts settled
    const observer = new ResizeObserver(queue)
    observer.observe(document.body)
    return () => { window.clearTimeout(settle); observer.disconnect(); cancelAnimationFrame(frame) }
  }, [pathname])

  // Move the playhead with the scroll position (writes a CSS variable, no re-render).
  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      root.current?.style.setProperty('--progress', (window.scrollY / scrollable).toFixed(4))
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); cancelAnimationFrame(frame) }
  }, [pathname])

  return (
    <div ref={root} className="ruler" aria-label="Page sections">
      <div className="ruler-ticks" aria-hidden="true" />
      <div className="ruler-fill" aria-hidden="true" />
      <div className="ruler-playhead" aria-hidden="true" />
      {keys.map(key => (
        <button
          key={key.name}
          type="button"
          className="ruler-key"
          style={{ left: `${key.at * 100}%` }}
          aria-label={`Jump to ${key.name}`}
          onClick={() => smoothScrollToElement(key.element)}
        >
          <span className="ruler-key-label" aria-hidden="true">{key.name}</span>
        </button>
      ))}
    </div>
  )
}
