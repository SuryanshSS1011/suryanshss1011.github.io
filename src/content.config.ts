import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
    // When true, the post is pinned to the bottom of the writing list and its
    // date is hidden. Intended for intro / about-this-blog posts that should
    // anchor the list regardless of chronology.
    pinBottom: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
