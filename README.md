# Portfolio prototype

A personal portfolio prototype for a computer science student, built with Vite, React, TypeScript, React Router, and plain CSS. The identity, portrait, school, skills, social and Roblox links, résumé, five projects, and metrics are placeholders. See [IDEAS.md](IDEAS.md) for directions to try when you replace them.

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

- **Profile:** Edit [`src/data/site.ts`](src/data/site.ts) for the name, role, hero copy, biography, school, skill stack, email, X, LinkedIn, GitHub, navigation labels, and page metadata. Replace the two game links in `site.about.roblox.games` with published Roblox experience URLs when ready. Update [`Portrait.tsx`](src/components/Portrait.tsx) with your own photo and meaningful alt text.
- **Résumé:** Replace [`public/resume.pdf`](public/resume.pdf) with your own PDF. If you rename it, update `site.resume.download.href`.
- **Projects:** Add or replace one object in [`src/data/projects.ts`](src/data/projects.ts). Use a unique URL-friendly `slug`, an outcome-first `summary`, two or three `metrics` (each with a `value` and `label`), `caseStudy` copy for the problem, role, actions, and outcome, and a `faq` array of question/answer pairs. The work index, route, metadata, and next-project link come from the array. Order the array to control the reading sequence.
- **Thumbnails:** Choose `steps`, `grid`, `index`, `relay`, or `components` for the project's `thumbnail`; an unrecognized value uses the grid illustration. They are decorative, so the card doesn't depend on them to tell its story. If you add meaningful imagery later, include equivalent alt text.

## Change fonts and colors

[`src/styles/tokens.css`](src/styles/tokens.css) holds the four font variables, palette, and spacing tokens. Update color tokens in both the default and dark blocks. The light theme is the default unless the visitor's system prefers dark; an explicit toggle choice takes precedence on later visits. When switching typefaces, change the Fontsource packages and imports in [`src/main.tsx`](src/main.tsx), the font preload links in [`index.html`](index.html), and the CSS variables. The prototype loads Latin builds of only the weights and styles it uses; add subsets if your copy needs more glyph coverage.

## Motion

The theme toggle covers the viewport with 25 staggered bands in the destination color before applying the palette. Navigation updates immediately while the new content fades in and the active pill slides into place. When the system prefers reduced motion, the theme, route, and card reveals use brief fades, the toggle icons do not spin, and the pill and control feedback are shorter and subtler.

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

Playwright covers navigation, keyboard access, metadata, FAQs, the résumé download, theme persistence and transitions, WCAG AA text contrast, and 360/768/1440px layouts. Set `CHROME_BIN` to use an existing Chromium executable instead. Set `PORTFOLIO_SCREENSHOTS` to an output directory to save the responsive screenshots.

## Assumptions

- Home is the personal introduction and now contains About. The old `/about` URL redirects to `/#about`. Roblox development is presented as a side interest rather than as part of the main Work index.
- The one-page résumé is a placeholder. Case studies are available online under Work; there is no downloadable copy of the portfolio.
- The framed profile and greyscale palette take cues from Perry Wang; the oversized headline takes a cue from Daniel Sun. The layout, artwork, and copy are original.
- Contact is email plus placeholder links, repeated in the footer. There is no backend, analytics, CMS, or form submission.
