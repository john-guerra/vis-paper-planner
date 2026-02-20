import { test, expect } from '@playwright/test';

test('home page loads and has the main heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/VisPaperPlanner/);
});
