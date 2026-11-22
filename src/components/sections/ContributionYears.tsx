import { useState } from 'react'
import { sections } from '../../content/sections'
import type { Contributions } from '../../lib/contributions'
import { loadContributions } from '../../lib/github'
import { ContributionCalendar } from './ContributionCalendar'

type Choice = 'last' | number

/**
 * The contribution chart plus a year picker, like on a GitHub profile: "Last year" (rolling 12 months)
 * or any calendar year since the account was created. Each year is fetched once, then cached.
 */
export function ContributionYears({ login, joinedYear, initial }: { login: string; joinedYear: number; initial: Contributions | null }) {
  const thisYear = new Date().getFullYear()
  const years = Array.from({ length: Math.max(0, thisYear - joinedYear + 1) }, (_, index) => thisYear - index)
  const [choice, setChoice] = useState<Choice>('last')
  const [data, setData] = useState<Contributions | null>(initial)
  const [loading, setLoading] = useState(false)

  function choose(next: Choice) {
    if (next === choice) return
    setChoice(next)
    setLoading(true)
    loadContributions(login, next === 'last' ? undefined : next).then(result => {
      setData(result)
      setLoading(false)
    })
  }

  return (
    <div className="calendar-years">
      <div className="calendar-years-chart" aria-busy={loading}>
        {data ? <ContributionCalendar data={data} /> : <p className="muted">{sections.github.noCalendar}</p>}
      </div>
      <div className="year-picker" role="group" aria-label="Choose a year">
        <button type="button" aria-pressed={choice === 'last'} onClick={() => choose('last')}>Last year</button>
        {years.map(year => (
          <button key={year} type="button" aria-pressed={choice === year} onClick={() => choose(year)}>{year}</button>
        ))}
      </div>
    </div>
  )
}
