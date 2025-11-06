import { test, expect } from '@playwright/test';

test.describe('Memory Leak Detection', () => {
  test('should not accumulate DOM elements over time', async ({ page }) => {
    await page.goto('/');

    // Wait for initial spawning
    await page.waitForTimeout(2000);

    // Count initial elements
    const initialCloudCount = await page.locator('img.shit[style*="display: block"]').count();
    const initialBuzzwordCount = await page.locator('h1').count();

    console.log(`Initial clouds: ${initialCloudCount}, buzzwords: ${initialBuzzwordCount}`);

    // Wait for animations to complete and new ones to spawn
    await page.waitForTimeout(10000);

    // Count elements again
    const laterCloudCount = await page.locator('img.shit[style*="display: block"]').count();
    const laterBuzzwordCount = await page.locator('h1').count();

    console.log(`After 10s - clouds: ${laterCloudCount}, buzzwords: ${laterBuzzwordCount}`);

    // Element counts should stay bounded (not grow unbounded)
    // Allow some variation but shouldn't be orders of magnitude larger
    expect(laterCloudCount).toBeLessThan(50); // Reasonable upper bound
    expect(laterBuzzwordCount).toBeLessThan(10); // Should only be 1-2 at a time
  });

  test('should clean up elements after animations complete', async ({ page }) => {
    await page.goto('/');

    // Inject code to track element creation/removal
    await page.evaluate(() => {
      window.elementStats = {
        cloudsCreated: 0,
        cloudsRemoved: 0,
        buzzwordsCreated: 0,
        buzzwordsRemoved: 0
      };

      // Monkey-patch appendChild to track creation
      const originalAppendChild = Element.prototype.appendChild;
      Element.prototype.appendChild = function(...args) {
        const element = args[0];
        if (element.classList && element.classList.contains('shit')) {
          window.elementStats.cloudsCreated++;
        } else if (element.tagName === 'H1') {
          window.elementStats.buzzwordsCreated++;
        }
        return originalAppendChild.apply(this, args);
      };

      // Monkey-patch remove to track cleanup
      const originalRemove = Element.prototype.remove;
      Element.prototype.remove = function() {
        if (this.classList && this.classList.contains('shit')) {
          window.elementStats.cloudsRemoved++;
        } else if (this.tagName === 'H1') {
          window.elementStats.buzzwordsRemoved++;
        }
        return originalRemove.apply(this);
      };
    });

    // Let animations run
    await page.waitForTimeout(15000);

    // Get stats
    const stats = await page.evaluate(() => window.elementStats);

    console.log('Element lifecycle stats:', stats);

    // Verify elements are being cleaned up
    expect(stats.cloudsCreated).toBeGreaterThan(0);
    expect(stats.cloudsRemoved).toBeGreaterThan(0);
    expect(stats.buzzwordsCreated).toBeGreaterThan(0);
    expect(stats.buzzwordsRemoved).toBeGreaterThan(0);

    // Cleanup rate should be close to creation rate
    // (allowing for elements still animating)
    const cloudCleanupRate = stats.cloudsRemoved / stats.cloudsCreated;
    const buzzwordCleanupRate = stats.buzzwordsRemoved / stats.buzzwordsCreated;

    expect(cloudCleanupRate).toBeGreaterThan(0.5); // At least 50% cleaned up
    expect(buzzwordCleanupRate).toBeGreaterThan(0.5);
  });

  test('should have stable memory usage', async ({ page }) => {
    await page.goto('/');

    // Measure initial memory
    await page.waitForTimeout(2000);
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        };
      }
      return null;
    });

    if (!initialMetrics) {
      test.skip('Performance.memory not available');
      return;
    }

    // Let it run for a while
    await page.waitForTimeout(20000);

    // Measure memory again
    const laterMetrics = await page.evaluate(() => ({
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize
    }));

    console.log('Initial memory:', initialMetrics);
    console.log('Later memory:', laterMetrics);

    // Memory should not grow significantly (allow for 5x increase max)
    // This is generous to account for JIT compilation, etc.
    const memoryGrowthRatio = laterMetrics.usedJSHeapSize / initialMetrics.usedJSHeapSize;

    expect(memoryGrowthRatio).toBeLessThan(5);
  });

  test('active element counts should stay bounded', async ({ page }) => {
    await page.goto('/');

    const measurements = [];

    // Take measurements over time
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(2000);

      const cloudCount = await page.locator('img.shit[style*="display: block"]').count();
      const buzzwordCount = await page.locator('h1').count();

      measurements.push({ cloudCount, buzzwordCount });
      console.log(`Measurement ${i + 1}: clouds=${cloudCount}, buzzwords=${buzzwordCount}`);
    }

    // Verify counts stay reasonable
    measurements.forEach(({ cloudCount, buzzwordCount }) => {
      expect(cloudCount).toBeLessThan(100); // Should never have this many
      expect(buzzwordCount).toBeLessThan(10);
    });

    // Verify we don't have monotonic growth
    const cloudCounts = measurements.map(m => m.cloudCount);
    const isMonotonicallyIncreasing = cloudCounts.every((val, idx) =>
      idx === 0 || val >= cloudCounts[idx - 1]
    );

    expect(isMonotonicallyIncreasing).toBe(false); // Should fluctuate, not always grow
  });

  test('event listeners should be cleaned up', async ({ page }) => {
    await page.goto('/');

    // Track event listener count
    const getEventListenerCount = async () => {
      return await page.evaluate(() => {
        // This is a rough proxy - count elements with listeners
        let count = 0;
        document.querySelectorAll('img.shit, h1').forEach(el => {
          // Elements with animation listeners will have them
          count++;
        });
        return count;
      });
    };

    await page.waitForTimeout(2000);
    const initialCount = await getEventListenerCount();

    await page.waitForTimeout(10000);
    const laterCount = await getEventListenerCount();

    console.log(`Event listener elements: ${initialCount} -> ${laterCount}`);

    // Should stay relatively stable (removed elements = removed listeners)
    expect(laterCount).toBeLessThan(100);
  });
});
