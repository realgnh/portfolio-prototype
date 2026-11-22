/**
 * Visitor preferences (theme and animations), saved in the browser.
 * index.html applies them before the page paints, so there's no flash.
 */
import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
export type Motion = 'on' | 'off'

const keys = { theme: 'portfolio-theme', motion: 'portfolio-motion' } as const
const listeners = new Set<() => void>()

function save(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* private mode: keep it for this visit only */ }
}

function emit() {
  listeners.forEach(listener => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function getMotion(): Motion {
  return document.documentElement.dataset.motion === 'off' ? 'off' : 'on'
}

export function motionAllowed() {
  return getMotion() === 'on'
}

/** Switches theme with a circular reveal from `origin` (e.g. the toggle button) when animations are on. */
let activeTransition: ViewTransition | null = null
/** The theme we're switching to while a transition runs (so quick repeat presses toggle correctly). */
let pendingTheme: Theme | null = null

/** Switches theme with a circular reveal from `origin` (e.g. the toggle button) when animations are on. */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement
  save(keys.theme, next)
  const apply = () => { root.dataset.theme = next; emit() }
  // Finish any switch that's still running before starting a new one.
  activeTransition?.skipTransition()
  if (!document.startViewTransition || !motionAllowed()) { pendingTheme = null; return apply() }
  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? 0
  root.style.setProperty('--reveal-x', `${x}px`)
  root.style.setProperty('--reveal-y', `${y}px`)
  root.dataset.themeSwitch = ''
  pendingTheme = next
  const transition = document.startViewTransition(apply)
  activeTransition = transition
  // Safety net: if the browser abandons the transition, still switch the theme.
  const ensure = () => { if (root.dataset.theme !== next && pendingTheme === next) apply() }
  const timer = window.setTimeout(ensure, 1000)
  transition.finished.catch(() => {}).finally(() => {
    window.clearTimeout(timer)
    // Only the latest switch cleans up, so an older one can't cancel a newer one's animation.
    if (activeTransition !== transition) return
    ensure()
    activeTransition = null
    pendingTheme = null
    delete root.dataset.themeSwitch
  })
}

/** Toggles light/dark. Without an origin, the reveal starts from the theme button in the header. */
export function toggleTheme(origin?: { x: number; y: number }) {
  const current = pendingTheme ?? getTheme()
  let from = origin
  if (!from) {
    const button = document.querySelector('[data-theme-toggle]')?.getBoundingClientRect()
    if (button && button.width) from = { x: button.left + button.width / 2, y: button.top + button.height / 2 }
  }
  setTheme(current === 'dark' ? 'light' : 'dark', from)
}

export function setMotion(next: Motion) {
  document.documentElement.dataset.motion = next
  save(keys.motion, next)
  emit()
}

export function toggleMotion() {
  setMotion(getMotion() === 'on' ? 'off' : 'on')
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'light' as Theme)
}

export function useMotion() {
  return useSyncExternalStore(subscribe, getMotion, () => 'on' as Motion)
}
