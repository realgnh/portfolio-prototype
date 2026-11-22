/**
 * KEYBOARD SHORTCUTS — press ? on the site to see this list.
 * `keys` is a sequence: ['g', 'p'] means press G, then P (within a second).
 * Avoid single letters from the easter-egg word in easterEggs.ts ("roblox").
 */
export type ShortcutAction =
  | { type: 'go'; to: string }
  | { type: 'theme' | 'motion' | 'search' | 'ask' | 'help' | 'top' }

export const shortcuts: { keys: string[]; label: string; action: ShortcutAction }[] = [
  { keys: ['g', 'h'], label: 'Go to Home', action: { type: 'go', to: '/' } },
  { keys: ['g', 'w'], label: 'Go to Work', action: { type: 'go', to: '/work' } },
  { keys: ['g', 'b'], label: 'Go to Hobby projects', action: { type: 'go', to: '/hobby-projects' } },
  { keys: ['g', 'e'], label: 'Go to Experience', action: { type: 'go', to: '/experience' } },
  { keys: ['g', 'r'], label: 'Go to Résumé', action: { type: 'go', to: '/resume' } },
  { keys: ['g', 'c'], label: 'Go to Contact', action: { type: 'go', to: '/contact' } },
  { keys: ['/'], label: 'Quick search (or Ctrl+K)', action: { type: 'search' } },
  { keys: ['a'], label: 'Ask my portfolio', action: { type: 'ask' } },
  { keys: ['t'], label: 'Switch light / dark', action: { type: 'theme' } },
  { keys: ['m'], label: 'Turn animations on / off', action: { type: 'motion' } },
  { keys: ['u'], label: 'Back to the top', action: { type: 'top' } },
  { keys: ['?'], label: 'Show this list', action: { type: 'help' } },
]
