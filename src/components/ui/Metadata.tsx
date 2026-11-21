import { profile } from '../../content/profile'

/** Sets the browser tab title and the description search engines show. */
export function Metadata({ title, description }: { title: string; description: string }) {
  return (
    <>
      <title>{`${title} · ${profile.name}`}</title>
      <meta name="description" content={description} />
    </>
  )
}
