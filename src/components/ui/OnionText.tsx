import type { ElementType, ReactNode } from 'react'

/**
 * Text that shows faint "onion skin" ghost copies trailing behind it on hover,
 * like an animator's onion skinning. Pass the plain text as `text` (used by the ghosts).
 * Styles: .onion in ui.css.
 */
export function OnionText({ as: Tag = 'span', text, className = '', children, ...rest }: {
  as?: ElementType; text: string; className?: string; children?: ReactNode; id?: string
}) {
  return (
    <Tag className={`onion ${className}`} data-text={text} {...rest}>
      {children ?? text}
    </Tag>
  )
}
