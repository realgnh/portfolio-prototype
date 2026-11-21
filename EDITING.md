# Where to edit what

Everything you'd normally change is text in **`src/content/`**. You rarely need to touch anything else.

| I want to change… | Edit this |
|---|---|
| My name, initials, status chip, role chips, intro | `src/content/profile.ts` |
| Email, social links, time zone / location (Contact page clock) | `src/content/profile.ts` |
| The "Currently" cards on Home | `profile.currently` in `src/content/profile.ts` |
| How many projects show on Home | `profile.featuredCount` in `src/content/profile.ts` |
| Education | `profile.education` in `src/content/profile.ts` |
| Internships and jobs | `src/content/experience.ts` |
| A company logo | Put the file in `public/images/companies/`, then set `logo: 'file.svg'` in `src/content/experience.ts` |
| Projects (text, numbers, FAQ, tags) | `src/content/projects.ts` |
| A project screenshot | Put the file in `public/images/projects/`, then set `image: 'file.png'` in `src/content/projects.ts` |
| Skill bubbles (logos and names) | `src/content/skills.ts` — logos come from [simpleicons.org](https://simpleicons.org); import the `si…` name at the top |
| Which colour goes with which area | `skillAreas` in `src/content/skills.ts` |
| Menu links and page titles / search descriptions | `src/content/navigation.ts` |
| Button labels, section headings, small wording | `src/content/sections.ts` |
| The résumé PDF | Replace `public/resume.pdf` |

## Look and feel

| I want to change… | Edit this |
|---|---|
| Colours, pastel tones, font, corner radius, page width | `src/styles/tokens.css` (dark theme values are in the same file) |
| Buttons, chips, picture placeholders | `src/styles/ui.css` |
| Header, menu, footer, ⌘K menu, toast | `src/styles/layout.css` |
| Hero, bubbles, experience rows, project cards | `src/styles/home.css` |
| Projects, project detail, Résumé, Contact pages | `src/styles/pages.css` |
| Where each skill bubble floats | `spots` at the top of `src/components/sections/SkillBubbles.tsx` |

## How the code is organised

```
src/
  content/     ← all your text and data (start here)
  pages/       ← one file per page: Home, Projects, ProjectDetail, Resume, Contact, NotFound
  components/
    ui/        ← small reusable pieces: Button, Chip, ImageSlot, BrandIcon, SectionHeading, Metadata
    layout/    ← frame around every page: Header, Footer, ThemeToggle, CommandMenu (⌘K), Layout
    sections/  ← bigger blocks used on pages: Hero, SkillBubbles, ExperienceList, ProjectCard, …
  lib/         ← behaviour helpers: toast messages, copy-email
  styles/      ← CSS, split as in the table above
  main.tsx     ← fonts, CSS imports and the list of routes (URLs)
public/
  images/projects/   ← project screenshots
  images/companies/  ← company logos
  resume.pdf
tests/portfolio.spec.ts  ← automated checks (npm test)
```

**Adding a page:** create it in `src/pages/`, add a route in `src/main.tsx`, and add a menu entry in `src/content/navigation.ts`.

After editing, run `npm run dev` to preview and `npm test` to check nothing broke.
