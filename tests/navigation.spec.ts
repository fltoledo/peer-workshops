import { expect, test } from '@playwright/test';

test.describe('idioma', () => {
  test.use({ locale: 'pt-BR' });
  test('la raíz redirige al idioma del navegador', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  });
});

test('el selector de idioma mantiene la página', async ({ page, isMobile }) => {
  await page.goto('/es/format/');
  if (isMobile) await page.getByRole('button', { name: 'Menú' }).click();
  await page.getByRole('list', { name: 'Idioma' }).getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/format\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A workshop among peers');
});

test('la miga de pan de una edición vuelve a la lista de ediciones', async ({ page }) => {
  await page.goto('/es/editions/tapia-01/');
  const crumbs = page.getByRole('navigation', { name: 'Ruta de navegación' });
  await expect(crumbs.getByText('TAPIA #01')).toHaveAttribute('aria-current', 'page');
  await crumbs.getByRole('link', { name: 'Ediciones' }).click();
  await expect(page).toHaveURL(/\/es\/editions\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Todas las ediciones');
});

test('el menú se abre y se cierra con teclado en celular', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo en celular');
  await page.goto('/es/');
  const toggle = page.getByRole('button', { name: 'Menú' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Menú' }).getByRole('link', { name: 'Para empresas' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('el home muestra impacto, temáticas propias y ediciones', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experiencias reales, discutidas entre pares.');
  // El WOPR original no se muestra entre las temáticas del home
  const themes = page.locator('.series-card .acronym');
  await expect(themes).toHaveText(['WOPR', 'TAPIA', '¿Próxima?']);
  await expect(page.getByText('ediciones realizadas')).toBeVisible();
  await expect(page.getByRole('link', { name: /TAPIA #01/ })).toBeVisible();
});

test('cada edición realizada tiene foto de fondo y su galería carga', async ({ page }) => {
  await page.goto('/en/editions/wopr-latam-04/');
  const cover = page.locator('.hero-bg');
  await expect(cover).toBeVisible();
  expect(await cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  for (const img of await page.locator('.gallery img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
    await expect(img).toHaveAttribute('alt', /.+/);
  }
});
