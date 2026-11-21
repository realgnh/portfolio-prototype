# Minimal, vibrant redesign — design

## Intent
The field-notes redesign felt messy and cluttered. The owner wants a minimalist but vibrant portfolio in the spirit of a white page with a huge bold name, pastel pill chips, floating tool bubbles and one dark call-to-action — not a copy of the reference. It must be easy to edit later: the owner should always know which file to open.

## Goals
- White page, near-black type, a huge bold geometric sans name; colour from pastels plus one electric-blue accent.
- Pastel colours carry meaning: one per skill area (AI/ML lilac, backend mint, frontend peach, tools sky, languages butter), reused on chips, bubbles and project tags.
- Hero: status chip ("Open to internships · Summer 20XX", no pulsing dot), "I'm Alex Morgan", three role chips, one-line intro, **Get in touch** (black, goes to /contact) and **Download résumé** (outline, downloads the PDF).
- Floating skill bubbles around the hero using **brand logos**; hovering or focusing one shows the language/tool name. Drift slowly; shift slightly with the cursor; still with reduced motion.
- Rename Experiments → **Projects** everywhere.
- Picture placeholders for every company (logo) and project (screenshot), replaced by dropping an image in `public/images/…` and adding its file name to the data.
- Experience shown as a single, one-tone logo strip plus a short list; colour on hover.
- Features: ⌘K quick menu (pages, projects, copy email), copy-email toast, local time on Contact in **Africa/Cairo**, dark mode toggle kept.
- Organised architecture: all editable text in `src/content/`, reusable UI in `src/components/ui/`, layout in `src/components/layout/`, page sections in `src/components/sections/`, pages in `src/pages/`, and `EDITING.md` mapping "change X → edit Y".

## Non-goals / anti-goals
- No 1:1 copy of the reference (no greeting copy, no googly eyes, different layout details).
- No clutter: no grid paper, dashed rules, mono labels, Fig. A chart or lab log.
- No backend, CMS or analytics. Placeholder identity stays (Alex Morgan).

## Constraints
Vite + React + TypeScript + React Router + plain CSS (existing stack). Tests in Playwright. Commits authored by the owner only; push and fast-forward to `main` when done.

## Approaches
1. **Rebuild on the current Vite/React app (chosen).** Keeps routing, tests and deployment; only content shape, components and CSS change.
2. Move to Next.js or a site builder (Framer). Rejected: new tooling to learn and host for no gain on a static site.
3. Restyle the field-notes components in place. Rejected: the owner wants a cleaner structure, and the old components encode the notebook concepts.

## Calls left to the builder
Exact pastel values, font (Plus Jakarta Sans), logo source (`simple-icons`, CC0 paths; a generic database glyph for SQL, which has no brand), page section order details, test coverage.
