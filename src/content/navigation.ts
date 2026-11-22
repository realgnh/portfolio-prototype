/**
 * NAVIGATION — the pill menu at the top and page titles/descriptions for search engines.
 * `to` must match a route in src/main.tsx.
 */
export const pages = {
  home: { to: '/', label: 'Home', title: 'Home', description: 'Abdalla Khedr, CS student building software and applied AI. Projects, experience and contact.' },
  projects: { to: '/projects', label: 'Projects', title: 'Projects', description: 'Projects by Abdalla Khedr with example results.' },
  experience: { to: '/experience', label: 'Experience', title: 'Experience', description: 'Abdalla Khedr’s internships, research and work experience.' },
  resume: { to: '/resume', label: 'Résumé', title: 'Résumé', description: 'Abdalla Khedr’s education, experience, skills and downloadable résumé.' },
  contact: { to: '/contact', label: 'Contact', title: 'Contact', description: 'Get in touch with Abdalla Khedr by email or social links.' },
}

export const navItems = [pages.home, pages.projects, pages.experience, pages.resume, pages.contact]
