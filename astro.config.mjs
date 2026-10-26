// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://oakwellhotel.com',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  integrations: [sitemap({ filter: (page) => !page.includes('/orders') })],
});
