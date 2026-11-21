import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'outline'
  /** Internal route, e.g. '/contact'. */
  to?: string
  /** External link or file, e.g. '/resume.pdf'. */
  href?: string
  download?: boolean
}

/** Rounded pill button. Use `to` for pages on this site and `href` for files or other sites. */
export function Button({ children, variant = 'primary', to, href, download }: Props) {
  const className = `button button-${variant}`
  if (to) return <Link className={className} to={to}>{children}</Link>
  return <a className={className} href={href} download={download}>{children}</a>
}
