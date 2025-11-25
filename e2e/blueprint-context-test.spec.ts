import { test, expect } from '@playwright/test';

test.describe('Blueprint with Workspace Context', () => {
  test('should login and navigate to blueprint list', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:4200/#/passport/login');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot before login
    await page.screenshot({ path: 'test-results/01-login-page.png' });
    
    // Fill login form
    const emailInput = page.locator('input[placeholder="Email"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    
    await emailInput.fill('ac7x@pm.me');
    await passwordInput.fill('123123');
    
    // Take screenshot after filling form
    await page.screenshot({ path: 'test-results/02-login-filled.png' });
    
    // Submit login
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'test-results/03-after-login.png' });
    
    // Check if logged in successfully
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // Check for any error messages
    const errorAlert = page.locator('nz-alert');
    const errorCount = await errorAlert.count();
    if (errorCount > 0) {
      const errorText = await errorAlert.first().textContent();
      console.log('Error text:', errorText);
    }
    
    // If login successful, navigate to blueprint list
    if (!currentUrl.includes('passport')) {
      await page.goto('http://localhost:4200/#/blueprint/list');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'test-results/04-blueprint-list.png' });
      
      // Check if context info is displayed
      const contextInfo = page.locator('nz-alert');
      if (await contextInfo.count() > 0) {
        const contextText = await contextInfo.first().textContent();
        console.log('Context info:', contextText);
      }
      
      // Check if create button is visible
      const createButton = page.locator('button:has-text("新增藍圖")');
      const createButtonVisible = await createButton.isVisible();
      console.log('Create button visible:', createButtonVisible);
      
      if (!createButtonVisible) {
        // Check for empty state
        const emptyState = page.locator('nz-empty');
        if (await emptyState.count() > 0) {
          const emptyText = await emptyState.textContent();
          console.log('Empty state text:', emptyText);
        }
      }
    }
  });
});
