import { Link } from 'react-router-dom'
import { Chip } from '../components/ui/Chip'
import { Metadata } from '../components/ui/Metadata'
import { pages } from '../content/navigation'
import { sections } from '../content/sections'
import { formatNoteDate, notes } from '../lib/notes'

/** /notes — list of notes. Write notes as Markdown files in src/content/notes/. */
export function Notes() {
  return (
    <section className="page shell" aria-labelledby="notes-title">
      <Metadata title={pages.notes.title} description={pages.notes.description} />
      <header className="page-header">
        <h1 id="notes-title">{pages.notes.title}</h1>
        <p className="muted">{sections.notes.intro}</p>
      </header>
      <ol className="note-list">
        {notes.map(note => (
          <li key={note.slug}>
            <Link to={`/notes/${note.slug}`} className="note-row">
              <span className="note-date muted">{formatNoteDate(note.date)}</span>
              <span className="note-main">
                <strong className="note-title">{note.title}</strong>
                <span className="muted">{note.summary}</span>
              </span>
              <span className="note-side">
                {note.tags.map(tag => <Chip key={tag}>{tag}</Chip>)}
                <span className="muted">{note.minutes} min</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
