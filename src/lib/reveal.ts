/**
 * Section reveal: every time a page opens, its sections fade up one after another,
 * and sections further down fade up when you scroll to them.
 *
 * Which elements count as "sections": the direct children of the page
 * (see SELECTOR). Styles are `.reveal` / `.is-visible` in src/styles/base.css.
 * With animations off, everything simply shows.
 */
import { useEffect } from 'react'
import { motionAllowed } from './preferences'

/** Fired by the loading screen when it disappears, so the first reveal isn't hidden behind it. */
export const LOADED_EVENT = 'portfolio:loaded'

const SELECTOR = '.route-frame > :not(title):not(meta), .route-frame > .page > *'
/** Delay between sections that are already on screen when the page opens (ms). */
const STAGGER = 90

export function useSectionReveal(container: React.RefObject<HTMLElement | null>, routeKey: string) {
  useEffect(() => {
    const root = container.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR))
      .filter(item => !item.matches('.page')) // a page wrapper reveals through its children
    if (!motionAllowed() || !('IntersectionObserver' in window)) return

    items.forEach(item => item.classList.add('reveal'))
    let observer: IntersectionObserver | undefined

    function start() {
      let batch = 0
      observer = new IntersectionObserver(entries => {
        entries.filter(entry => entry.isIntersecting).forEach(entry => {
          const item = entry.target as HTMLElement
          item.style.transitionDelay = `${batch++ * STAGGER}ms`
          item.classList.add('is-visible')
          observer!.unobserve(item)
        })
        // Later scroll reveals start without a queue.
        window.setTimeout(() => { batch = 0 }, 50)
      }, { rootMargin: '0px 0px -8% 0px' })
      items.forEach(item => observer!.observe(item))
    }

    const loading = document.documentElement.hasAttribute('data-loading')
    if (loading) window.addEventListener(LOADED_EVENT, start, { once: true })
    else start()

    return () => {
      window.removeEventListener(LOADED_EVENT, start)
      observer?.disconnect()
      items.forEach(item => { item.classList.remove('reveal', 'is-visible'); item.style.transitionDelay = '' })
    }
  }, [container, routeKey])
}
