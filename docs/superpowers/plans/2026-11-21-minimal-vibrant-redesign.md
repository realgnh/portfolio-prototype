# Minimal, Vibrant Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the field-notes design with a minimal, vibrant portfolio whose content is edited in one folder.

**Architecture:** Content moves to `src/content/*` (typed data only). UI is split into `components/ui` (primitives), `components/layout` (header, footer, command menu, toast), `components/sections` (home sections), and `pages`. CSS is split per area under `src/styles/`.

**Tech Stack:** Vite 7, React 19, TypeScript 5.9, React Router 7, plain CSS, `@fontsource/plus-jakarta-sans`, `simple-icons` (named imports only), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-21-minimal-vibrant-redesign-design.md`

## Global Constraints
- Name stays "Alex Morgan"; all identity text is placeholder.
- "Experiments" → "Projects" in every label, title and test.
- Hero status chip: no pulsing dot.
- Primary CTA "Get in touch" → `/contact`; secondary "Download résumé" → `/resume.pdf` with `download`.
- Skill bubbles show brand logos; hover/focus reveals the tool name; SQL uses a generic database glyph.
- Local time on Contact uses `Africa/Cairo`.
- Text contrast ≥ 4.5:1 in light and dark themes; no horizontal scroll at 360/768/1440px.
- Commits authored by `realgnh`, no Claude trailers; fast-forward `main` at the end.

## Review Focus
- Project or company with no image → placeholder tile renders with the item's name, not a broken image (test in Task 2).
- Reduced motion → bubbles do not drift or follow the cursor (test in Task 3).
- ⌘K on Windows is Ctrl+K; Escape closes the menu and returns focus (test in Task 4).
- Clipboard blocked → toast says how to copy instead of claiming success (handled in Task 4, existing copy test adjusted).
- A skill listed in content with no matching logo → bubble falls back to its initials (test in Task 3).

---

### Task 1: Content layer
**Files:** Create `src/content/{profile,skills,experience,projects,navigation}.ts`; delete `src/data/*`.
**Produces:** `profile` (name, initials, status, roles: {label, area}[], intro, email, timeZone: 'Africa/Cairo', socials, resume {href, label}), `skillAreas: Record<Area,{label, tone}>`, `skills: {name, area, icon?: SimpleIcon | 'database'}[]`, `experience: {company, role, period, location?, summary, logo?: string}[]`, `projects` (existing shape + `area`, `image?: string`, `imageAlt?`), `navItems`.
- [ ] Move data, rename copy, add `image`/`logo` fields (unset) and areas.
- [ ] `npx tsc --noEmit` passes once pages are updated (Task 2–5).

### Task 2: UI primitives and layout
**Files:** `components/ui/{Button,Chip,ImageSlot,SectionHeading,Metadata}.tsx`, `components/layout/{Layout,Header,Footer,ThemeToggle}.tsx`, `styles/{tokens,base,ui,layout}.css`.
**Produces:** `<ImageSlot src? alt label ratio tone />` renders `<img>` when `src` is set, else a pastel tile with `label`. `<Chip tone>`; `<Button to|href variant="primary"|"outline">`.
- [ ] Test: project card without `image` shows a placeholder containing "Add screenshot".

### Task 3: Home
**Files:** `components/sections/{Hero,SkillBubbles,ExperienceStrip,ProjectGrid,CurrentlyList,ContactBand}.tsx`, `styles/home.css`, `pages/Home.tsx`.
- [ ] Tests: hero CTA hrefs; each bubble's accessible name equals the skill name and a tooltip shows on focus; bubbles have no animation under reduced motion; experience strip lists every company.

### Task 4: Command menu and toast
**Files:** `components/layout/{CommandMenu,Toast}.tsx`, `lib/useCopyEmail.ts`.
- [ ] Tests: Ctrl+K opens a dialog, typing a project title and Enter navigates to it, Escape closes it; "Copy email" shows toast "Email copied".

### Task 5: Inner pages
**Files:** `pages/{Projects,ProjectDetail,Resume,Contact,NotFound}.tsx`, `styles/pages.css`.
- [ ] Tests: filter by area keeps `?area=` in the URL; project detail shows metrics, FAQ, prev/next; résumé shows company logos (placeholders) and PDF download; Contact shows the Cairo local time label.

### Task 6: Docs, full checks, ship
- [ ] Write `EDITING.md`, update README.
- [ ] `npm run build` and `npm test` pass; screenshots reviewed at 1280 and 390.
- [ ] Commit as realgnh, push branch, fast-forward `main`.
