import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="footer shell">
      <p>{site.footer.note}</p>
    </footer>
  )
}
