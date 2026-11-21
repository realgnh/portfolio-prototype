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

Open the URL printed by Vite. Run `npm install` again whenever you pull changes that touch `package.json`; otherwise Vite reports missing imports such as fonts or logos. For a static deployment, publish `dist/` and rewrite non-file requests to `index.html` to support direct links such as `/projects/clearpath-onboarding`.

## Edit the content

See **[EDITING.md](EDITING.md)** for a table of exactly which file to edit for each part of the site. In short: all text and data lives in `src/content/`, pictures go in `public/images/`, and colours live in `src/styles/tokens.css`.

## Design

Minimal and vibrant: an off-white page, a large Plus Jakarta Sans headline, pastel colours that match each skill area, and one dark call to action. Brand-logo skill bubbles wander slowly with a slight tilt and lean toward the cursor. Includes a game-style loading screen, page and light/dark transitions, an animations on/off switch, Quick search (Ctrl/⌘+K), copy-email toasts, picture and video placeholders, an Experience page with automatic date ranges and durations, and a ticking Cairo clock on Contact. Brand logos come from [simple-icons](https://simpleicons.org) (CC0); the brands remain their owners' trademarks. Ideas on standby are in [IDEAS.md](IDEAS.md).

## Checks

```sh
npx playwright install chromium
npm test
```

Playwright covers navigation and metadata, the hero, skill bubbles, the animations switch, the loading screen, About/Skills/Hobbies/Currently, date ranges and durations, the Experience page, placeholders, the project filter, project pages, Quick search, copy email, the Contact clock, the résumé order and download, theme persistence, WCAG AA contrast (including every pastel tone), and 360/768/1440px layouts. Set `CHROME_BIN` to use an existing Chromium executable instead. Set `PORTFOLIO_SCREENSHOTS` to an output directory to save the responsive screenshots.

## Assumptions

- Home is the personal introduction. `/about` redirects to `/`, and `/experience` to `/#experience`.
- The one-page résumé is a placeholder. Case studies are available under Projects; legacy `/work` links redirect to `/projects`. There is no downloadable copy of the portfolio.
- The look takes cues from a reference the owner supplied (big bold name, pastel chips, floating tool bubbles) without copying its layout or copy.
- Contact puts email first, with placeholder social links below it. There is no backend, analytics, CMS, or form submission.
