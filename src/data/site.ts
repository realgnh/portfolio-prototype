// PLACEHOLDER: Replace the identity, biography, experience, contact info, and links below.
export const site = {
  name: 'Alex Morgan',
  role: 'CS student',
  tagline: { before: 'From classwork', accent: 'software', after: '.' },
  hero: {
    tab: 'Profile',
    status: 'CS portfolio',
    secondLine: 'to useful ',
    intro: 'I’m Alex, a computer science student exploring software engineering and applied AI. This is where I keep notes on what I build.',
  },
  email: 'alex@example.com',
  socialLinks: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example-profile/', featured: true },
    { label: 'GitHub', href: 'https://github.com/example-profile' },
    { label: 'X', href: 'https://x.com/example_profile' },
  ],
  navItems: [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact', to: '/contact' },
  ],
  pages: {
    home: { title: 'Home', description: 'Alex Morgan’s placeholder computer science portfolio, skill stack, and résumé.' },
    projects: { title: 'Projects', description: 'Five fictional projects with example results for Alex Morgan’s portfolio.' },
    contact: { title: 'Contact', description: 'Placeholder contact details, LinkedIn, and résumé for Alex Morgan.' },
  },
  projects: { heading: 'Projects', caption: 'Fictional projects · Example results', browse: 'See the project index' },
  about: {
    eyebrow: '02 / Background',
    heading: 'About me',
    bio: 'I study Computer Science at X university aspiring to be a Software/AI Engineer',
  },
  skills: {
    eyebrow: '01 / Tools',
    heading: 'Skill stack',
    intro: 'A working list of tools for software, data, and AI.',
    groups: [
      { title: 'Languages', tools: ['Python', 'TypeScript', 'SQL'] },
      { title: 'Web & data', tools: ['React', 'FastAPI', 'PostgreSQL'] },
      { title: 'Tools', tools: ['Git', 'Docker'] },
      { title: 'AI / ML', tools: ['PyTorch'] },
    ],
  },
  resume: {
    eyebrow: '03 / Download',
    heading: 'Résumé',
    intro: 'A one-page résumé with sample education, skills, and contact details.',
    download: { label: 'Download résumé', href: '/resume.pdf' },
  },
  contact: {
    eyebrow: 'Placeholder contact details',
    intro: 'Have a project or just want to say hello? Email is the best way to reach me.',
    emailLabel: 'Email',
  },
  footer: { note: 'Prototype · All names, links and outcomes are placeholders.' },
}

export const ui = {
  skip: 'Skip to content',
  navigation: 'Main navigation',
  contactLinks: 'Contact links',
  resume: 'Resume',
  darkMode: 'Dark mode',
  lightTheme: 'Light',
  darkTheme: 'Dark',
  allProjects: 'All projects',
  projectXyz: 'Google XYZ · Example result',
  problem: 'Problem',
  actions: 'What I did',
  outcome: 'Outcome',
  next: 'Next project',
  caseStudy: 'Fictional case study',
  faq: 'Project FAQ',
  notFound: { title: 'Page not found', description: 'This page doesn’t exist.' },
}

export const contactLinks = [
  { label: site.email, href: `mailto:${site.email}`, channel: site.contact.emailLabel },
  ...site.socialLinks,
]
