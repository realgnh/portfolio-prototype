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
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement
  save(keys.theme, next)
  const apply = () => { root.dataset.theme = next; emit() }
  if (!document.startViewTransition || !motionAllowed()) return apply()
  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? 0
  root.style.setProperty('--reveal-x', `${x}px`)
  root.style.setProperty('--reveal-y', `${y}px`)
  root.dataset.themeSwitch = ''
  const transition = document.startViewTransition(apply)
  transition.finished.finally(() => { delete root.dataset.themeSwitch })
}

export function toggleTheme(origin?: { x: number; y: number }) {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark', origin)
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
