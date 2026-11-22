import { siGithub } from 'simple-icons'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { describeEvent, loadGitHub, timeAgo } from '../../lib/github'
import type { GitHubData } from '../../lib/github'
import { BrandIcon } from '../ui/BrandIcon'
import { SectionHeading } from '../ui/SectionHeading'

type State = { status: 'idle' | 'loading' } | { status: 'ready'; data: GitHubData } | { status: 'error' }

/** Live GitHub panel: profile, top languages, recently updated repos and recent activity. Fetches only when scrolled into view. */
export function GitHubActivity() {
  const [state, setState] = useState<State>({ status: 'idle' })
  const root = useRef<HTMLElement>(null)
  const copy = sections.github

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      setState({ status: 'loading' })
      loadGitHub().then(data => setState({ status: 'ready', data }), () => setState({ status: 'error' }))
    }, { rootMargin: '300px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const profileUrl = state.status === 'ready' ? state.data.url : `https://github.com/${profile.github.login}`

  return (
    <section ref={root} id="github" className="section shell" aria-labelledby="github-title">
      <SectionHeading
        id="github-title"
        title={copy.heading}
        intro={copy.intro}
        action={<a className="arrow-link" href={profileUrl}>{copy.profile} <span aria-hidden="true">↗</span></a>}
      />
      {state.status === 'error' && <p className="muted github-note">{copy.error} <a href={profileUrl}>{copy.profile}</a>.</p>}
      {(state.status === 'idle' || state.status === 'loading') && <div className="github-grid github-skeleton" aria-busy="true"><div /><div /><div /></div>}
      {state.status === 'ready' && (
        <div className="github-grid">
          <div className="github-card github-profile">
            <img src={`${state.data.avatar}&s=96`} alt="" width="48" height="48" loading="lazy" />
            <div>
              <p className="github-login"><span className="github-mark"><BrandIcon skill={{ name: 'GitHub', icon: siGithub }} /></span>{state.data.login}</p>
              <p className="muted">{state.data.publicRepos} {copy.repos} · {state.data.followers} {copy.followers}</p>
            </div>
            {state.data.languages.length > 0 && (
              <ul className="github-languages" aria-label={copy.languages}>
                {state.data.languages.map(language => <li key={language.name}>{language.name}</li>)}
              </ul>
            )}
          </div>
          <ul className="github-card github-repos" aria-label={copy.recentRepos}>
            {state.data.repos.length === 0 && <li className="muted">{copy.noRepos}</li>}
            {state.data.repos.map(repo => (
              <li key={repo.name}>
                <a href={repo.url}>{repo.name}</a>
                {repo.description && <p className="muted">{repo.description}</p>}
                <p className="github-meta">{repo.language && <span>{repo.language}</span>}<span>★ {repo.stars}</span><span>{copy.updated} {timeAgo(repo.pushedAt)}</span></p>
              </li>
            ))}
          </ul>
          <ol className="github-card github-events" aria-label={copy.recentActivity}>
            {state.data.events.length === 0 && <li className="muted">{copy.noActivity}</li>}
            {state.data.events.map((event, index) => (
              <li key={`${event.createdAt}-${index}`}><span>{describeEvent(event)}</span><time className="muted" dateTime={event.createdAt}>{timeAgo(event.createdAt)}</time></li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
