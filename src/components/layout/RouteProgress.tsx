import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/** A thin colourful bar that sweeps across the top whenever you change page. */
export function RouteProgress() {
  const { pathname } = useLocation()
  const first = useRef(true)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    setRun(value => value + 1)
  }, [pathname])

  return run ? <div key={run} className="route-progress" aria-hidden="true" /> : null
}
