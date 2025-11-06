import { test, expect } from '@playwright/test';

test.describe('Crappy Cloud Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle('Crappy Cloud - Tech Buzzword Visualizer');
  });

  test('should have the cloud template image', async ({ page }) => {
    const cloudTemplate = page.locator('img.shit');
    await expect(cloudTemplate).toBeAttached();
    await expect(cloudTemplate).toHaveAttribute('src', 'crappy_cloud_1.png');
  });

  test('should spawn cloud elements', async ({ page }) => {
    // Wait a bit for clouds to spawn
    await page.waitForTimeout(1000);

    // Count visible cloud images (excluding template)
    const visibleClouds = await page.locator('img.shit[style*="display: block"]').count();
    expect(visibleClouds).toBeGreaterThan(0);
  });

  test('should spawn buzzword elements', async ({ page }) => {
    // Wait a bit for buzzwords to spawn
    await page.waitForTimeout(1000);

    // Check for h1 elements
    const buzzwords = await page.locator('h1').count();
    expect(buzzwords).toBeGreaterThan(0);
  });

  test('should use expected buzzwords', async ({ page }) => {
    await page.waitForTimeout(2000);

    const expectedBuzzwords = [
      'cloud',
      'multicore',
      'maszyn lerning',
      'sieci neuronowe',
      'agile',
      'mobile',
      'Byg Data'
    ];

    const buzzwordElements = await page.locator('h1').all();
    const actualBuzzwords = [];

    for (const element of buzzwordElements) {
      const text = await element.textContent();
      actualBuzzwords.push(text);
    }

    // At least one buzzword should be from our list
    const hasExpectedBuzzword = actualBuzzwords.some(word =>
      expectedBuzzwords.includes(word)
    );
    expect(hasExpectedBuzzword).toBe(true);
  });

  test('should have gradient background', async ({ page }) => {
    const bodyStyle = await page.locator('body').evaluate(el =>
      window.getComputedStyle(el).background
    );

    expect(bodyStyle).toContain('linear-gradient');
  });

  test('clouds should have animations', async ({ page }) => {
    await page.waitForTimeout(1000);

    const firstCloud = page.locator('img.shit[style*="display: block"]').first();
    const animationName = await firstCloud.evaluate(el =>
      window.getComputedStyle(el).animationName
    );

    expect(['left', 'right']).toContain(animationName);
  });

  test('buzzwords should have buzz animations', async ({ page }) => {
    await page.waitForTimeout(1000);

    const firstBuzzword = page.locator('h1').first();
    const animationName = await firstBuzzword.evaluate(el =>
      window.getComputedStyle(el).animationName
    );

    expect(['buzz0', 'buzz1', 'buzz2', 'buzz3', 'buzz4']).toContain(animationName);
  });

  test('should expose animators on window for debugging', async ({ page }) => {
    const hasCloudAnimator = await page.evaluate(() => 'cloudAnimator' in window);
    const hasBuzzwordAnimator = await page.evaluate(() => 'buzzwordAnimator' in window);

    expect(hasCloudAnimator).toBe(true);
    expect(hasBuzzwordAnimator).toBe(true);
  });

  test('elements should have random properties', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Get multiple clouds and check they have different properties
    const clouds = await page.locator('img.shit[style*="display: block"]').all();

    if (clouds.length >= 2) {
      const cloud1Style = await clouds[0].getAttribute('style');
      const cloud2Style = await clouds[1].getAttribute('style');

      // Styles should be different (due to randomization)
      expect(cloud1Style).not.toBe(cloud2Style);
    }
  });
});
