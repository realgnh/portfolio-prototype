/** Human name for a page, used by the scene-cut slate between pages ("Work", "Contact", a project's title…). */
import { projects } from '../content/projects'

const names: Record<string, string> = {
  '/': 'Home',
  '/work': 'Work',
  '/hobby-projects': 'Hobby projects',
  '/experience': 'Experience',
  '/resume': 'Résumé',
  '/contact': 'Contact',
}

export function sceneName(pathname: string) {
  if (names[pathname]) return names[pathname]
  const slug = pathname.match(/^\/(?:work|projects)\/([^/]+)/)?.[1]
  const project = slug && projects.find(item => item.slug === slug)
  return project ? project.title : 'Not found'
}
