// Fonts (only the weights the design uses): Bricolage Grotesque for headings,
// IBM Plex Sans for text and IBM Plex Mono for small labels and tags.
import '@fontsource/bricolage-grotesque/latin-600.css'
import '@fontsource/bricolage-grotesque/latin-800.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-sans/latin-700.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
// Styles: tokens first (colours, fonts), then base, then each area.
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import './styles/layout.css'
import './styles/home.css'
import './styles/pages.css'
import './styles/features.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider, useLocation, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Contact } from './pages/Contact'
import { Experience } from './pages/Experience'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProjectDetail } from './pages/ProjectDetail'
import { Projects } from './pages/Projects'
import { Resume } from './pages/Resume'

/** Keeps old /work and /work/:slug links working. */
function LegacyProjectsRedirect() {
  const { slug } = useParams()
  const { search, hash } = useLocation()
  const pathname = slug ? `/projects/${encodeURIComponent(slug)}` : '/projects'
  return <Navigate to={{ pathname, search, hash }} replace />
}

// ROUTES: add a page by creating it in src/pages and adding a line here (and in content/navigation.ts).
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'experience', element: <Experience /> },
      { path: 'resume', element: <Resume /> },
      { path: 'contact', element: <Contact /> },
      { path: 'work/:slug?', element: <LegacyProjectsRedirect /> },
      { path: 'about', element: <Navigate to="/" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
