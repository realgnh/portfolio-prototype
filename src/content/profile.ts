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

  /** The "About" section on Home: one bold line, one short paragraph and a few quick facts. */
  about: {
    statement: 'I like building things I can measure.',
    paragraph: 'CS student at X university, heading toward Software / AI Engineering. I care about results you can see: a faster workflow, a clearer interface, a model I can explain. Off the clock I animate and build games on Roblox, which taught me to ship and listen to players.',
    facts: [
      { label: 'Based in', value: 'Cairo' },
      { label: 'Studying', value: 'Computer Science' },
      { label: 'Focus', value: 'Software & applied AI' },
    ],
    /** Your photo: put the file in public/images/ and write its name, e.g. 'me.jpg'. */
    photo: undefined as string | undefined,
  },

  /** One-liners shown in the About section. Quick to update. Set a value to '' to hide it. */
  now: {
    playing: 'Placeholder game name',
    learning: 'Docker & deploying FastAPI',
  },

  email: 'alex@example.com',
  /** IANA time zone used for the local time on the Contact page. */
  timeZone: 'Africa/Cairo',
  location: 'Cairo',

  /** Most important first: on the Contact page the first link is the biggest, then each gets smaller. */
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example-profile/' },
    { label: 'GitHub', href: 'https://github.com/realgnh' },
    { label: 'X', href: 'https://x.com/example_profile' },
  ],

  /**
   * GitHub activity panel. `id` is your permanent GitHub account number, so the panel keeps
   * working if you rename your account. `login` is only a fallback for links if GitHub can't be reached.
   */
  github: { id: 150723285, login: 'realgnh', repoCount: 4 },

  /** Replace public/resume.pdf with your own file. */
  resume: { href: '/resume.pdf', label: 'Download résumé' },
  /** `start` / `end` are 'YYYY-MM'. Set `expected: true` while you're still studying. */
  education: [{ program: 'B.Sc. Computer Science', school: 'X university', start: '2024-09', end: '2028-06', expected: true }],

  /** "Currently working on…" cards on Home. Keep it to three. */
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
