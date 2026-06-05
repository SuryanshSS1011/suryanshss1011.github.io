---
title: "Warren: the plan"
description: "What I'm building, why now, and the design lessons it's reverse-engineered from. Notes from the plan rather than a post-mortem. In active development."
date: 2026-06-04T12:00:00
tags: ["Engineering", "In Progress", "Knowledge Tools"]
---

> This is a build-in-progress writeup. I'll rewrite it once Warren ships and I know which of these design bets were right.

## The one sentence

It's the only Wikipedia tool where your own messy 2am rabbit hole becomes a beautiful, titled, shareable map, and someone else can replay and continue your exact journey.

## Why now

Wikipedia's top-of-funnel is softening. The Wikimedia Foundation's own Marshall Miller reported (Oct 2025) that human pageviews are down about 8% year-over-year because of generative AI and social-media-driven discovery. As AI answers replace destination reading, the *joy of exploration* becomes the differentiated reason to visit Wikipedia at all.

Warren sells the experience AI search is killing. The cultural wave (StumbleUpon nostalgia, Cloudhiker, r/InternetIsBeautiful) wants free-form discovery; Warren anchors that wave to Wikipedia's trusted corpus and adds the structure (the map) the StumbleUpon clones lack.

## The competitive gap

Every prior Wikipedia visualization treats the graph as a static art object, not a living record of your journey.

| Product | Got right | Got wrong |
|---|---|---|
| Six Degrees of Wikipedia | Fast pathfinding, autosuggest | No reading, no journey, no share |
| WikiGalaxy / Wikiverse | Stunning visuals | Pre-baked, not personal, reading bolted on |
| Wikitrivia / Speedrun | Engaging mechanics | Games, not exploration |
| Obsidian / Roam graph | Bidirectional link metaphor | Useless past ~200 nodes, "a tangled web that's more fun to look at than navigate" |
| Kumu.io / TheBrain | Spatial navigation, focus + context | Enterprise-heavy, steep |
| Wikiwand | Clean reading, AI layer | Reader skin, no journey |
| Spotify Wrapped | Designed-for-share, identity artifact | Annual only |

Nobody turns *your own* browsing session into an animated, AI-annotated, shareable map that doubles as a reusable knowledge artifact. That is Warren.

## The design bets

**1. The spine principle.** A graph that just accumulates nodes becomes noise (the Obsidian lesson). Warren's answer: the user's actual clicked path is a bright, thick, animated edge. All other links are faint context. Recency, depth, and dwell time are encoded as separate visual channels (brightness, size, ring thickness). The user's narrative is physically distinguished from everything else, so the graph never becomes a hairball.

**2. Reading inside the map.** Clicking a node expands it in place into a floating "burrow" card anchored to the node, layered above the canvas. Lead image, summary extract, blue links as clickable chips. Clicking a chip spawns a new node with a node-birth animation. The map never leaves the screen. This is the hero requirement.

**3. Reverse-engineer from the share card.** Spotify Wrapped (and the *failure* of Wrapped Club) taught that a share feature only works if the shareable artifact is designed before the experience, each frame has built-in bragging rights, and sharing is zero-friction. Warren's share card is designed first; the experience fills it.

**4. Kill the simulation alpha.** Force-settle the graph for 600 to 900ms, then stop the physics simulation. Avoids the "nervous graph" anti-pattern where nodes vibrate forever and the map feels unstable.

## Stack

- **Frontend + API:** Next.js 16 App Router on Vercel. API routes proxy Wikipedia (controls User-Agent, caching), call the LLM, and render OG images.
- **Database:** Supabase (Postgres + Auth). Anonymous-first; "Sign in with Google" to claim/save beyond the free-tier limit.
- **Cache:** Vercel KV/Redis for Wikipedia summaries and AI bridge sentences.
- **AI:** Claude Haiku 4.5 default, Gemini 2.5 Flash one-env-flip fallback. Cost-minimal payload (two article titles + descriptions, never full body text). Every (A → B) pair cached so the same jump is never re-generated.
- **Map:** `react-force-graph-2d`. Canvas-rendered, React-native API. Good for the 10 to 200 nodes a typical session produces; Sigma.js is the documented fallback if I ever need 500+.
- **Share card:** `@vercel/og` (Satori) renders JSX to SVG to PNG at the edge in about a second, CDN-cached.

Defended alternatives are in [the build plan](https://github.com/SuryanshSS1011/Warren/blob/main/docs/BUILD_PLAN.md): Sigma over react-force-graph (no, sessions are too small), Cytoscape.js (heavier to style), Convex over Supabase (only if collaborative warrens become core).

## Performance budget

- First article rendered: under 2.5s LCP
- Map interactive: under 3s TTI
- New node added: under 500ms perceived (optimistic node render before the AI sentence resolves; sentence streams in after)

## Wikimedia etiquette

Non-negotiable, because hammering Wikimedia is how you lose the corpus access this whole thing depends on:

- New global rate limits (2026) are per-user. Respond to 429 with `Retry-After` and exponential backoff.
- Max 3 concurrent requests.
- Mandatory `User-Agent` with contact info: `Warren/0.1 (https://warren.app; team@warren.app)`.
- Never hit Wikimedia from the client. Always go through the proxy.
- Cache aggressively at edge + KV keyed by title.

## What I'll know once it ships

The bets above are bets. The ones I'm least sure about:

- **Does the spine principle actually scale past 200 nodes** for a Wikipedia rabbit hole, or do users hit the hairball wall sooner because Wikipedia's link density is higher than a Roam graph?
- **Will the share card actually get shared**, or will users keep their warrens private the way they keep their Wrapped Club rituals private?
- **Is anonymous-first the right onboarding** for a tool whose value compounds over time, or does the friction of "claim your warrens" lose more users than it converts?

I'll rewrite this post once I have answers.

## Links

- [GitHub: Warren](https://github.com/SuryanshSS1011/Warren) (active development)
- [Build plan](https://github.com/SuryanshSS1011/Warren/blob/main/docs/BUILD_PLAN.md)
- [Story / positioning](https://github.com/SuryanshSS1011/Warren/blob/main/docs/STORY.md)
