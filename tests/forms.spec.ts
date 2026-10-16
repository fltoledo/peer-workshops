import { expect, test } from '@playwright/test';

// Los envíos a Web3Forms y a Kit se simulan: las pruebas nunca mandan mails ni suscriben a nadie.

test('contacto: los campos de empresa aparecen solo para in-company', async ({ page }) => {
  await page.goto('/es/contact/');
  const company = page.getByLabel(/^Empresa/);
  await expect(company).toBeHidden();
  await page.getByLabel('Motivo').selectOption('in-company');
  await expect(company).toBeVisible();
  await expect(company).toHaveAttribute('required', '');
});

test('contacto: el enlace "Lo quiero en mi empresa" preselecciona el motivo', async ({ page }) => {
  await page.goto('/es/in-company/');
  await page.getByRole('link', { name: 'Lo quiero en mi empresa' }).first().click();
  await expect(page.getByLabel('Motivo')).toHaveValue('in-company');
});

test('contacto: un envío exitoso muestra el agradecimiento', async ({ page }) => {
  await page.route('https://api.web3forms.com/submit', (route) => route.fulfill({ json: { success: true } }));
  await page.goto('/en/contact/');
  await page.getByLabel(/^Name/).fill('Test');
  await page.getByLabel(/^Email/).fill('test@example.com');
  await page.getByLabel(/^Message/).fill('Hello');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Thank you!' })).toBeVisible();
});

for (const [kit, expected] of [
  [{ status: 'success' }, /Listo/],
  [{ status: 'failed' }, /No pudimos suscribirte/],
] as const) {
  test(`newsletter: Kit responde "${kit.status}"`, async ({ page }) => {
    await page.route('https://app.kit.com/forms/**', (route) => route.fulfill({ json: kit }));
    await page.goto('/es/');
    const form = page.locator('.newsletter-inline form');
    await form.getByLabel('Tu email').fill('test@example.com');
    await form.getByRole('button').click();
    await expect(form.getByRole('status')).toHaveText(expected);
  });
}
