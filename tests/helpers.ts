import type { APIRequestContext } from '@playwright/test';

export const LANGS = ['en', 'es', 'pt'] as const;

/** Recorre el sitio desde la portada de cada idioma y devuelve todas las páginas internas. */
export async function crawlSite(request: APIRequestContext) {
  const pages = new Set<string>();
  const queue = LANGS.map((l) => `/${l}/`);
  while (queue.length) {
    const path = queue.shift()!;
    if (pages.has(path)) continue;
    pages.add(path);
    const html = await (await request.get(path)).text();
    for (const [, href] of html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) {
      const clean = href.endsWith('/') ? href : `${href}/`;
      if (!clean.startsWith('/_astro/') && !pages.has(clean) && !queue.includes(clean)) queue.push(clean);
    }
  }
  return [...pages].sort();
}
