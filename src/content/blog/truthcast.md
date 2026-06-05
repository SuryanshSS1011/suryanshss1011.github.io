---
title: "TruthCast: multi-agent fact-checking with on-chain provenance"
description: "A fact-checking pipeline that decomposes claims, weights evidence by source credibility, debates ambiguous cases, and writes verdicts to a Solana ledger. HackPSU Spring 2026, Solana track winner."
date: 2026-04-15T12:00:00
tags: ["Engineering", "Hackathon", "Multi-agent", "Solana"]
---

## What it does

TruthCast is a fully autonomous fact-checking pipeline that does more than return true-or-false. A claim goes through five stages:

1. **Ingest.** Accept text or a URL, decompose into atomic sub-claims using the HiSS method.
2. **Research.** Retrieve evidence via Gemini 2.0 Flash with `google_search` grounding.
3. **Score credibility.** Use the MBFC dataset (about 4,000 expert-rated domains) so contradictory but low-credibility evidence is down-weighted, not just counted.
4. **Debate (sometimes).** If inter-agent agreement falls below 80%, an adversarial pro/con debate fires before the verdict.
5. **Publish.** Emit one of seven verdicts (TRUE, MOSTLY_TRUE, MISLEADING, MOSTLY_FALSE, FALSE, CONFLICTING, UNVERIFIABLE), write it to a Solana memo on devnet so the result is permanent and tamper-evident, and generate a voice summary via ElevenLabs TTS.

The frontend streams pipeline progress in real time over SSE so the user watches the reasoning happen.

## Why the design choices

**Seven verdicts, not boolean.** The boolean fact-check is what makes most fact-checkers feel adversarial. "Half true" is a real category of claim. CONFLICTING and UNVERIFIABLE are honest states; they are not the same as MOSTLY_FALSE.

**Source credibility instead of vote count.** Three low-credibility sources that agree shouldn't outweigh one high-credibility source that disagrees. MBFC's per-domain ratings are the cheapest weight to apply that gets the directional answer right most of the time.

**Debate gates on agreement, not always.** Debating every claim is expensive and slow. Debating only when the researchers disagree (under 80% agreement) is where the marginal cost buys real information.

**Solana memo, not a custom contract.** The point is provenance, not on-chain logic. Writing a memo to devnet costs nothing, is permanent, and is enough.

## Stack

Next.js 14, TypeScript, Gemini 2.0 Flash, Solana (devnet), ElevenLabs TTS, Turso/SQLite, MBFC dataset, Sentry.

## Recognition

HackPSU Spring 2026, Solana track winner.

## Links

- [Live demo](https://truth-cast-web.vercel.app)
- [GitHub](https://github.com/SuryanshSS1011/TruthCast)

Built in a weekend. Not actively maintained, but the live demo still runs against devnet.
