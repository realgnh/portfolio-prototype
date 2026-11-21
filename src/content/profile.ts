import type { Area } from './skills'

/**
 * PROFILE — your name, hero text, contact details and what's on your mind.
 * Everything here is placeholder text; replace it with your own.
 */
export const profile = {
  name: 'Alex Morgan',
  firstName: 'Alex',
  initials: 'AM',

  /** Small chip above your name. Set to '' to hide it. */
  status: 'Open to internships · Summer 20XX',

  /** Chips under your name; `area` picks the colour (see skills.ts). */
  roles: [
    { label: 'CS student', area: 'languages' },
    { label: 'Software engineer', area: 'frontend' },
    { label: 'AI curious', area: 'ai' },
  ] satisfies { label: string; area: Area }[],

  intro: 'CS student at X university, building software and learning how to make AI systems people can trust.',

  email: 'alex@example.com',
  /** IANA time zone used for the local time on the Contact page. */
  timeZone: 'Africa/Cairo',
  location: 'Cairo',

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example-profile/' },
    { label: 'GitHub', href: 'https://github.com/example-profile' },
    { label: 'X', href: 'https://x.com/example_profile' },
  ],

  /** Replace public/resume.pdf with your own file. */
  resume: { href: '/resume.pdf', label: 'Download résumé' },
  education: [{ program: 'B.Sc. Computer Science', school: 'X university', period: 'Expected 20XX' }],

  /** Short "Currently" list on Home. Keep it to three lines. */
  currently: [
    { label: 'Building', text: 'A small PyTorch text classifier with a written error analysis.' },
    { label: 'Reading', text: 'How teams evaluate retrieval-augmented generation against keyword search.' },
    { label: 'Learning', text: 'Docker and deploying FastAPI services properly.' },
  ],

  /** How many projects appear on Home (the first N in projects.ts). */
  featuredCount: 3,

  contactIntro: 'Have an internship, a project or a question about something I built? Email is the fastest way to reach me.',
  footerNote: 'Prototype · All names, links and outcomes are placeholders.',
}
