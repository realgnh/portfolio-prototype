/**
 * INTERACTIVE DEMOS — a project gets a "Try it" demo on its page when its slug is listed here.
 * Each demo is its own component in this folder and downloads only when that project page opens.
 * To add one: create src/demos/MyDemo.tsx (default export), then add `'project-slug': lazy(() => import('./MyDemo'))`.
 */
import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

export const demos: Record<string, LazyExoticComponent<ComponentType>> = {
  'clearpath-onboarding': lazy(() => import('./ClearpathDemo')),
}
