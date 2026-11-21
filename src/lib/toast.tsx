import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const ToastContext = createContext<(message: string) => void>(() => {})

/** Shows short confirmation messages at the bottom of the screen. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [count, setCount] = useState(0)
  const timer = useRef(0)

  const show = useCallback((next: string) => {
    window.clearTimeout(timer.current)
    setMessage(next)
    setCount(value => value + 1)
    timer.current = window.setTimeout(() => setMessage(''), 2600)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {message && <div key={count} className="toast">{message}</div>}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
