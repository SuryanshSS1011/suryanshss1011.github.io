---
title: "Shift: personalized sustainability with radical transparency about AI's energy cost"
description: "12-hour hackathon build that delivers one tailored climate action per day while disclosing the carbon cost of every inference. GDG Solution Challenge winner."
date: 2026-03-20T12:00:00
tags: ["Engineering", "Hackathon", "Sustainability"]
---

## The premise

65% of people want to live more sustainably. Only 26% follow through. The gap is not motivation, it is tools. Existing apps show guilt dashboards and generic tip lists. They don't tell you what to do *today*, in *your* city, with *your* diet, on *your* commute.

And every AI product quietly ignores its own environmental footprint, which makes the irony complete: using AI to save the planet while burning energy to do it.

Shift addresses both halves.

## The personalization half

Onboards in 90 seconds. Then delivers one AI-personalized sustainability micro-action per day, tailored to:

- Your commute distance
- Your diet pattern
- Your city's live grid carbon intensity
- Current weather

Actions are grounded in EPA and DEFRA emissions data, structured using behavioral science frameworks (Fogg's B=MAP, Tiny Habits), and scored against a curated knowledge base of 190 actions. Users earn points, build streaks, advance through five levels, and track contributions to UN SDGs.

## The transparency half

Unlike every other AI product, Shift shows you what the AI costs:

- Every action card displays the inference carbon cost alongside the savings the action enables.
- A Chrome extension monitors environmental impact of every Gemini prompt in real time.
- A dedicated Eco-LLM dashboard tracks energy (Wh), carbon (gCO2), and water (mL) per query.
- Semantic caching serves similar queries without extra inference, so repeated questions cost zero.

Typical carbon ROI: 10,000 to 1 or higher (the action's impact dwarfs the inference cost). The point isn't that AI is free; it's that the math should be visible.

## Stack

Next.js 14 (App Router, PWA), TypeScript, Tailwind, shadcn/ui, Framer Motion, Tremor. Groq (Llama 3.3-70B) with Gemini fallback via Vercel AI SDK. Supabase (Postgres + pgvector). Upstash Redis (TTL cache) + Upstash Vector (semantic dedup). Climatiq, Electricity Maps, Google Maps Distance Matrix, Open-Meteo. EcoLogits for carbon estimation with a Groq LPU efficiency multiplier. PostHog + Sentry. Resend for email.

## What this could be

At 100,000 daily users completing one action each, the rough math is 12,000 tonnes of CO2 per year removed (about 2,600 cars). The Eco-LLM transparency layer is also a standalone product for enterprise teams navigating AI carbon disclosure under EU AI Act regulations.

## Built for

GDG @ Penn State Solution Challenge, 12 hours, three people: Suryansh Sijwali, Nabeel Ahmed, Neil Barbara. Climate Change Track winner.

## Links

- [useshift.vercel.app](https://useshift.vercel.app)
- [GitHub](https://github.com/SuryanshSS1011/Shift)

Receives occasional maintenance from the team.
