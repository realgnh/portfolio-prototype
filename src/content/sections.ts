/**
 * SECTION COPY — headings and short labels used around the site.
 * Change wording here; layout lives in src/components and src/pages.
 */
export const sections = {
  hero: { primary: 'Get in touch', secondary: 'Download résumé', skillsLabel: 'Tools I use', scrollCue: 'See experience below' },
  about: { heading: 'About me', nowPlaying: 'Now playing', nowLearning: 'Now learning' },
  experience: { heading: 'Experience', intro: 'Where I’ve worked and studied.', all: 'See all experience', pageIntro: 'Internships, research and work, newest first.', homeCount: 2 },
  skills: { heading: 'Skills', intro: 'Languages, frameworks and tools I use, grouped by area.' },
  hobbies: { heading: 'Outside of class', intro: 'What I do for fun, and where a lot of my shipping instincts come from.' },
  projects: { heading: 'Selected projects', intro: 'Things I’ve built, and what changed because of them.', all: 'See all projects', pageIntro: 'Everything I’ve built so far. Filter by area.', allFilter: 'All' },
  currently: { heading: 'Currently working on' },
  contactBand: { heading: 'Let’s build something.', text: 'Open to internships and interesting projects.' },
  project: { back: 'All projects', problem: 'Problem', approach: 'Approach', result: 'Result', summary: 'In one sentence', faq: 'Questions', previous: 'Previous', next: 'Next', tools: 'Built with', year: 'Year' },
  resume: { heading: 'Résumé', intro: 'Education, experience, selected projects and skills.', education: 'Education', experience: 'Experience', skills: 'Skills', projects: 'Selected projects', projectSlugs: ['clearpath-onboarding', 'signal-dashboard', 'index-library'] },
  contact: { heading: 'Contact', email: 'Email', copy: 'Copy email', localTime: 'My local time', elsewhere: 'Elsewhere' },
  placeholders: { project: 'Add screenshot', projectMedia: 'Add screenshot or video', photo: 'Add photo' },
  commandMenu: { label: 'Quick search', button: 'Quick search', placeholder: 'Search pages, projects and actions…', copyEmail: 'Copy email address', toggleTheme: 'Switch light / dark mode', toggleMotion: 'Turn animations on / off', downloadResume: 'Download résumé', empty: 'Nothing matches.', pages: 'Pages', projects: 'Projects', actions: 'Actions' },
  toast: { copied: 'Email copied', failed: 'Couldn’t copy. Select the address and press Ctrl+C.' },
  theme: { label: 'Dark mode' },
  motion: { label: 'Animations', on: 'Animations on', off: 'Animations off' },
  loader: {
    title: 'Loading portfolio',
    tips: ['Spawning projects…', 'Rigging animations…', 'Compiling coffee…', 'Tip: press Ctrl+K for quick search', 'Placing skill bubbles…'],
  },
  skip: 'Skip to content',
  notFound: { title: 'Page not found', description: 'This page doesn’t exist, but the projects do.' },
}
