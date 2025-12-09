import { test, expect } from '@playwright/test';

test.describe('Header Component', () => {
  test('should display the header', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('[data-testid="header"]');
    await expect(header).toBeVisible();
  });

  test('should have a logo', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('[data-testid="header"] [data-testid="logo"]');
    await expect(logo).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('[data-testid="header"] nav a');
    await expect(navLinks.first()).toBeVisible();
  });

  test('should toggle mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const menuToggle = page.locator('[data-testid="header"] [data-testid="menu-toggle"]');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      const mobileMenu = page.locator('[data-testid="header"] [data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
    }
  });
});
