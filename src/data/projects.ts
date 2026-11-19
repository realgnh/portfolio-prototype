export type Project = {
  slug: string
  title: string
  summary: string
  year: string
  role: string
  tags?: string[]
  thumbnail: string
  metrics: { value: string; label: string }[]
  caseStudy: { problem: string; role: string; actions: string[]; outcome: string }
}

// PLACEHOLDERS: All projects, dates, roles, and reported outcomes are fictional.
// EXTENSION POINT: Replace this array with a CMS or Markdown loader.
export const projects: Project[] = [
  {
    slug: 'clearpath-onboarding',
    title: 'Clearpath Onboarding',
    summary: 'Raised signup completion by 36% by replacing a sprawling setup flow with three clear steps.',
    year: '2025',
    role: 'Lead designer',
    tags: ['Onboarding', 'Product design'],
    thumbnail: 'steps',
    metrics: [{ value: '+36%', label: 'Signup completion' }, { value: '−20%', label: 'Time to first value' }],
    caseStudy: {
      problem: 'New accounts faced seven setup screens before they could try the product. Most could not tell which choices mattered or whether they could change them later.',
      role: 'I led the flow redesign and partnered with a researcher and two engineers.',
      actions: [
        'Mapped the first session and interviewed people who left during setup.',
        'Moved optional configuration out of signup and tested a three-step prototype.',
        'Defined completion and time-to-first-value measures with the team before release.',
      ],
      outcome: 'In the fictional release, signup completion increased by 36% and time to first value fell by 20%.',
    },
  },
  {
    slug: 'signal-dashboard',
    title: 'Signal Dashboard',
    summary: 'Cut weekly reporting time by 42% by bringing operational alerts and sources into one view.',
    year: '2024',
    role: 'Product designer',
    tags: ['Dashboards', 'Research'],
    thumbnail: 'grid',
    metrics: [{ value: '−42%', label: 'Reporting time' }, { value: '+18%', label: 'Issues caught early' }],
    caseStudy: {
      problem: 'Operations teams pieced together status reports from multiple exports and spreadsheets, often overlooking changes between reporting cycles.',
      role: 'I designed the dashboard and worked with an analyst to define useful signals.',
      actions: [
        'Shadowed reporting sessions to learn which metrics actually drove decisions.',
        'Grouped signals by urgency and showed the underlying source next to each one.',
        'Tested the prototype against the existing reporting workflow.',
      ],
      outcome: 'In the fictional pilot, weekly reporting took 42% less time and teams caught 18% more issues early.',
    },
  },
  {
    slug: 'index-library',
    title: 'Index Library',
    summary: 'Improved first-search success by 28% with clearer categories and a more useful results page.',
    year: '2024',
    role: 'Design researcher',
    tags: ['Information architecture', 'Search'],
    thumbnail: 'index',
    metrics: [{ value: '+28%', label: 'First-search success' }, { value: '−31%', label: 'Repeat searches' }],
    caseStudy: {
      problem: 'A resource library used internal team names as categories, so visitors often searched more than once for an item they knew existed.',
      role: 'I led the discovery work and co-designed the new taxonomy with a content strategist.',
      actions: [
        'Used common search queries to draft a vocabulary for card sorting.',
        'Validated labels with a tree test and surfaced useful details on result cards.',
        'Compared first-search success against the existing library.',
      ],
      outcome: 'In the fictional usability study, first-search success rose 28% and repeat searches fell 31%.',
    },
  },
  {
    slug: 'relay-handoffs',
    title: 'Relay Handoffs',
    summary: 'Reduced missed handoffs by 24% by showing who owned each request and what needed to happen next.',
    year: '2023',
    role: 'Product designer',
    tags: ['Workflow', 'Prototyping'],
    thumbnail: 'relay',
    metrics: [{ value: '−24%', label: 'Missed handoffs' }, { value: '−16%', label: 'Resolution time' }],
    caseStudy: {
      problem: 'Requests moved between support and operations in messages, leaving the next action and its owner unclear.',
      role: 'I designed the handoff workflow alongside support leads and an engineer.',
      actions: [
        'Collected examples of stalled handoffs and identified common gaps.',
        'Prototyped a dedicated next-action field with an explicit owner.',
        'Piloted the workflow with two teams and reviewed unresolved requests each week.',
      ],
      outcome: 'In the fictional pilot, missed handoffs fell by 24% and average resolution time dropped by 16%.',
    },
  },
  {
    slug: 'common-components',
    title: 'Common Components',
    summary: 'Halved the time needed to prototype recurring screens by making reliable patterns easier to find.',
    year: '2023',
    role: 'Design systems designer',
    tags: ['Design systems', 'Documentation'],
    thumbnail: 'components',
    metrics: [{ value: '−50%', label: 'Prototyping time' }, { value: '+32%', label: 'Component reuse' }],
    caseStudy: {
      problem: 'Several teams maintained slightly different versions of the same screens, making prototypes slow and product behavior inconsistent.',
      role: 'I coordinated the UI audit and partnered with engineering on the initial library.',
      actions: [
        'Audited recurring screens and prioritized patterns by usage.',
        'Documented the default, error, and empty states for the first set of components.',
        'Asked teams to prototype a familiar flow with the new library and recorded their feedback.',
      ],
      outcome: 'In the fictional comparison, teams prototyped recurring screens in half the time and component reuse rose by 32%.',
    },
  },
]
