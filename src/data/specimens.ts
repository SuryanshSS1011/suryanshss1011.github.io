/**
 * Margin specimens: a curated set of botanical (and eventually other natural-
 * history) specimens that render in the left margin of wide-viewport pages as
 * a naturalist's-notebook flourish.
 *
 * One specimen is shown per page, picked deterministically from the route's
 * pathname so a given page consistently shows the same specimen across visits
 * (no flicker on hard refresh) while different pages show different specimens.
 *
 * Adding a specimen:
 *  1. Drop a transparent-background PNG in /public/specimens/<slug>.png.
 *     Vertical orientation, ~600-1200px wide, transparent bg required so it
 *     composites cleanly into both warm-paper and warm-dark themes.
 *  2. Add one entry below.
 *
 * House style: every specimen must have a real binomial (genus species) and a
 * common name. No invented or whimsical labels — the "this person catalogs
 * accurately" signal is part of what makes the system land.
 */

export type Specimen = {
  // Filename slug; image lives at /specimens/<slug>.png
  slug: string;
  // Latin binomial, rendered italic
  binomial: string;
  // Common name, rendered smaller below
  common: string;
};

export const specimens: Specimen[] = [
  { slug: "sweet-pea", binomial: "Lathyrus odoratus", common: "sweet pea" }
];

/**
 * Deterministic per-route specimen pick.
 *
 * Hashing the pathname keeps the choice stable for a given route (so users
 * don't see a different flower on every refresh of the same page) while still
 * varying it across routes (so navigating around the site reveals new ones).
 */
export function specimenForPath(pathname: string): Specimen | null {
  if (specimens.length === 0) return null;
  const normalized = pathname.replace(/\/+$/, '') || '/';
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % specimens.length;
  return specimens[idx];
}
