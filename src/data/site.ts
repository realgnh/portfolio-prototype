// PLACEHOLDER: Replace the identity, biography, experience, contact info, and links below.
export const site = {
  name: 'Alex Morgan',
  role: 'Product designer',
  tagline: { before: 'I make complex things ', accent: 'simple', after: '.' },
  location: 'Brooklyn, NY',
  background: 'Previously at Example Studio',
  email: 'alex@example.com',
  socialLinks: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/example-profile/' }],
  resumeUrl: 'https://example.com/resume.pdf',
  navItems: [
    { label: 'Work', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  pages: {
    work: { title: 'Work', description: 'Five fictional projects with example results, by placeholder designer Alex Morgan.' },
    about: { title: 'About', description: 'Placeholder biography and experience for Alex Morgan.' },
    contact: { title: 'Contact', description: 'Placeholder contact details, LinkedIn, and résumé for Alex Morgan.' },
  },
  work: { eyebrow: 'Portfolio prototype', heading: 'Selected work', caption: 'Five fictional projects · Example results' },
  about: {
    eyebrow: 'Placeholder biography',
    bio: 'I’m Alex, a product designer who turns complicated workflows into things people can use with confidence. I like to start with the part of the process people work around, then design from there.',
    portraitLabel: 'Placeholder for a portrait of Alex Morgan',
    portraitCaption: 'Portrait placeholder',
    experienceHeading: 'Experience',
    experience: [
      { organization: 'Example Studio', role: 'Product designer', period: '2022–Present' },
      { organization: 'Sample Co.', role: 'Associate designer', period: '2019–2022' },
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
  notFound: { title: 'Page not found', description: 'This page doesn’t exist.' },
}

export const profileLinks = [
  ...site.socialLinks,
  { label: ui.resume, href: site.resumeUrl },
]
