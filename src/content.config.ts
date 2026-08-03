import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Card figure schema: mirrors the ProjectFigure union in src/data/site.ts so a
// post can declare, in frontmatter, the figure shown on its blog-list card (the
// visual that earns the click through to the article). Rendered by Figure.astro.
const cardFigure = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('figure'),
    src: z.string(),
    srcDark: z.string().optional(),
    alt: z.string(),
    caption: z.string(),
  }),
  z.object({
    kind: z.literal('artifact'),
    src: z.string(),
    srcDark: z.string().optional(),
    alt: z.string(),
    note: z.string().optional(),
  }),
]);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // Kept for RSS and JSON-LD keywords. Not rendered — until there is a tag
    // index to link to, a comma list of tags in the byline is decoration.
    tags: z.array(z.string()).optional(),
    // Where the work landed. This is the one piece of metadata a reader of a
    // research writeup actually wants next to the date.
    venue: z.string().optional(),
    draft: z.boolean().optional().default(false),
    // When true, the post is pinned to the bottom of the writing list and its
    // date is hidden. Intended for intro / about-this-blog posts that should
    // anchor the list regardless of chronology.
    pinBottom: z.boolean().optional().default(false),
    // Optional figure shown on this post's blog-list card. Any figure type
    // (image or in-code viz). It's the visual hook that earns the click.
    cardFigure: cardFigure.optional(),
  }),
});

export const collections = { blog };
