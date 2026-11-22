import { useEffect, useRef, useState } from 'react'

/**
 * Clearpath Onboarding demo: click through the old 7-screen signup and the new 3-step one,
 * and compare how long each takes. Screens are illustrative placeholders.
 */
const flows = {
  before: {
    label: 'Before: 7 screens',
    screens: [
      { title: 'Create your account', fields: ['Email', 'Password'] },
      { title: 'Verify your email', fields: ['6-digit code'] },
      { title: 'Choose a plan', fields: ['Plan', 'Billing period'] },
      { title: 'Tell us about your team', fields: ['Team size', 'Industry'] },
      { title: 'Connect integrations', fields: ['Calendar', 'Chat app'] },
      { title: 'Notification preferences', fields: ['Email digest', 'Push alerts'] },
      { title: 'Upload a profile photo', fields: ['Photo'] },
    ],
  },
  after: {
    label: 'After: 3 steps',
    screens: [
      { title: 'Create your account', fields: ['Email', 'Password'] },
      { title: 'Name your workspace', fields: ['Workspace name'] },
      { title: 'You’re in!', fields: [] },
    ],
  },
} as const

type FlowKey = keyof typeof flows

export default function ClearpathDemo() {
  const [flow, setFlow] = useState<FlowKey>('before')
  const [step, setStep] = useState(0)
  const [started, setStarted] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const [results, setResults] = useState<Partial<Record<FlowKey, number>>>({})
  const timer = useRef(0)

  const screens = flows[flow].screens
  const done = step >= screens.length
  const elapsed = started ? ((done ? results[flow] ?? 0 : now - started) / 1000) : 0

  useEffect(() => {
    if (!started || done) return
    timer.current = window.setInterval(() => setNow(performance.now()), 100)
    return () => window.clearInterval(timer.current)
  }, [started, done])

  function choose(next: FlowKey) {
    setFlow(next)
    setStep(0)
    setStarted(null)
  }

  function advance() {
    const at = performance.now()
    if (!started) { setStarted(at); setNow(at) }
    const next = step + 1
    if (next >= screens.length) setResults(current => ({ ...current, [flow]: at - (started ?? at) }))
    setStep(next)
  }

  const screen = screens[Math.min(step, screens.length - 1)]

  return (
    <div className="demo">
      <div className="demo-tabs" role="group" aria-label="Signup flow">
        {(Object.keys(flows) as FlowKey[]).map(key => (
          <button key={key} type="button" className="filter" aria-pressed={flow === key} onClick={() => choose(key)}>{flows[key].label}</button>
        ))}
      </div>

      <div className="demo-stage">
        <div className="demo-progress" aria-hidden="true">
          {screens.map((_, index) => <span key={index} data-on={index < step || undefined} />)}
        </div>
        {!done ? (
          <div className="demo-screen" key={`${flow}-${step}`}>
            <p className="muted demo-step">Step {step + 1} of {screens.length}</p>
            <h3>{screen.title}</h3>
            {screen.fields.map(field => <div key={field} className="demo-field"><span>{field}</span><i /></div>)}
            <button type="button" className="button button-primary" onClick={advance}>{step === screens.length - 1 ? 'Finish' : 'Continue'} <span aria-hidden="true">→</span></button>
          </div>
        ) : (
          <div className="demo-screen demo-done" role="status">
            <h3>Done in {elapsed.toFixed(1)}s</h3>
            <p className="muted">{screens.length} screens clicked through.</p>
            <button type="button" className="button button-outline" onClick={() => choose(flow === 'before' ? 'after' : 'before')}>
              Try the {flow === 'before' ? 'new 3-step' : 'old 7-screen'} flow <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      <dl className="demo-results" aria-live="polite">
        {(Object.keys(flows) as FlowKey[]).map(key => (
          <div key={key}><dt>{flows[key].label}</dt><dd>{results[key] !== undefined ? `${(results[key]! / 1000).toFixed(1)}s` : '—'}</dd></div>
        ))}
        {started && !done && <div className="demo-timer"><dt>Timer</dt><dd>{elapsed.toFixed(1)}s</dd></div>}
      </dl>
    </div>
  )
}
