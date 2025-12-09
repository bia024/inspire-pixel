import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/InspiraPixel/);
  });

  test('should display all main sections', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('[data-testid="hero-section"]');
    const gallery = page.locator('[data-testid="gallery-section"]');
    const footer = page.locator('[data-testid="footer"]');

    await expect(hero).toBeVisible();
    await expect(gallery).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    const navLink = page.locator('[data-testid="header"] nav a').first();
    const href = await navLink.getAttribute('href');
    if (href) {
      await navLink.click();
      await expect(page).toHaveURL(href);
    }
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const header = page.locator('[data-testid="header"]');
    await expect(header).toBeVisible();

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(header).toBeVisible();
  });
});
