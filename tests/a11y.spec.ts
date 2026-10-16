import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { crawlSite } from './helpers';

// WCAG 2.2 AA en todas las páginas, en modo claro y oscuro.
for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`accesibilidad (${colorScheme})`, () => {
    test.use({ colorScheme });
    test(`todas las páginas cumplen WCAG 2.2 AA en modo ${colorScheme}`, async ({ page, request }) => {
      test.setTimeout(180_000);
      const pages = await crawlSite(request);
      const problems: string[] = [];
      for (const path of pages) {
        await page.goto(path);
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();
        for (const v of violations) problems.push(`${path}: ${v.id} (${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')})`);
      }
      expect(problems, problems.join('\n')).toEqual([]);
    });
  });
}
