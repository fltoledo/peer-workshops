import { expect, test } from '@playwright/test';
import { crawlSite } from './helpers';

test('todas las páginas, enlaces internos e imágenes responden', async ({ request }) => {
  const pages = await crawlSite(request);
  // 3 idiomas × (portada, ediciones, formato, participar, host, sobre mí, para empresas, contacto + ediciones y temáticas)
  expect(pages.length).toBeGreaterThan(40);

  const broken: string[] = [];
  const checked = new Set<string>();
  for (const page of pages) {
    const res = await request.get(page);
    if (res.status() !== 200) broken.push(`${page} → ${res.status()}`);
    const html = await res.text();
    const assets = [...html.matchAll(/(?:src|href)="(\/[^"]+\.(?:css|js|avif|webp|jpe?g|png|svg))"/g)].map((m) => m[1]);
    const srcsets = [...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0]));
    for (const asset of [...assets, ...srcsets]) {
      if (checked.has(asset)) continue;
      checked.add(asset);
      const a = await request.get(asset);
      if (a.status() !== 200) broken.push(`${page}: ${asset} → ${a.status()}`);
    }
  }
  expect(broken, broken.join('\n')).toEqual([]);
});
