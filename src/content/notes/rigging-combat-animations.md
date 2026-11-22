---
title: How I rig combat animations in Roblox
date: 2026-10-02
summary: Placeholder note: the workflow I use for snappy combat animations, from rig to in-game timing.
tags: Roblox, animation
---

*This is an example note. Replace it with your own write-up.*

Good combat animation is mostly about **timing**, not pose count.

## My workflow

- Block out the key poses first: anticipation, contact, follow-through
- Keep the contact frame short (2–3 frames) so hits feel snappy
- Add animation events in Luau for hit-boxes instead of guessing timings in scripts

```lua
track:GetMarkerReachedSignal("Hit"):Connect(function()
    applyDamage()
end)
```

## What I'd tell my past self

Play the animation *in game* early. Studio previews lie about speed.
