import { useEffect, useRef, useState } from 'react'
import type { Contributions } from '../../lib/contributions'

const weekdays = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function ordinal(day: number) {
  const tens = day % 100
  if (tens >= 11 && tens <= 13) return `${day}th`
  return `${day}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[day % 10] ?? 'th'}`
}

/** "9 contributions on November 13th" (GitHub's wording). */
export function contributionLabel(count: number, date: string) {
  const parsed = new Date(`${date}T12:00:00Z`)
  const month = parsed.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
  return `${count === 0 ? 'No' : count} contribution${count === 1 ? '' : 's'} on ${month} ${ordinal(parsed.getUTCDate())}`
}

/**
 * GitHub-style contribution chart: one column per week, one square per day, coloured by level (0–4).
 * Scrolls sideways on small screens, starting at the most recent week.
 */
export function ContributionCalendar({ data }: { data: Contributions }) {
  const scroller = useRef<HTMLDivElement>(null)
  const figure = useRef<HTMLElement>(null)
  const [tip, setTip] = useState<{ text: string; x: number; y: number; arrow: number } | null>(null)

  // One shared tooltip that follows whichever square the pointer is over.
  function showTip(event: React.PointerEvent) {
    const square = (event.target as HTMLElement).closest<HTMLElement>('i[data-tip]')
    if (!square || !figure.current) return setTip(null)
    const box = square.getBoundingClientRect()
    const frame = figure.current.getBoundingClientRect()
    const centre = box.left + box.width / 2 - frame.left
    // Keep the tooltip inside the card; the arrow still points at the square.
    const half = 115
    const x = Math.min(Math.max(centre, half), frame.width - half)
    setTip({ text: square.dataset.tip!, x, y: box.top - frame.top, arrow: centre - x })
  }
  useEffect(() => { scroller.current?.scrollTo({ left: scroller.current.scrollWidth }) }, [data])

  // Pad the first week so each column runs Sunday → Saturday, like on GitHub.
  const first = data.days[0] ? new Date(`${data.days[0].date}T12:00:00Z`).getUTCDay() : 0
  const cells = [...Array<null>(first).fill(null), ...data.days]
  const weeks: (typeof cells)[] = []
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7))

  // A month label above the first week that starts in that month.
  let lastMonth = ''
  const months = weeks.map(week => {
    const day = week.find(Boolean)
    const month = day ? day.date.slice(0, 7) : ''
    if (!month || month === lastMonth) return ''
    lastMonth = month
    return new Date(`${month}-15T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  })

  return (
    <figure ref={figure} className="calendar" onPointerOver={showTip} onPointerLeave={() => setTip(null)}>
      <figcaption className="calendar-total"><strong>{data.total}</strong> contributions in the last year</figcaption>
      <div ref={scroller} className="calendar-scroll" onScroll={() => setTip(null)}>
        <div className="calendar-grid" style={{ '--weeks': weeks.length } as React.CSSProperties}>
          <span className="calendar-corner" />
          {months.map((month, index) => <span key={`m${index}`} className="calendar-month">{month}</span>)}
          {weekdays.map((weekday, row) => (
            <div key={`r${row}`} className="calendar-row" style={{ gridRow: row + 2 }}>
              <span className="calendar-weekday">{weekday}</span>
              {weeks.map((week, column) => {
                const day = week[row]
                return day
                  ? <i key={column} data-level={day.level} data-tip={contributionLabel(day.count, day.date)} />
                  : <i key={column} data-empty="" />
              })}
            </div>
          ))}
        </div>
      </div>
      {tip && <span className="calendar-tip" role="tooltip" style={{ left: tip.x, top: tip.y, '--arrow': `${tip.arrow}px` } as React.CSSProperties}>{tip.text}</span>}
      <p className="calendar-legend" aria-hidden="true">Less <i data-level="0" /><i data-level="1" /><i data-level="2" /><i data-level="3" /><i data-level="4" /> More</p>
    </figure>
  )
}
