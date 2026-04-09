import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export async function GET(context: any) {
  const posts = await getCollection('blog');
  return rss({
    title: site.name,
    description: site.description,
    site: context.site,
    items: posts
      .filter(post => !post.data.draft)
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${post.id}/`,
      })),
  });
}
