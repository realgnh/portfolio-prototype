export type Project = {
  slug: string
  title: string
  summary: string
  year: string
  role: string
  tags?: string[]
  /** One-sentence bet the project tested. Shown on experiment cards. */
  hypothesis: string
  /** One-sentence summary of what was built or changed. */
  method: string
  /** Skills from `site.skills` this project is evidence for. */
  tools: string[]
  thumbnail: string
  metrics: { value: string; label: string }[]
  xyz: { accomplished: string; measuredBy: string; byDoing: string }
  caseStudy: { problem: string; actions: string[]; outcome: string }
  faq: { question: string; answer: string }[]
}

// PLACEHOLDERS: All projects, dates, roles, and reported outcomes are fictional.
// EXTENSION POINT: Replace this array with a CMS or Markdown loader.
export const projects: Project[] = [
  {
    slug: 'clearpath-onboarding',
    title: 'Clearpath Onboarding',
    summary: 'Raised signup completion by 36% by replacing a sprawling setup flow with three clear steps.',
    year: '2025',
    role: 'Full-stack contributor',
    tags: ['Onboarding', 'TypeScript'],
    hypothesis: 'Fewer steps will improve signup completion.',
    method: 'Reduced seven screens to three required steps.',
    tools: ['TypeScript', 'React', 'PostgreSQL'],
    thumbnail: 'steps',
    metrics: [{ value: '+36%', label: 'Signup completion' }, { value: '−20%', label: 'Time to first value' }],
    xyz: {
      accomplished: 'Improved onboarding',
      measuredBy: '36% higher signup completion',
      byDoing: 'replacing seven setup screens with three essential steps',
    },
    caseStudy: {
      problem: 'New accounts faced seven setup screens before they could try the product. Most could not tell which choices mattered or whether they could change them later.',
      actions: [
        'Mapped the first session and interviewed people who left during setup.',
        'Moved optional configuration out of signup and tested a three-step prototype.',
        'Defined completion and time-to-first-value measures with the team before release.',
      ],
      outcome: 'In the fictional release, signup completion increased by 36% and time to first value fell by 20%.',
    },
    faq: [
      { question: 'What was the main engineering trade-off?', answer: 'Keeping the setup state on the server took more work up front but made it possible to save progress across devices.' },
      { question: 'What would come next?', answer: 'Test the new flow with keyboard-only users and check completion against the same baseline.' },
    ],
  },
  {
    slug: 'signal-dashboard',
    title: 'Signal Dashboard',
    summary: 'Cut weekly reporting time by 42% by bringing operational alerts and sources into one view.',
    year: '2024',
    role: 'Frontend contributor',
    tags: ['Dashboards', 'Data visualization'],
    hypothesis: 'A single view will speed up weekly reporting.',
    method: 'Collected alerts and their sources in one dashboard.',
    tools: ['TypeScript', 'React', 'SQL'],
    thumbnail: 'grid',
    metrics: [{ value: '−42%', label: 'Reporting time' }, { value: '+18%', label: 'Issues caught early' }],
    xyz: {
      accomplished: 'Made weekly reporting faster',
      measuredBy: 'a 42% reduction in reporting time',
      byDoing: 'consolidating alerts and their sources in one dashboard',
    },
    caseStudy: {
      problem: 'Operations teams pieced together status reports from multiple exports and spreadsheets, often overlooking changes between reporting cycles.',
      actions: [
        'Shadowed reporting sessions to learn which metrics actually drove decisions.',
        'Grouped signals by urgency and showed the underlying source next to each one.',
        'Tested the prototype against the existing reporting workflow.',
      ],
      outcome: 'In the fictional pilot, weekly reporting took 42% less time and teams caught 18% more issues early.',
    },
    faq: [
      { question: 'Where did the data come from?', answer: 'The prototype combined three sample exports. It kept source labels and timestamps beside every alert so operators could verify it.' },
      { question: 'Why not build real-time streaming?', answer: 'A scheduled refresh covered the reporting workflow. Live updates would have added complexity without helping the pilot answer its main question.' },
    ],
  },
  {
    slug: 'index-library',
    title: 'Index Library',
    summary: 'Improved first-search success by 28% with clearer categories and a more useful results page.',
    year: '2024',
    role: 'Search prototype developer',
    tags: ['Search', 'Information architecture'],
    hypothesis: 'Plain-language categories will help people find things on the first try.',
    method: 'Rebuilt categories from real search queries and validated them with a tree test.',
    tools: ['Python', 'FastAPI', 'PostgreSQL'],
    thumbnail: 'index',
    metrics: [{ value: '+28%', label: 'First-search success' }, { value: '−31%', label: 'Repeat searches' }],
    xyz: {
      accomplished: 'Made library resources easier to find',
      measuredBy: 'a 28% increase in first-search success',
      byDoing: 'using clearer categories and adding useful details to search results',
    },
    caseStudy: {
      problem: 'A resource library used internal team names as categories, so visitors often searched more than once for an item they knew existed.',
      actions: [
        'Used common search queries to draft a vocabulary for card sorting.',
        'Validated labels with a tree test and surfaced useful details on result cards.',
        'Compared first-search success against the existing library.',
      ],
      outcome: 'In the fictional usability study, first-search success rose 28% and repeat searches fell 31%.',
    },
    faq: [
      { question: 'Did this need AI-powered search?', answer: 'No. The main issue was inconsistent labels. A controlled vocabulary and keyword search made a useful baseline.' },
      { question: 'How was success measured?', answer: 'Participants tried to find a known item without changing their first query. The numbers are illustrative, not from a real study.' },
    ],
  },
  {
    slug: 'relay-handoffs',
    title: 'Relay Handoffs',
    summary: 'Reduced missed handoffs by 24% by showing who owned each request and what needed to happen next.',
    year: '2023',
    role: 'Full-stack contributor',
    tags: ['Workflow', 'State modeling'],
    hypothesis: 'A named owner and next action will stop requests falling through.',
    method: 'Added an explicit owner and next-action field to every pending request.',
    tools: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    thumbnail: 'relay',
    metrics: [{ value: '−24%', label: 'Missed handoffs' }, { value: '−16%', label: 'Resolution time' }],
    xyz: {
      accomplished: 'Improved request handoffs',
      measuredBy: '24% fewer missed handoffs',
      byDoing: 'showing a named owner and next action for every pending request',
    },
    caseStudy: {
      problem: 'Requests moved between support and operations in messages, leaving the next action and its owner unclear.',
      actions: [
        'Collected examples of stalled handoffs and identified common gaps.',
        'Prototyped a dedicated next-action field with an explicit owner.',
        'Piloted the workflow with two teams and reviewed unresolved requests each week.',
      ],
      outcome: 'In the fictional pilot, missed handoffs fell by 24% and average resolution time dropped by 16%.',
    },
    faq: [
      { question: 'How did you model ownership?', answer: 'Each pending request had one owner and one next action. Reassignment created a new event without losing the history.' },
      { question: 'What was intentionally out of scope?', answer: 'Notifications stayed in the existing channel. The prototype only tested whether clearer ownership reduced missed handoffs.' },
    ],
  },
  {
    slug: 'common-components',
    title: 'Common Components',
    summary: 'Halved the time needed to prototype recurring screens by making reliable patterns easier to find.',
    year: '2023',
    role: 'Frontend contributor',
    tags: ['Components', 'Documentation'],
    hypothesis: 'A documented component library will make recurring screens faster to build.',
    method: 'Audited recurring screens and documented the most-used patterns.',
    tools: ['TypeScript', 'React', 'Git'],
    thumbnail: 'components',
    metrics: [{ value: '−50%', label: 'Prototyping time' }, { value: '+32%', label: 'Component reuse' }],
    xyz: {
      accomplished: 'Made recurring screens faster to prototype',
      measuredBy: 'a 50% reduction in prototyping time',
      byDoing: 'cataloging and documenting reusable interface patterns',
    },
    caseStudy: {
      problem: 'Several teams maintained slightly different versions of the same screens, making prototypes slow and product behavior inconsistent.',
      actions: [
        'Audited recurring screens and prioritized patterns by usage.',
        'Documented the default, error, and empty states for the first set of components.',
        'Asked teams to prototype a familiar flow with the new library and recorded their feedback.',
      ],
      outcome: 'In the fictional comparison, teams prototyped recurring screens in half the time and component reuse rose by 32%.',
    },
    faq: [
      { question: 'What made a pattern worth sharing?', answer: 'It had to recur in at least two workflows and have similar behavior, not just a similar appearance.' },
      { question: 'How did you handle accessibility?', answer: 'The sample library specified keyboard behavior and focus styles alongside its visible states.' },
    ],
  },
]
