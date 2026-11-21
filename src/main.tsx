import '@fontsource/newsreader/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-600.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider, useLocation, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CaseStudy } from './pages/CaseStudy'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Projects } from './pages/Projects'
import { Resume } from './pages/Resume'

function LegacyProjectsRedirect() {
  const { slug } = useParams()
  const { search, hash } = useLocation()
  const pathname = slug ? `/projects/${encodeURIComponent(slug)}` : '/projects'
  return <Navigate to={{ pathname, search, hash }} replace />
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <CaseStudy /> },
      { path: 'work/:slug?', element: <LegacyProjectsRedirect /> },
      { path: 'about', element: <Navigate to="/#about" replace /> },
      { path: 'resume', element: <Resume /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
