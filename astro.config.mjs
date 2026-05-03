import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://suryanshss1011.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'rose-pine-dawn',
        dark: 'rose-pine-moon'
      },
      wrap: true
    }
  }
});
