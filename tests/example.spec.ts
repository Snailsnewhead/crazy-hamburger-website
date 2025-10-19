import { test, expect } from '@playwright/test';

test('escape room page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check for main heading "Code Escape Room"
  await expect(page.locator('h1:has-text("Code Escape Room")')).toBeVisible();
});

test('stage 1 title visible', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check stage 1 title contains "Addition"
  await expect(page.locator('h2:has-text("Addition")')).toBeVisible();
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

  // Click button with text "Run and Check"
  const checkButton = page.locator('button:has-text("Run and Check")').first();
  await checkButton.click();

  // Wait for feedback to appear
  await page.waitForTimeout(1000);
  
  // Check for CORRECT feedback
  await expect(page.locator('text=CORRECT').first()).toBeVisible();
});

test('timer displays', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Look for time format (10:00)
  await expect(page.locator('text=/\\d+:\\d+/')).toBeVisible();
});

test('door status section visible', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check for "Door Status" text
  await expect(page.locator('text=Door Status')).toBeVisible();
});

test('progress bar visible', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Check for "Progress" text
  await expect(page.locator('text=Progress')).toBeVisible();
});

test('can navigate to next stage', async ({ page }) => {
  await page.goto('http://localhost:3000/escape-room');

  // Click Next button
  const nextButton = page.locator('button:has-text("Next")').first();
  await nextButton.click();

  // Wait for stage to change
  await page.waitForTimeout(500);
  
  // Check stage 2 appears (Prime Numbers)
  await expect(page.locator('h2:has-text("Prime")')).toBeVisible();
});