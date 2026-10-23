import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // CI tests the production build; locally keep the fast dev server.
    command: process.env.CI ? 'npm run build && npm run start' : 'npm run dev',
    timeout: 180_000,
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
