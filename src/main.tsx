import '@fontsource/bebas-neue/latin-400.css'
import '@fontsource/newsreader/latin-400.css'
import '@fontsource/newsreader/latin-400-italic.css'
import '@fontsource/inter-tight/latin-600.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { CaseStudy } from './pages/CaseStudy'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'
import { Work } from './pages/Work'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Work /> },
      { path: 'work/:slug', element: <CaseStudy /> },
      { path: 'about', element: <About /> },
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
