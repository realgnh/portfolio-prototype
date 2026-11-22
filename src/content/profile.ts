/**
 * PROFILE — your name, hero text, contact details and what's on your mind.
 * Everything here is placeholder text; replace it with your own.
 */
export const profile = {
  name: 'Abdalla Khedr',
  firstName: 'Abdalla',
  initials: 'AK',

  /** Small chip above your name. Set to '' to hide it. */
  status: 'Open to internships · Summer 20XX',

  /** The line under your name in the opening section. */
  headline: 'Software engineer who ships games to real players.',
  /** Plain-text roles shown above your name, separated by slashes. */
  roles: ['CS @ GIU', 'Software & AI', 'Roblox developer', 'Animator'],

  intro: 'I study Computer Science at GIU and build software, applied-AI tools and Roblox games. I like work I can measure.',

  /** The "About" section on Home: one bold line, one short paragraph and a few quick facts. */
  about: {
    statement: 'I like building things I can measure.',
    paragraph: 'CS student at GIU, heading toward Software / AI Engineering. I care about results you can see: a faster workflow, a clearer interface, a model I can explain. Off the clock I make Roblox games in Luau, which taught me to ship and listen to players, and I animate as a separate craft.',
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

  email: 'abdalla@example.com',
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
  education: [{ program: 'B.Sc. Computer Science', school: 'German International University (GIU)', start: '2024-09', end: '2028-06', expected: true }],

  /** One line under "The short version" on Home: what you're building right now. */
  currently: 'A small PyTorch text classifier, with a written error analysis.',

  /** How many projects appear in Selected work on Home (the first N in projects.ts; the first is the big one). */
  featuredCount: 3,

  contactIntro: 'Have an internship, a project or a question about something I built? Email is the fastest way to reach me.',
  footerNote: 'Prototype · All names, links and outcomes are placeholders.',
}
