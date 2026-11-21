// PLACEHOLDER: Replace the identity, biography, experience, contact info, and links below.
export const site = {
  name: 'Alex Morgan',
  initials: 'AM',
  role: 'CS student',
  masthead: 'Field notes',
  hero: {
    sheet: 'Sheet 01.00',
    title: 'Researcher',
    intro: 'CS student at X university, aspiring Software/AI Engineer. This notebook tracks what I build, why I build it, and whether it works.',
    figure: {
      caption: 'Fig. A — Iteration sequence (schematic)',
      steps: [
        { label: '01 / Observe', to: '#log' },
        { label: '02 / Build', to: '#register' },
        { label: '03 / Measure', to: '/projects' },
      ],
    },
  },
  email: 'alex@example.com',
  socialLinks: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example-profile/', featured: true },
    { label: 'GitHub', href: 'https://github.com/example-profile' },
    { label: 'X', href: 'https://x.com/example_profile' },
  ],
  navItems: [
    { label: 'Profile', to: '/' },
    { label: 'Experiments', to: '/projects' },
    { label: 'Resume', to: '/resume' },
    { label: 'Contact', to: '/contact' },
  ],
  pages: {
    home: { title: 'Profile', description: 'Alex Morgan’s placeholder computer science portfolio: experiments, instruments, and a lab log.' },
    projects: { title: 'Experiments', description: 'Five fictional experiments with example results for Alex Morgan’s portfolio.' },
    resume: { title: 'Resume', description: 'Alex Morgan’s sample education, experience, skills, selected experiments, and downloadable résumé.' },
    contact: { title: 'Contact', description: 'Placeholder contact details, LinkedIn, and résumé for Alex Morgan.' },
  },
  projects: {
    register: 'Experiment register',
    caption: 'Example data',
    featuredCount: 2,
    browse: 'Open the full register',
    filterLabel: 'Filter experiments by topic',
    allLabel: 'All',
  },
  skills: {
    eyebrow: 'Instruments',
    caption: 'Each tool links to the experiments that used it',
    noEvidence: 'No record yet',
    groups: [
      { title: 'Languages', tools: ['Python', 'TypeScript', 'SQL'] },
      { title: 'Web & data', tools: ['React', 'FastAPI', 'PostgreSQL'] },
      { title: 'Tools', tools: ['Git', 'Docker'] },
      { title: 'AI / ML', tools: ['PyTorch'] },
    ],
  },
  // PLACEHOLDER: Short, dated notes on what you're reading, building, or shipping. Newest first.
  log: {
    eyebrow: 'Lab log',
    caption: 'Recent entries',
    entries: [
      { date: 'Nov 20XX', kind: 'Reading', note: 'Comparing retrieval-augmented generation against a plain keyword baseline on course notes.' },
      { date: 'Oct 20XX', kind: 'Building', note: 'A small PyTorch text classifier with a written error analysis, not just an accuracy number.' },
      { date: 'Sep 20XX', kind: 'Shipped', note: 'Published the Clearpath Onboarding write-up with its hypothesis, method, and result.' },
    ],
  },
  resume: {
    eyebrow: 'Sheet 03.00 / Résumé',
    heading: 'Résumé',
    intro: 'Education, experience, and selected experiments in software and applied AI.',
    download: { label: 'Download résumé', href: '/resume.pdf' },
    education: [{ program: 'Computer Science', school: 'X university', period: 'Expected 20XX' }],
    experience: [
      {
        role: 'Software engineering intern',
        organization: 'Example Organization',
        period: 'Summer 20XX',
        highlights: ['Prototyped an internal tool and documented how to test and maintain it.'],
      },
    ],
    projectSlugs: ['clearpath-onboarding', 'signal-dashboard', 'index-library'],
  },
  contact: {
    eyebrow: 'Sheet 04.00 / Correspondence',
    heading: 'Contact',
    intro: 'Tell me about a workflow your team keeps working around, or a model you don’t quite trust yet. Email is the fastest way to reach me.',
    emailLabel: 'Email',
  },
  footer: { label: 'Correspondence', note: 'Prototype · All names, links and outcomes are placeholders.' },
}

export const ui = {
  skip: 'Skip to content',
  navigation: 'Main navigation',
  contactLinks: 'Contact links',
  resume: 'Resume',
  darkMode: 'Dark mode',
  lightTheme: 'Paper',
  darkTheme: 'Blueprint',
  copyEmail: 'Copy email',
  copied: 'Copied',
  copyFailed: 'Press Ctrl+C to copy',
  allProjects: 'All experiments',
  experiment: 'Experiment',
  records: 'records',
  hypothesis: 'Hypothesis',
  method: 'Method',
  result: 'Result',
  projectXyz: 'Summary (Google XYZ)',
  context: 'Context',
  procedure: 'Procedure',
  readouts: 'Readouts',
  instruments: 'Instruments',
  faq: 'Open questions',
  previous: 'Previous record',
  next: 'Next record',
  caseStudy: 'Fictional case study',
  notFound: { title: 'Record not found', description: 'This sheet isn’t in the notebook.' },
}

export const contactLinks = [
  { label: site.email, href: `mailto:${site.email}`, channel: site.contact.emailLabel },
  ...site.socialLinks,
]

export function recordNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}
