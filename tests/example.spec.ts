import { test, expect } from '@playwright/test';

test('escape room page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check for main heading
  await expect(page.getByRole('heading', { name: /Code Escape Room/ })).toBeVisible();
});

test('stage 1 title visible', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check stage 1 title
  await expect(page.getByRole('heading', { name: /Simple Addition/ })).toBeVisible();
});

test('textarea exists and can type code', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Find textarea and type code
  const textarea = page.locator('textarea').first();
  await textarea.fill('function add(a, b) { return a + b; }');

  // Check code was entered
  await expect(textarea).toHaveValue('function add(a, b) { return a + b; }');
});

test('can click check button', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Type code
  const textarea = page.locator('textarea').first();
  await textarea.fill('function add(a, b) { return a + b; }');

  // Click button
  const checkButton = page.locator('button:has-text("Run and Check")').first();
  await checkButton.click();

  // Wait for feedback
  await page.waitForTimeout(1000);
});

test('timer displays', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Look for time format (minutes:seconds)
  const timer = page.locator('text=/\\d+:\\d+/').first();
  await expect(timer).toBeVisible();
});

test('door status section visible', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check door status heading
  await expect(page.getByRole('heading', { name: /Door Status/ })).toBeVisible();
});

test('progress bar visible', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check progress heading
  await expect(page.getByRole('heading', { name: /Progress/ })).toBeVisible();
});

test('can navigate to next stage', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Click Next button
  const nextButton = page.locator('button:has-text("Next")').first();
  await nextButton.click();

  // Wait and check stage 2 appears
  await page.waitForTimeout(500);
  await expect(page.getByRole('heading', { name: /Sort an Array/ })).toBeVisible();
});