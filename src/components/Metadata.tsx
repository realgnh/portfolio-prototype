import { site } from '../data/site'

export function Metadata({ title, description }: { title: string; description: string }) {
  return (
    <>
      <title>{`${title} · ${site.name}`}</title>
      <meta name="description" content={description} />
    </>
  )
}
