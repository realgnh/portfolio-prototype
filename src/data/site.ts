// PLACEHOLDER: Replace the identity, biography, experience, contact info, and links below.
export const site = {
  name: 'Alex Morgan',
  role: 'CS student',
  tagline: { before: 'Always building.', accent: 'learning', after: '.' },
  hero: {
    tab: 'ALEX MORGAN / PROFILE',
    status: 'Student portfolio',
    secondLine: 'Always ',
    intro: 'I’m Alex, a computer science student interested in useful software and the small details that make it easier to use.',
    scroll: 'Explore the stack',
  },
  email: 'alex@example.com',
  socialLinks: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example-profile/', featured: true },
    { label: 'GitHub', href: 'https://github.com/example-profile' },
    { label: 'X', href: 'https://x.com/example_profile' },
  ],
  navItems: [
    { label: 'Home', to: '/' },
    { label: 'Work', to: '/work' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  pages: {
    home: { title: 'Home', description: 'Alex Morgan’s placeholder computer science portfolio, skill stack, and downloads.' },
    work: { title: 'Work', description: 'Five fictional projects with example results for Alex Morgan’s portfolio.' },
    about: { title: 'About', description: 'Placeholder biography and experience for Alex Morgan.' },
    contact: { title: 'Contact', description: 'Placeholder contact details, LinkedIn, and résumé for Alex Morgan.' },
  },
  work: { heading: 'Selected work', caption: 'Fictional projects · Example results', browse: 'See the project index' },
  about: {
    eyebrow: 'Placeholder biography',
    bio: 'I study Computer Science at X university aspiring to be a Software/AI Engineer',
    portraitLabel: 'Placeholder for a portrait of Alex Morgan',
    portraitCaption: 'Portrait placeholder',
    experienceHeading: 'Education & experience',
    experience: [
      { organization: 'X university', role: 'Computer Science student', period: '20XX–Present' },
      { organization: 'Example Lab', role: 'Student project contributor', period: '20XX' },
    ],
  },
  skills: {
    eyebrow: '01 / Tools',
    heading: 'Skill stack',
    intro: 'An example of how I’d group the tools I’m learning and building with.',
    groups: [
      { title: 'Languages', tools: ['Python', 'TypeScript', 'SQL'] },
      { title: 'Web & data', tools: ['React', 'FastAPI', 'PostgreSQL'] },
      { title: 'Development & AI', tools: ['Git', 'Docker', 'PyTorch'] },
    ],
  },
  resume: {
    eyebrow: '02 / Downloads',
    heading: 'Résumé & portfolio',
    intro: 'Take a copy of the project index or the one-page résumé. Both PDFs contain sample content.',
    downloads: [
      { label: 'Download portfolio', href: '/portfolio.pdf' },
      { label: 'Download résumé', href: '/resume.pdf' },
    ],
  },
  contact: {
    eyebrow: 'Placeholder contact details',
    intro: 'Have a project or just want to say hello? Email is the best way to reach me.',
  },
  footer: { heading: 'Get in touch', note: 'Prototype · All names, links and outcomes are placeholders.' },
}

export const ui = {
  skip: 'Skip to content',
  navigation: 'Main navigation',
  profileLinks: 'Profile links',
  resume: 'Resume',
  switchToLight: 'Switch to light theme',
  switchToDark: 'Switch to dark theme',
  readMore: 'Read more',
  allWork: 'All work',
  problem: 'Problem',
  role: 'Role',
  actions: 'What I did',
  outcome: 'Outcome',
  next: 'Next project',
  caseStudy: 'Fictional case study',
  faq: 'Project FAQ',
  notFound: { title: 'Page not found', description: 'This page doesn’t exist.' },
}

export const profileLinks = site.socialLinks
