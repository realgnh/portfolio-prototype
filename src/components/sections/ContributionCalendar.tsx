import { useEffect, useRef } from 'react'
import type { Contributions } from '../../lib/contributions'

const weekdays = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function label(count: number, date: string) {
  const day = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  return `${count === 0 ? 'No' : count} contribution${count === 1 ? '' : 's'} on ${day}`
}

/**
 * GitHub-style contribution chart: one column per week, one square per day, coloured by level (0–4).
 * Scrolls sideways on small screens, starting at the most recent week.
 */
export function ContributionCalendar({ data }: { data: Contributions }) {
  const scroller = useRef<HTMLDivElement>(null)
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
    <figure className="calendar">
      <figcaption className="calendar-total"><strong>{data.total}</strong> contributions in the last year</figcaption>
      <div ref={scroller} className="calendar-scroll">
        <div className="calendar-grid" style={{ '--weeks': weeks.length } as React.CSSProperties}>
          <span className="calendar-corner" />
          {months.map((month, index) => <span key={`m${index}`} className="calendar-month">{month}</span>)}
          {weekdays.map((weekday, row) => (
            <div key={`r${row}`} className="calendar-row" style={{ gridRow: row + 2 }}>
              <span className="calendar-weekday">{weekday}</span>
              {weeks.map((week, column) => {
                const day = week[row]
                return day
                  ? <i key={column} data-level={day.level} title={label(day.count, day.date)} />
                  : <i key={column} data-empty="" />
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="calendar-legend" aria-hidden="true">Less <i data-level="0" /><i data-level="1" /><i data-level="2" /><i data-level="3" /><i data-level="4" /> More</p>
    </figure>
  )
}
