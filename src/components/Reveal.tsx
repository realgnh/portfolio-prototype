import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export function Reveal({ children }: { children: ReactNode }) {
  const item = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const target = item.current
    if (!target || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      target.dataset.revealed = ''
      observer.disconnect()
    }, { threshold: 0.1 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return <li ref={item} className="reveal">{children}</li>
}
