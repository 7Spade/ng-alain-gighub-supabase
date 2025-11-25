import { test, expect } from '@playwright/test';

test('debug login', async ({ page }) => {
  // Navigate to login page
  await page.goto('/#/passport/login');
  
  // Wait for page to load
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);
  
  // Take screenshot before login
  await page.screenshot({ path: 'test-results/before-login.png' });
  
  // Try to find the form inputs
  const emailInput = page.locator('input[placeholder="Email"]');
  const passwordInput = page.locator('input[placeholder="Password"]');
  
  console.log('Email input count:', await emailInput.count());
  console.log('Password input count:', await passwordInput.count());
  
  // Fill login form
  await emailInput.fill('ac7x@pm.me');
  await passwordInput.fill('123123');
  
  // Take screenshot after filling
  await page.screenshot({ path: 'test-results/after-fill.png' });
  
  // Submit
  const submitButton = page.locator('button[type="submit"]');
  console.log('Submit button count:', await submitButton.count());
  await submitButton.click();
  
  // Wait and take screenshot
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'test-results/after-submit.png' });
  
  // Check URL
  console.log('Current URL:', page.url());
  
  // Look for any error messages
  const errorAlert = page.locator('nz-alert');
  const errorCount = await errorAlert.count();
  console.log('Error alert count:', errorCount);
  
  if (errorCount > 0) {
    const errorText = await errorAlert.first().textContent();
    console.log('Error text:', errorText);
  }
});
