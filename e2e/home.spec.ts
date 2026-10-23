import { test, expect } from '@playwright/test';

test('home page loads and has the app title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/VisPaperPlanner/);
});
