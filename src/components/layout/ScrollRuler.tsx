import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { smoothScrollToElement } from '../../lib/smoothScroll'

type Keyframe = { name: string; at: number; element: HTMLElement }

/** How far the page is scrolled, 0 (very top) → 1 (very bottom). */
function scrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  return scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
}

/** A section counts as "current" once its top passes this far down the screen. */
const READ_LINE = 0.35

/**
 * Where each keyframe sits on the ruler: the scroll progress at which its section becomes current.
 * Sections near the bottom can't scroll up to the read line, so they share the last stretch
 * evenly (and the last one sits at the very end), instead of piling up at 100%.
 */
function placeKeys(elements: HTMLElement[]) {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const raw = elements.map(element => (element.getBoundingClientRect().top + window.scrollY - window.innerHeight * READ_LINE) / scrollable)
  const firstUnreachable = raw.findIndex(value => value >= 0.98)
  const at = raw.map(value => Math.max(0, value))
  if (firstUnreachable !== -1) {
    const start = firstUnreachable > 0 ? at[firstUnreachable - 1] : 0
    const count = raw.length - firstUnreachable
    for (let index = 0; index < count; index++) at[firstUnreachable + index] = start + ((1 - start) * (index + 1)) / count
  }
  return at
}

/**
 * The timeline ruler across the top of the page, like in animation software.
 * - Each section marked `data-scene="Name"` gets a ◆ keyframe and a label at its place on the page.
 * - The orange playhead shows how far you've scrolled: the very start at the top of the page,
 *   the very end at the bottom. It reaches a keyframe when that section becomes current
 *   (its top passes the upper third of the screen), and that keyframe lights up.
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
      const elements = Array.from(document.querySelectorAll<HTMLElement>('main [data-scene]'))
      const at = placeKeys(elements)
      setKeys(elements.map((element, index) => ({ name: element.dataset.scene!, at: at[index], element })))
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
      const progress = scrollProgress()
      root.current?.style.setProperty('--progress', progress.toFixed(4))
      const current = [...keys].reverse().find(key => key.at <= progress + 0.002)
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
      <div className="ruler-track">
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
      </div>
    </nav>
  )
}
