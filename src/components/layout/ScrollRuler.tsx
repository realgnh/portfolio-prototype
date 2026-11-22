import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { smoothScrollTo } from '../../lib/smoothScroll'

type Keyframe = { name: string; at: number; element: HTMLElement }
/** How each keyframe's label fits: shown, shown to the left of its ◆ (near the end), or hidden (no room; still shows on hover). */
type Fit = 'show' | 'flip' | 'hide'

const GAP = 10 // px between a label and the next thing

/** See the comment where it's used in ScrollRuler. */
function placeLabels(keys: Keyframe[], sizes: { track: number; labels: number[] }, active: string): Fit[] {
  if (!sizes.track) return keys.map(() => 'hide')
  const taken: [number, number][] = []
  const fits: Fit[] = keys.map(() => 'hide')
  // Every ◆ takes up a little room too, so labels never run through another keyframe.
  const diamonds: [number, number][] = keys.map(key => [key.at * sizes.track - 8, key.at * sizes.track + 8])
  const order = keys.map((_, index) => index).sort((a, b) => Number(keys[b].name === active) - Number(keys[a].name === active))
  for (const index of order) {
    const x = keys[index].at * sizes.track
    const width = sizes.labels[index] + 22 // diamond + gap
    const flip = x + width > sizes.track + 12
    const span: [number, number] = flip ? [x - width, x + 6] : [x - 6, x + width]
    const overlaps = (spans: [number, number][]) => spans.some(([left, right]) => span[0] < right + GAP && span[1] > left - GAP)
    const isActive = keys[index].name === active
    // The current label always shows (it covers any ◆ beneath it); others need clear space.
    if (!isActive && (overlaps(taken) || overlaps(diamonds.filter((_, other) => other !== index)))) continue
    taken.push(span)
    fits[index] = flip ? 'flip' : 'show'
  }
  return fits
}

/** How far the page is scrolled, 0 (very top) → 1 (very bottom). */
function scrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  return scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
}

/**
 * A section's distance from the top of the page, from layout positions (offsetTop), so it ignores
 * transforms like the fade-up on sections that haven't been revealed yet.
 */
function pageTop(element: HTMLElement) {
  let top = 0
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop
  return top
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
  const raw = elements.map(element => (pageTop(element) - window.innerHeight * READ_LINE) / scrollable)
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
 * - Click a keyframe (or its label) to scroll exactly to where the playhead meets it.
 * - The current section's label always shows; other labels show only where they fit without overlapping.
 * Styles: src/styles/ruler.css.
 */
export function ScrollRuler() {
  const { pathname } = useLocation()
  const root = useRef<HTMLDivElement>(null)
  const [keys, setKeys] = useState<Keyframe[]>([])
  const [active, setActive] = useState('')
  const track = useRef<HTMLDivElement>(null)
  const keysRef = useRef<Keyframe[]>([])
  keysRef.current = keys
  /** Label widths and the track width in px, measured once per layout (see placeLabels). */
  const [sizes, setSizes] = useState<{ track: number; labels: number[] }>({ track: 0, labels: [] })

  // Measure the label texts (works even while a label is hidden: uppercase + letter spacing).
  useLayoutEffect(() => {
    function measure() {
      const sample = track.current?.querySelector<HTMLElement>('.ruler-key-label')
      const style = sample ? getComputedStyle(sample) : null
      const context = document.createElement('canvas').getContext('2d')
      if (context && style) context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      const size = style ? parseFloat(style.fontSize) : 10
      setSizes({
        track: track.current?.clientWidth ?? 0,
        labels: keys.map(key => (context ? context.measureText(key.name.toUpperCase()).width : key.name.length * 8) + key.name.length * size * 0.08),
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [keys])

  // Decide which labels to show: the current section's label always, then any other label that
  // fits without touching one already shown. Labels near the right end sit to the left of their ◆.
  const fits = placeLabels(keys, sizes, active)

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

  // Clicking a keyframe scrolls to exactly where the playhead meets it.
  function jumpTo(key: Keyframe) {
    const scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    smoothScrollTo(Math.min(scrollable, Math.ceil(key.at * scrollable) + 1)) // +1px so it counts as reached
  }

  // Move the playhead (a CSS variable, no re-render) and track which section is current.
  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const progress = scrollProgress()
      root.current?.style.setProperty('--progress', progress.toFixed(4))
      const current = [...keysRef.current].reverse().find(key => key.at <= progress + 0.002)
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
      <div ref={track} className="ruler-track">
        <div className="ruler-fill" aria-hidden="true" />
        {keys.map((key, index) => (
          <button
            key={key.name}
            type="button"
            className="ruler-key"
            aria-label={key.name}
            data-active={key.name === active || undefined}
            data-fit={fits[index] ?? 'hide'}
            data-passed={key.name !== active && keys.indexOf(key) < keys.findIndex(item => item.name === active) || undefined}
            style={{ left: `${key.at * 100}%` }}
            onClick={() => jumpTo(key)}
          >
            <span className="ruler-diamond" aria-hidden="true" />
            <span className="ruler-key-label" aria-hidden="true">{key.name}</span>
          </button>
        ))}
        <div className="ruler-playhead" aria-hidden="true" />
      </div>
    </nav>
  )
}
