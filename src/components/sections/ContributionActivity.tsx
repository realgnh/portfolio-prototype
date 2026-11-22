import type { ActivityMonth } from '../../lib/github'
import { languageColors, monthLabel } from '../../lib/github'

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** "Contribution activity" by month, like the GitHub profile: commits per repo, new repos, pull requests. */
export function ContributionActivity({ months }: { months: ActivityMonth[] }) {
  if (months.length === 0) return <p className="muted">No public activity in the last two months.</p>
  return (
    <ol className="activity">
      {months.map(month => {
        const commitTotal = month.commits.reduce((sum, item) => sum + item.count, 0)
        const most = Math.max(1, ...month.commits.map(item => item.count))
        return (
          <li key={month.month} className="activity-month">
            <h4 className="activity-heading">
              <strong>{monthLabel(month.month).split(' ')[0]}</strong> <span className="muted">{month.month.slice(0, 4)}</span>
              {month.contributions !== null && <span className="muted activity-count">{plural(month.contributions, 'contribution')}</span>}
            </h4>

            {month.commits.length > 0 && (
              <section className="activity-group">
                <p className="activity-title"><span className="activity-icon" aria-hidden="true">⇡</span>Created {plural(commitTotal, 'commit')} in {plural(month.commits.length, 'repository').replace('repositorys', 'repositories')}</p>
                <ul>
                  {month.commits.map(item => (
                    <li key={item.repo} className="activity-row">
                      <a href={item.url}>{item.repo}</a> <span className="muted">{plural(item.count, 'commit')}</span>
                      <span className="activity-bar" style={{ '--share': item.count / most } as React.CSSProperties} aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {month.created.length > 0 && (
              <section className="activity-group">
                <p className="activity-title"><span className="activity-icon" aria-hidden="true">＋</span>Created {plural(month.created.length, 'repository').replace('repositorys', 'repositories')}</p>
                <ul>
                  {month.created.map(item => (
                    <li key={item.repo} className="activity-row">
                      <a href={item.url}>{item.repo}</a>
                      {item.language && <span className="activity-language"><i style={{ background: languageColors[item.language] ?? 'var(--text-muted)' }} />{item.language}</span>}
                      <span className="muted activity-date">{shortDate(item.date)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {month.pullRequests.length > 0 && (
              <section className="activity-group">
                <p className="activity-title"><span className="activity-icon" aria-hidden="true">⤴</span>Opened {plural(month.pullRequests.length, 'pull request')}</p>
                <ul>
                  {month.pullRequests.map(item => (
                    <li key={item.url} className="activity-row">
                      <a href={item.url}>{item.title}</a>
                      <span className="activity-state" data-merged={item.merged}>{item.merged ? 'merged' : 'open'}</span>
                      <span className="muted activity-date">{shortDate(item.date)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </li>
        )
      })}
    </ol>
  )
}
