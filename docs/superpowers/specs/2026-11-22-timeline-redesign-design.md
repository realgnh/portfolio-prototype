# Timeline redesign — design (agreed in a grilling session, 2026-11-22)

## Intent
Make the portfolio feel hand-made rather than "vibe coded": less crowded, more visual rhythm, playful in the margins, and built around what is distinctive about the owner — a tech-first CS student who is also an experienced Roblox animator and game developer. Content stays placeholder for now.

## Audience
Software / AI internship recruiters and engineers first; the Roblox engineering background is the memorable difference.

## Decisions
- Identity: Abdalla Khedr ("AK."), German International University (GIU).
- Layout "scenes on a timeline": left-aligned hero with the skill bubbles on the right; a thin fixed scroll ruler at the top with a moving playhead and one ◆ keyframe per section (hover shows the section name). No numbers or timecodes anywhere.
- Colour: one bold accent, signal orange #FF5B1F, on off-white paper and near-black ink. Rhythm from alternating paper / solid black sections; Contact is a full-bleed orange section. Dark mode stays (paper → near-black, black bands → charcoal, orange stays).
- Type: Bricolage Grotesque (display), IBM Plex Sans (text), IBM Plex Mono (small labels and tags).
- Pills: almost all removed. Roles as plain text, tags as small uppercase mono text, results as big numbers, filters as underlined tabs. Only main buttons and Quick search stay as pills.
- Remove: ✦ and emoji decoration, gradient blobs, generic copy, the Notes section entirely.
- Navigation: Work · Hobby projects · Experience · Contact; "AK." goes home; Résumé is a button. /projects/* keeps working via redirect to /work/*.
- Home order: Hero → Experience → Selected work (featured Clearpath, two smaller projects, one hobby project) → Skills (compact, kept) → The short version (About + Now line) with a one-line "Currently building…" under it → orange Contact.
- New "Hobby projects" page (Roblox + Luau up front): featured game, other games, "Systems I've built" (Luau engineering), animation reel slot. Replaces the "Outside of class" section. A 3D character comes later.
- Playful details: scene-cut slate flash between pages (page name only), onion-skin ghosting on the name/headings on hover, loader mini-game (Space/tap makes the cube jump over blocks; same look and 2.8 s timing; best score saved), reused as the 404 page game.
- Bubbles and loader keep their exact behaviour; colours move to the palette: neutral off-white bubbles with brand logos, orange/black sparks, orange bar segments.
- Footer: plain and tidy (name, email, socials, ©). No credits concept.
- Voice: plain and credible where recruiters read; light technical jokes only in the margins (loading tips, 404, empty states, chat greeting). Easter egg says "Hey! You found the secret." (no emoji).
- Kept and restyled: Quick search, Ask my portfolio, Experience timeline, easter egg, shortcuts, GitHub section on Contact, Clearpath demo.

## Non-goals
Live cursors, guestbook, live Roblox stats, paid services, the 3D character (later), real content.

## Working rules
Commit after every step; sub-agents take mechanical edits; tests stay green; commits authored by realgnh with the GitHub noreply address.
