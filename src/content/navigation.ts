/**
 * NAVIGATION — the menu at the top and page titles/descriptions for search engines.
 * `to` must match a route in src/main.tsx.
 */
export const pages = {
  home: { to: '/', label: 'Home', title: 'Home', description: 'Abdalla Khedr, CS student building software and applied AI. Projects, experience and contact.' },
  projects: { to: '/work', label: 'Work', title: 'Work', description: 'Software and AI projects by Abdalla Khedr, with results.' },
  hobby: { to: '/hobby-projects', label: 'Hobby projects', title: 'Hobby projects', description: 'Roblox games, Luau systems and animation by Abdalla Khedr.' },
  experience: { to: '/experience', label: 'Experience', title: 'Experience', description: 'Abdalla Khedr’s internships, research and work experience.' },
  resume: { to: '/resume', label: 'Résumé', title: 'Résumé', description: 'Abdalla Khedr’s education, experience, skills and downloadable résumé.' },
  contact: { to: '/contact', label: 'Contact', title: 'Contact', description: 'Get in touch with Abdalla Khedr by email or social links.' },
}

/** Main menu. Home is the "AK." logo and the résumé is a button, so neither is listed here. */
export const navItems = [pages.projects, pages.hobby, pages.experience, pages.contact]
