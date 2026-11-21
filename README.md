# Portfolio prototype

A personal portfolio prototype for a computer science student, built with Vite, React, TypeScript, React Router, and plain CSS. The identity, school, skills, social links, résumé, five projects, and metrics are placeholders. See [IDEAS.md](IDEAS.md) for directions to try when you replace them.

## Run locally

Use Node 24 (or run `nvm use`).

```sh
npm install
npm run dev
npm run build
npm run preview
```

Open the URL printed by Vite. For a static deployment, publish `dist/` and rewrite non-file requests to `index.html` to support direct links such as `/projects/clearpath-onboarding`.

## Replace the content

- **Profile:** Edit [`src/data/site.ts`](src/data/site.ts) for the name, initials, hero copy, Fig. A step labels, skill stack ("Instruments"), lab log entries, email, X, LinkedIn, GitHub, navigation labels, and page metadata. Social links appear in the contact list in data order, most prominent first.
- **Lab log:** Add short dated notes to `site.log.entries`, newest first, for what you're reading, building, or shipping. It's the quickest way to keep the homepage feeling current.
- **Résumé:** Edit `site.resume.education` and `site.resume.experience` in [`src/data/site.ts`](src/data/site.ts). The `/resume` page reuses the Home skill stack and links to case studies selected by `site.resume.projectSlugs`. Replace [`public/resume.pdf`](public/resume.pdf) with your own PDF. If you rename it, update `site.resume.download.href`.
- **Projects:** Add or replace one object in [`src/data/projects.ts`](src/data/projects.ts). Use a unique URL-friendly `slug`, an outcome-first `summary`, two or three `metrics` (each with a `value` and `label`), `caseStudy` copy for the problem, actions, and outcome, and a `faq` array of question/answer pairs. Each project is shown as an experiment: write a one-sentence `hypothesis` and `method`, and list the skills it is evidence for in `tools` (names must match `site.skills`) so the Instruments table can link to it. The first `site.projects.featuredCount` projects appear on Home. Add `xyz: { accomplished, measuredBy, byDoing }` for the Google XYZ statement: “Accomplished X, as measured by Y, by doing Z.” Replace the example measurements with real evidence. The Projects index, case study routes, metadata, and next-project links follow the array's order.
- **Thumbnails:** Choose `steps`, `grid`, `index`, `relay`, or `components` for the project's `thumbnail`; an unrecognized value uses the grid illustration. They are decorative, so the card doesn't depend on them to tell its story. If you add meaningful imagery later, include equivalent alt text.

## Change fonts and colors

[`src/styles/tokens.css`](src/styles/tokens.css) holds the font, palette, grid, and spacing tokens. The design is a field notebook: navy ink on cream drafting paper (light, "Paper") and cream ink on blueprint navy (dark, "Blueprint"). Each mixed color lists the light endpoint first and the dark endpoint second. Headings use Newsreader; everything else uses IBM Plex Mono. When switching typefaces, change the Fontsource packages and imports in [`src/main.tsx`](src/main.tsx), the font preload links in [`index.html`](index.html), and the CSS variables.

## Motion

Fig. A draws its line on load and its three points link to the lab log, the experiment register, and the full register. Experiment cards lift on hover, routes fade in, and the theme toggle dissolves between palettes (or interpolates in Oklab without View Transitions). Reduced motion shows the figure fully drawn and keeps route and card feedback brief.

## Extension points

- [`src/data/projects.ts`](src/data/projects.ts): Integrate a CMS or Markdown loader while keeping the project shape.
- [`src/pages/Contact.tsx`](src/pages/Contact.tsx): Add a contact form and submit handler.
- [`src/lib/`](src/lib/): Add custom functions and integrations here.

## Checks

```sh
npx playwright install chromium
npm test
```

Playwright covers navigation, keyboard access, metadata, the experiment register and topic filter, skill-to-project links, FAQs, copy email, the résumé download, theme persistence, WCAG AA text contrast, and 360/768/1440px layouts on every page. Set `CHROME_BIN` to use an existing Chromium executable instead. Set `PORTFOLIO_SCREENSHOTS` to an output directory to save the responsive screenshots.

## Assumptions

- Home is the personal introduction and contains About. The old `/about` URL redirects to `/#about`.
- The one-page résumé is a placeholder. Case studies are available under Projects; legacy `/work` links redirect to `/projects`. There is no downloadable copy of the portfolio.
- The field-notes look (grid paper, navy ink, mono labels, hypothesis/method/result cards) follows a reference mockup supplied by the owner.
- Contact puts email first, with placeholder social links below it. There is no backend, analytics, CMS, or form submission.
