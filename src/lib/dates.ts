/**
 * Date helpers for experience and education.
 * Dates in src/content are written as 'YYYY-MM' (e.g. '2026-04') or 'present'.
 */
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parse(value: string, today = new Date()) {
  if (value === 'present') return { year: today.getFullYear(), month: today.getMonth() + 1 }
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

/** '2026-04' → 'April 2026'; 'present' → 'Present'. */
export function formatMonth(value: string) {
  if (value === 'present') return 'Present'
  const { year, month } = parse(value)
  return `${monthNames[month - 1]} ${year}`
}

/** 'April 2026 – June 2026'. A single month shows once. */
export function formatRange(start: string, end: string) {
  return start === end ? formatMonth(start) : `${formatMonth(start)} – ${formatMonth(end)}`
}

/** Number of months a role lasted, counting both the first and last month. */
export function monthsBetween(start: string, end: string, today = new Date()) {
  const from = parse(start, today)
  const to = parse(end, today)
  return (to.year - from.year) * 12 + (to.month - from.month) + 1
}

/**
 * Length of a role, counting both the first and last month (like LinkedIn):
 * April–June → '3 months', June–June → '1 month', 14 months → '1 year 2 months'.
 */
export function formatDuration(start: string, end: string, today = new Date()) {
  const from = parse(start, today)
  const to = parse(end, today)
  const months = (to.year - from.year) * 12 + (to.month - from.month) + 1
  if (months < 1) return ''
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`)
  if (rest) parts.push(`${rest} ${rest === 1 ? 'month' : 'months'}`)
  return parts.join(' ')
}
