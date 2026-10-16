import { defineConfig, devices } from '@playwright/test';

// Las pruebas corren contra el sitio ya compilado (npm run build), servido en local.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:4322',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /navigation|forms/ },
  ],
  webServer: {
    command: 'npx astro preview --port 4322',
    url: 'http://localhost:4322/en/',
    reuseExistingServer: !process.env.CI,
  },
});
