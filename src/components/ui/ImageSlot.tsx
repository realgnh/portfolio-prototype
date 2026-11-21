import type { Tone } from '../../content/skills'

type Props = {
  /** File name inside public/images/<folder>/. Leave undefined for a placeholder. */
  src?: string
  /** 'root' means public/images/ itself (used for your photo). */
  folder: 'projects' | 'companies' | 'root'
  alt: string
  /** Text shown on the placeholder, e.g. "Add screenshot" or a company's initials. */
  label: string
  tone?: Tone
  /** 'wide' for project screenshots (16:10), 'square' for company logos. */
  shape?: 'wide' | 'square'
}

/**
 * A picture, or a soft pastel placeholder until you add one.
 * To add a picture: drop the file in public/images/<folder>/ and set its name in src/content.
 */
export function ImageSlot({ src, folder, alt, label, tone = 'sky', shape = 'wide' }: Props) {
  if (src) {
    return (
      <div className={`image-slot image-slot-${shape}`} data-tone={tone}>
        <img src={folder === 'root' ? `/images/${src}` : `/images/${folder}/${src}`} alt={alt} loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`image-slot image-slot-${shape} is-placeholder`} data-tone={tone} role="img" aria-label={`${alt} (placeholder)`}>
      {shape === 'wide' && (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-9 9" />
        </svg>
      )}
      <span aria-hidden="true">{label}</span>
    </div>
  )
}
