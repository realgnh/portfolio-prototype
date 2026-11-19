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
    { label: 'Contact', to: '/contact' },
  ],
  pages: {
    home: { title: 'Home', description: 'Alex Morgan’s placeholder computer science portfolio, skill stack, and résumé.' },
    work: { title: 'Work', description: 'Five fictional projects with example results for Alex Morgan’s portfolio.' },
    contact: { title: 'Contact', description: 'Placeholder contact details, LinkedIn, and résumé for Alex Morgan.' },
  },
  work: { heading: 'Selected work', caption: 'Fictional projects · Example results', browse: 'See the project index' },
  about: {
    eyebrow: '02 / Background',
    heading: 'About me',
    bio: 'I study Computer Science at X university aspiring to be a Software/AI Engineer',
    roblox: {
      heading: 'Also: Roblox development',
      intro: 'On the side, I build games in Roblox Studio. These two links are placeholders.',
      games: [
        { name: 'Checkpoint Trail', description: 'A short obstacle course.', href: 'https://www.roblox.com/games/0000000000/Checkpoint-Trail' },
        { name: 'Pocket Arcade', description: 'A collection of small multiplayer games.', href: 'https://www.roblox.com/games/0000000000/Pocket-Arcade' },
      ],
    },
  },
  skills: {
    eyebrow: '01 / Tools',
    heading: 'Skill stack',
    intro: 'A working list of tools for software, data, and AI.',
    groups: [
      { title: 'Languages', tools: ['Python', 'TypeScript', 'SQL'] },
      { title: 'Web & data', tools: ['React', 'FastAPI', 'PostgreSQL'] },
      { title: 'Development & AI', tools: ['Git', 'Docker', 'PyTorch'] },
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

export const contactLinks = [
  { label: site.email, href: `mailto:${site.email}`, channel: site.contact.emailLabel },
  ...site.socialLinks,
]
