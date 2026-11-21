/**
 * NAVIGATION — the pill menu at the top and page titles/descriptions for search engines.
 * `to` must match a route in src/main.tsx.
 */
export const pages = {
  home: { to: '/', label: 'Home', title: 'Home', description: 'Alex Morgan, CS student building software and applied AI. Projects, experience and contact.' },
  projects: { to: '/projects', label: 'Projects', title: 'Projects', description: 'Projects by Alex Morgan with example results.' },
  experience: { to: '/#experience', label: 'Experience', title: 'Experience', description: '' },
  resume: { to: '/resume', label: 'Résumé', title: 'Résumé', description: 'Alex Morgan’s education, experience, skills and downloadable résumé.' },
  contact: { to: '/contact', label: 'Contact', title: 'Contact', description: 'Get in touch with Alex Morgan by email or social links.' },
}

export const navItems = [pages.home, pages.projects, pages.experience, pages.resume, pages.contact]
