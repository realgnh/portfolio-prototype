/**
 * Our own smooth scrolling. Browsers skip `behavior: 'smooth'` when the computer's
 * "reduce animations" setting is on, so we animate the scroll ourselves and follow the
 * site's own Animations switch instead.
 */
import { motionAllowed } from './preferences'

let frame = 0

/** Smoothly scrolls the page to `top` (pixels). Takes longer for longer distances, up to `maxDuration` ms. */
export function smoothScrollTo(top: number, maxDuration = 900) {
  cancelAnimationFrame(frame)
  const start = window.scrollY
  const distance = top - start
  if (!motionAllowed() || Math.abs(distance) < 2) {
    window.scrollTo({ top, behavior: 'instant' })
    return
  }
  const duration = Math.min(maxDuration, 350 + Math.abs(distance) * 0.25)
  const began = performance.now()

  // Stop if the visitor scrolls themselves.
  const cancel = () => cancelAnimationFrame(frame)
  window.addEventListener('wheel', cancel, { once: true, passive: true })
  window.addEventListener('touchstart', cancel, { once: true, passive: true })

  function step(now: number) {
    const t = Math.min((now - began) / duration, 1)
    const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2 // easeInOutCubic
    window.scrollTo({ top: start + distance * eased, behavior: 'instant' })
    if (t < 1) frame = requestAnimationFrame(step)
    else {
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
    }
  }
  frame = requestAnimationFrame(step)
}

/** Smoothly scrolls to an element, leaving room for the sticky header. */
export function smoothScrollToElement(element: Element | null, offset = 88) {
  if (!element) return
  smoothScrollTo(element.getBoundingClientRect().top + window.scrollY - offset)
}
