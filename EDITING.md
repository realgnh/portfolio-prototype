# Where to edit what

Everything you'd normally change is text in **`src/content/`**. You rarely need to touch anything else.

| I want to change… | Edit this |
|---|---|
| My name, initials, status chip, role chips, intro | `src/content/profile.ts` |
| Email, social links, time zone / location (Contact page clock) | `src/content/profile.ts` |
| The bold "About me" (statement, paragraphs, facts, photo) | `profile.about` in `src/content/profile.ts` (photo file goes in `public/images/`) |
| The "Now playing / Now learning" line | `profile.now` in `src/content/profile.ts` |
| The "Currently working on…" cards on Home | `profile.currently` in `src/content/profile.ts` |
| Hobbies ("Outside of class") | `src/content/hobbies.ts` |
| Milestones on the Experience timeline (awards, firsts…) | `src/content/milestones.ts` |
| When a project appears on the timeline | `date` on that project in `src/content/projects.ts` |
| Easter egg triggers, hint text and the character's message | `src/content/easterEggs.ts` |
| How many projects show on Home | `profile.featuredCount` in `src/content/profile.ts` |
| Education | `profile.education` in `src/content/profile.ts` |
| Internships and jobs (dates as `'2026-04'`, or `'present'`) | `src/content/experience.ts` — ranges and durations ("3 months") are worked out for you |
| How many jobs show on Home | `experience.homeCount` in `src/content/sections.ts` |
| A company logo | Put the file in `public/images/companies/`, then set `logo: 'file.svg'` in `src/content/experience.ts` |
| Projects (text, numbers, FAQ, tags) | `src/content/projects.ts` |
| A project screenshot | Put the file in `public/images/projects/`, then set `image: 'file.png'` in `src/content/projects.ts` |
| A looping project video (plays on the project's page) | Put the file in `public/videos/projects/`, then set `video: 'file.mp4'` in `src/content/projects.ts` |
| Skill bubbles (logos and names) | `src/content/skills.ts` — logos come from [simpleicons.org](https://simpleicons.org); import the `si…` name at the top |
| Which colour goes with which area | `skillAreas` in `src/content/skills.ts` |
| Menu links and page titles / search descriptions | `src/content/navigation.ts` |
| Button labels, section headings, small wording, loading-screen tips | `src/content/sections.ts` |
| The résumé PDF | Replace `public/resume.pdf` |
| The browser-tab icon (favicon) | Edit `public/favicon.svg`, then run `node scripts/make-icons.mjs` to refresh the PNG copies |

## Look and feel

| I want to change… | Edit this |
|---|---|
| Colours, pastel tones, font, corner radius, page width | `src/styles/tokens.css` (dark theme values are in the same file) |
| Buttons, chips, picture placeholders | `src/styles/ui.css` |
| Header, menu, footer, Quick search, toast, loading screen, page progress bar | `src/styles/layout.css` |
| Hero, bubbles (and their wandering paths), About, experience rows, project cards, Skills, Hobbies | `src/styles/home.css` |
| Projects, project detail, Experience, Résumé, Contact pages | `src/styles/pages.css` |
| Page transition, light/dark transition, the animations switch | `src/styles/base.css` |
| Where each skill bubble floats, its path and speed | `spots` at the top of `src/components/sections/SkillBubbles.tsx` |
| Loading-screen length and bar segments (the cube's hop/roll speed is `hop`/`roll` in `layout.css`) | `DURATION` / `SEGMENTS` at the top of `src/components/layout/LoadingScreen.tsx` |
| Quick search actions | `items` in `src/components/layout/CommandMenu.tsx` |
| Order of sections on Home | `src/pages/Home.tsx` |
| Section fade-in timing (and which elements fade) | `STAGGER` / `SELECTOR` in `src/lib/reveal.ts`; look at `.reveal` in `src/styles/base.css` |
| Timeline line and dots | `.timeline…` rules at the bottom of `src/styles/pages.css`; data merge in `src/lib/timeline.ts` |
| Bubble pop effects (appear and click) | "Pops" block in `src/styles/home.css` |
| Smooth scrolling speed (logo, "See experience below") | `src/lib/smoothScroll.ts` |
| Project card cursor glow | `.project-card::before` in `src/styles/home.css` |
| Contact greeting wording ("Good evening!") | `src/lib/timeGreeting.ts` |
| The easter-egg character and brick loading cube | `src/components/layout/EasterEgg.tsx`; styles at the bottom of `src/styles/layout.css` |

## How the code is organised

```
src/
  content/     ← all your text and data (start here)
  pages/       ← one file per page: Home, Projects, ProjectDetail, Experience, Resume, Contact, NotFound
  components/
    ui/        ← small reusable pieces: Button, Chip, ImageSlot, BrandIcon, SectionHeading, Metadata
    layout/    ← frame around every page: Layout, Header, Footer, ThemeToggle, MotionToggle,
                 CommandMenu (Quick search), LoadingScreen, RouteProgress, EasterEgg
    sections/  ← bigger blocks used on pages: Hero, SkillBubbles, About, ExperienceList, ProjectCard,
                 ProjectMedia, SkillsGrid, Hobbies, CurrentlyList, ContactBand, Timeline
  lib/         ← behaviour helpers: preferences (theme + animations), dates, timeline, reveal,
                 timeGreeting, easterEgg, toast, copy-email
  styles/      ← CSS, split as in the table above
  main.tsx     ← fonts, CSS imports and the list of routes (URLs)
public/
  images/projects/   ← project screenshots
  images/companies/  ← company logos
  images/            ← your photo
  videos/projects/   ← short looping project clips
  resume.pdf
tests/portfolio.spec.ts  ← automated checks (npm test)
```

**Adding a page:** create it in `src/pages/`, add a route in `src/main.tsx`, and add a menu entry in `src/content/navigation.ts`.

After editing, run `npm run dev` to preview and `npm test` to check nothing broke.

## Preferences and switches

- **Animations** are on by default for everyone. The sparkle button in the header (or Quick search → "Turn animations on / off") switches them off; the choice is saved in the browser. The logic is in `src/lib/preferences.ts`; the CSS rule that stops everything is at the bottom of `src/styles/base.css`.
- **Light / dark** follows the visitor's system until they press the moon/sun button, then remembers their choice.
- **Loading screen** shows on a first visit or refresh, not when moving between pages.
