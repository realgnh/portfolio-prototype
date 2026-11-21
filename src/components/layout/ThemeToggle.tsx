import { sections } from '../../content/sections'
import { toggleTheme, useTheme } from '../../lib/preferences'

/** Light/dark switch. The new theme spreads out in a circle from the button. */
export function ThemeToggle() {
  const theme = useTheme()
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={sections.theme.label}
      aria-pressed={theme === 'dark'}
      title={sections.theme.label}
      onClick={event => {
        const box = event.currentTarget.getBoundingClientRect()
        toggleTheme({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
      }}
    >
      {theme === 'dark' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  )
}
