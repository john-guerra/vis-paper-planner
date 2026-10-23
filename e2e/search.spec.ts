import { expect, test } from '@playwright/test';

// Needs local Supabase with the fixture seeded (npx supabase start && npm run db:seed).
test.describe('keyword search', () => {
  test('typing "treemap" and submitting shows at least one paper with a year', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('searchbox', { name: /search papers/i }).fill('treemap');
    await page.getByRole('button', { name: /search/i }).click();

    await expect(page).toHaveURL(/\?q=treemap$/);
    const results = page.getByRole('list', { name: /results/i }).getByRole('listitem');
    await expect(results.first()).toBeVisible();
    // The meta line reads "<year> · <conference>".
    await expect(results.first().getByText(/^(19|20)\d{2} · /)).toBeVisible();
  });

  test('an empty submit shows the prompt', async ({ page }) => {
    await page.goto('/?q=treemap');
    await page.getByRole('searchbox', { name: /search papers/i }).fill('');
    await page.getByRole('button', { name: /search/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/type a topic/i)).toBeVisible();
  });
});
