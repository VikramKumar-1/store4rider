import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to navigate to the login page', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');

    // 2. Click on the user icon/login link (Assuming there's a link to /login in MainNav)
    // For now, we navigate directly
    await page.goto('/login');

    // 3. Verify we are on the login page
    await expect(page.locator('h2')).toContainText('Sign in to your account');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    
    // Zod validation should kick in
    await expect(page.locator('text=Email is required').first()).toBeVisible();
  });
});
