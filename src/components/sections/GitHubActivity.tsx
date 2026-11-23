import { siGithub } from 'simple-icons'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../../content/profile'
import { sections } from '../../content/sections'
import { languageColors, loadGitHub, timeAgo } from '../../lib/github'
import type { GitHubData } from '../../lib/github'
import { BrandIcon } from '../ui/BrandIcon'
import { SectionHeading } from '../ui/SectionHeading'
import { ContributionActivity } from './ContributionActivity'
import { ContributionYears } from './ContributionYears'
import { newTab } from '../../lib/links'

type State = { status: 'idle' | 'loading' } | { status: 'ready'; data: GitHubData } | { status: 'error' }

/**
 * "On GitHub" (Contact page): contribution chart, contribution activity, profile and recent repos.
 * Fetches only when scrolled near. Data: lib/github.ts.
 */
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
    <section ref={root} id="github" className="section shell" aria-labelledby="github-title" data-scene="GitHub">
      <SectionHeading
        id="github-title"
        title={copy.heading}
        action={<a className="arrow-link" href={profileUrl} {...newTab}>{copy.profile} <span aria-hidden="true">↗</span></a>}
      />
      {state.status === 'error' && <p className="muted github-note">{copy.error} <a href={profileUrl} {...newTab}>{copy.profile}</a>.</p>}
      {(state.status === 'idle' || state.status === 'loading') && <div className="github-skeleton" aria-busy="true"><div /><div /></div>}
      {state.status === 'ready' && (
        <div className="github-layout">
          <div className="github-card github-calendar-card">
            <ContributionYears login={state.data.login} joinedYear={state.data.joinedYear} initial={state.data.contributions} />
          </div>
          <div className="github-card github-activity-card">
            <h3>{copy.recentActivity}</h3>
            <ContributionActivity months={state.data.activity} />
            <p className="muted github-private-note">{copy.privateNote}</p>
          </div>
          <div className="github-side">
            <div className="github-card github-profile">
              <img src={`${state.data.avatar}&s=96`} alt="" width="48" height="48" loading="lazy" />
              <div>
                <p className="github-login"><span className="github-mark"><BrandIcon skill={{ name: 'GitHub', icon: siGithub }} /></span>{state.data.login}</p>
                <p className="muted">{state.data.publicRepos} {copy.repos} · {state.data.followers} {copy.followers}</p>
              </div>
              {state.data.languages.length > 0 && (
                <ul className="github-languages" aria-label={copy.languages}>
                  {state.data.languages.map(language => (
                    <li key={language.name}><i style={{ background: languageColors[language.name] ?? 'var(--text-muted)' }} />{language.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <ul className="github-card github-repos" aria-label={copy.recentRepos}>
              {state.data.repos.length === 0 && <li className="muted">{copy.noRepos}</li>}
              {state.data.repos.map(repo => (
                <li key={repo.name}>
                  <a href={repo.url} {...newTab}>{repo.name}</a>
                  {repo.description && <p className="muted">{repo.description}</p>}
                  <p className="github-meta">{repo.language && <span>{repo.language}</span>}<span>★ {repo.stars}</span><span>{copy.updated} {timeAgo(repo.pushedAt)}</span></p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
