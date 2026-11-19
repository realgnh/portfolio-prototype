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

- **Profile:** Edit [`src/data/site.ts`](src/data/site.ts) for the name, role, hero copy, biography, school, skill stack, email, X, LinkedIn, GitHub, navigation labels, and page metadata. Social links appear in the contact list in data order, most prominent first.
- **Résumé:** Replace [`public/resume.pdf`](public/resume.pdf) with your own PDF. If you rename it, update `site.resume.download.href`.
- **Projects:** Add or replace one object in [`src/data/projects.ts`](src/data/projects.ts). Use a unique URL-friendly `slug`, an outcome-first `summary`, two or three `metrics` (each with a `value` and `label`), `caseStudy` copy for the problem, actions, and outcome, and a `faq` array of question/answer pairs. Add `xyz: { accomplished, measuredBy, byDoing }` for the Google XYZ statement: “Accomplished X, as measured by Y, by doing Z.” Replace the example measurements with real evidence. The Projects index, case study routes, metadata, and next-project links follow the array's order.
- **Thumbnails:** Choose `steps`, `grid`, `index`, `relay`, or `components` for the project's `thumbnail`; an unrecognized value uses the grid illustration. They are decorative, so the card doesn't depend on them to tell its story. If you add meaningful imagery later, include equivalent alt text.

## Change fonts and colors

[`src/styles/tokens.css`](src/styles/tokens.css) holds the font, palette, and spacing tokens. Each mixed color lists the light endpoint first and the dark endpoint second. The light theme is the default unless the visitor's system prefers dark; an explicit toggle choice takes precedence on later visits. When switching typefaces, change the Fontsource packages and imports in [`src/main.tsx`](src/main.tsx), the font preload links in [`index.html`](index.html), and the CSS variables. The prototype loads Latin builds of only the weights and styles it uses; add subsets if your copy needs more glyph coverage.

## Motion

The theme toggle dissolves between the two rendered palettes with a continuous opacity animation. Without View Transitions, it interpolates the colors in Oklab using eased progress rounded to 0.001 per animation frame. The home glow softens as the visitor scrolls. Navigation updates immediately while the new content fades in and the active pill slides into place. Reduced motion uses a shorter dissolve, removes icon spin, and keeps the route, card, and control feedback brief.

## Extension points

- [`src/pages/Projects.tsx`](src/pages/Projects.tsx): Filter by tags before rendering the cards.
- [`src/data/projects.ts`](src/data/projects.ts): Integrate a CMS or Markdown loader while keeping the project shape.
- [`src/pages/Contact.tsx`](src/pages/Contact.tsx): Add a contact form and submit handler.
- [`src/lib/`](src/lib/): Add custom functions and integrations here.

## Checks

```sh
npx playwright install chromium
npm test
```

Playwright covers navigation, keyboard access, metadata, FAQs, the résumé download, theme persistence and transitions, WCAG AA text contrast, and 360/768/1440px layouts. Set `CHROME_BIN` to use an existing Chromium executable instead. Set `PORTFOLIO_SCREENSHOTS` to an output directory to save the responsive screenshots.

## Assumptions

- Home is the personal introduction and contains About. The old `/about` URL redirects to `/#about`.
- The one-page résumé is a placeholder. Case studies are available under Projects; legacy `/work` links redirect to `/projects`. There is no downloadable copy of the portfolio.
- The framed profile and greyscale palette take cues from Perry Wang; the oversized headline takes a cue from Daniel Sun. The layout, artwork, and copy are original.
- Contact puts email first, with placeholder social links below it. There is no backend, analytics, CMS, or form submission.
