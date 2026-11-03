import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// On GitHub Pages the site lives at https://<user>.github.io/<repo>/, so the
// deploy workflow sets BASE_PATH to "/<repo>/". Locally it is just "/".
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  define: {
    // Use public/images/hero-lake.jpg as the hero background if someone adds it.
    __HERO_PHOTO__: JSON.stringify(fs.existsSync('public/images/hero-lake.jpg')),
  },
  server: { port: 5310, strictPort: false },
  preview: { port: 5311, strictPort: false },
});
