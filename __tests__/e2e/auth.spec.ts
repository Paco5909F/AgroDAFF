import { test, expect } from '@playwright/test';

test.describe('Authentication and Route Protection', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Attempt to navigate to a protected route
    await page.goto('/dashboard');
    
    // Wait for the redirect to happen
    await page.waitForURL('/login**');
    
    // Verify the URL is correct
    expect(page.url()).toContain('/login');
    
    // Verify the login page is rendered
    await expect(page.locator('h2:has-text("Iniciar Sesión")')).toBeVisible();
  });
});
