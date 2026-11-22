import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Chip } from '../components/ui/Chip'
import { Metadata } from '../components/ui/Metadata'
import { sections } from '../content/sections'
import { formatNoteDate, notes } from '../lib/notes'
import { NotFound } from './NotFound'

/** /notes/:slug — one note. The Markdown renderer (marked) downloads only when a note is opened. */
export function Note() {
  const { slug } = useParams()
  const note = notes.find(item => item.slug === slug)
  const [html, setHtml] = useState('')

  useEffect(() => {
    if (!note) return
    let cancelled = false
    // Notes are your own files, so their HTML is trusted.
    import('marked').then(({ marked }) => marked.parse(note.body, { async: true })).then(result => { if (!cancelled) setHtml(result) })
    return () => { cancelled = true }
  }, [note])

  if (!note) return <NotFound />
  return (
    <article className="page shell note-page">
      <Metadata title={note.title} description={note.summary} />
      <Link className="arrow-link back-link" to="/notes"><span aria-hidden="true">←</span> {sections.notes.back}</Link>
      <header className="page-header">
        <p className="muted">{formatNoteDate(note.date)} · {note.minutes} {sections.notes.minutes}</p>
        <h1>{note.title}</h1>
        {note.tags.length > 0 && <ul className="chip-row" aria-label="Tags">{note.tags.map(tag => <li key={tag}><Chip>{tag}</Chip></li>)}</ul>}
      </header>
      <div className="prose" aria-busy={!html} dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
