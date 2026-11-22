/** Tags as one small uppercase monospace line: "TYPESCRIPT · REACT · POSTGRESQL". Styles: .tags in ui.css. */
export function Tags({ items, label = 'Tags' }: { items: string[]; label?: string }) {
  if (items.length === 0) return null
  return (
    <ul className="tags" aria-label={label}>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
}
