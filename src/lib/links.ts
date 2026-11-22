/**
 * Spread onto links that leave the site so they open in a new tab:
 * <a href="https://…" {...newTab}>. Email (mailto:) and on-site links don't need it.
 */
export const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const
