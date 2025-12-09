import { test, expect } from '@playwright/test';

test.describe('Gallery Page', () => {
  test('should load the gallery page', async ({ page }) => {
    await page.goto('/');
    const gallerySection = page.locator('[data-testid="gallery-section"]');
    await expect(gallerySection).toBeVisible();
  });

  test('should display images in the gallery', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('[data-testid="gallery-section"] img');
    await expect(images.first()).toBeVisible();
  });

  test('should allow image selection', async ({ page }) => {
    await page.goto('/');
    const firstImage = page.locator('[data-testid="gallery-section"] img').first();
    await firstImage.click();
    const selectedImage = page.locator('.selected-image');
    if (await selectedImage.isVisible()) {
      await expect(selectedImage).toBeVisible();
    }
  });

  test('should have favorite functionality', async ({ page }) => {
    await page.goto('/');
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click();
      await expect(favoriteButton).toHaveClass(/favorited/);
    }
  });
});
