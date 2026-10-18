import { defineConfig } from 'astro/config';

// SITE_URL y BASE_PATH los define el workflow de GitHub Pages.
// Con dominio propio, BASE_PATH queda en "/".
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  // Astro 7 pasó a 'jsx', que borra los espacios entre elementos inline.
  // true mantiene el comportamiento anterior (HTML-aware).
  compressHTML: true,
});
