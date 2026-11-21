# Ideas

## On standby (agreed, build once real projects are added)

- **Live demo and GitHub buttons on each project.** The data field is already reserved: `links: { demo, github }` in `src/content/projects.ts`. Nothing renders it yet. When ready, show two buttons under the project title on `src/pages/ProjectDetail.tsx` and small icons on `src/components/sections/ProjectCard.tsx`.

## Suggestions in the spirit of Quick search (Ctrl/⌘+K)

- **Keyboard shortcuts + a `?` cheat sheet.** `G` then `P` → Projects, `G` then `E` → Experience, `T` → toggle theme, `?` opens an overlay listing them all.
- **Hidden Roblox easter egg.** Typing the Konami code (↑↑↓↓←→←→BA) drops a little animated R6-style character that waves, or switches the loading block into a Roblox brick.
- **"Copy link" on every section heading.** Hovering a heading shows a 🔗 that copies a direct link (e.g. `/#skills`) with a toast.
- **Quick search learns more commands.** "Email Alex about an internship" (opens a pre-filled email), "Open GitHub", "Show me AI projects" (opens Projects filtered to AI).
- **Reading-progress ring on project pages.** A small circle in the header fills as you scroll a case study, with an estimated reading time.
- **Spotlight cursor on project cards.** A soft pastel glow follows the cursor inside each card.
- **Visitor time greeting.** "Good evening 👋" based on the visitor's own clock, next to your Cairo time on Contact ("it's 3 hours later for me").
- **Résumé print view.** `/resume` prints as a clean one-page PDF with Ctrl+P, so the PDF never drifts out of date.
- **Sound toggle.** Very quiet UI clicks and a level-up chime when the loading bar finishes, off by default.
- **Project "changelog" timeline.** Each project page shows dated milestones (v0.1 prototype → user test → launch).

## Content tips

- Lead with three to five real projects with different kinds of evidence. When there is no number, describe the observed outcome and how you checked it.
- Keep the About statement to one line you'd actually say out loud.
- Update "Now learning" and "Currently working on…" every few weeks; it's the cheapest way to make the site feel alive.
