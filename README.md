# Portfolio prototype

A lightweight, results-first portfolio built with Vite, React, TypeScript, React Router, and plain CSS. The sample identity, contact details, external links, five projects, and all metrics are fictional placeholders. See [IDEAS.md](IDEAS.md) for directions to try when you replace them.

## Run locally

Use Node 24 (or run `nvm use`).

```sh
npm install
npm run dev
npm run build
npm run preview
```

Open the URL printed by Vite. For a static deployment, publish `dist/` and rewrite non-file requests to `index.html` so direct links such as `/work/clearpath-onboarding` work.

## Replace the content

- **Profile:** Edit [`src/data/site.ts`](src/data/site.ts) for the name, role, hero text (including its single italic accent), biography, experience, email, LinkedIn, résumé URL, navigation labels, and page metadata. Replace the About placeholder with a real portrait and descriptive alt text when ready.
- **Projects:** Add or replace one object in [`src/data/projects.ts`](src/data/projects.ts). Use a unique URL-friendly `slug`, an outcome-first `summary`, two or three `metrics` (each with a `value` and `label`), and `caseStudy` copy for the problem, role, actions, and outcome. The card, route, title, and next-project link come from the array. Order the array to control the reading sequence. Keep four to six projects.
- **Thumbnails:** Choose `steps`, `grid`, `index`, `relay`, or `components` for the project's `thumbnail`; an unrecognized value uses the grid illustration. They are decorative, so the card doesn't depend on them to tell its story. If you add meaningful imagery later, include equivalent alt text.

## Change fonts and colors

[`src/styles/tokens.css`](src/styles/tokens.css) holds the four font variables, palette, and spacing tokens. Update color tokens in both the default and dark blocks. The light theme is the default unless the visitor's system prefers dark; an explicit toggle choice takes precedence on later visits. When switching typefaces, change the Fontsource packages and imports in [`src/main.tsx`](src/main.tsx), the font preload links in [`index.html`](index.html), and the CSS variables. The prototype loads Latin builds of only the weights and styles it uses; add subsets if your copy needs more glyph coverage.

## Extension points

- [`src/pages/Work.tsx`](src/pages/Work.tsx): Filter by tags before rendering the cards.
- [`src/data/projects.ts`](src/data/projects.ts): Integrate a CMS or Markdown loader while keeping the project shape.
- [`src/pages/Contact.tsx`](src/pages/Contact.tsx): Add a contact form and submit handler.
- [`src/lib/`](src/lib/): Add custom functions and integrations here.

## Checks

```sh
npx playwright install chromium
npm test
```

Playwright covers project navigation, keyboard access, metadata, theme persistence, WCAG AA text contrast, and 360/768/1440px layouts. Set `CHROME_BIN` to use an existing Chromium executable instead. Set `PORTFOLIO_SCREENSHOTS` to an output directory to save the responsive screenshots.

## Assumptions

- Product design gives the fictional projects a common thread; the site is not tied to that field.
- Work, About, and Contact are the only navigation sections. Writing is optional and was left out. Case studies belong to Work; the last project links back to the first.
- Contact is email plus placeholder links, repeated in the footer. There is no backend, analytics, CMS, or form submission.
