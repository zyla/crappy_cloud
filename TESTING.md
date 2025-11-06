# Testing Guide for Crappy Cloud

This document explains the comprehensive testing strategy for this animation project.

## Test Philosophy

Testing an animation-heavy visual project presents unique challenges:
- **Randomness** makes assertions difficult
- **Browser APIs** (CSS animations) require real browser testing
- **Memory leaks** are a critical concern with continuous element spawning
- **Visual correctness** can't be fully tested with traditional unit tests

Our solution: **Multi-layered testing approach**

## Test Layers

### Layer 1: Unit Tests (Jest + jsdom)
**What**: Test pure JavaScript logic in isolation
**Why**: Fast, deterministic, easy to debug
**Where**: `__tests__/*.test.js`

```bash
npm test                 # Run all unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

**What we test**:
- ✅ Utility functions (randomization bounds)
- ✅ Element creation logic
- ✅ DOM manipulation
- ✅ Event listener attachment
- ✅ Cleanup behavior

**Key insight**: By refactoring into modules, we can test animation logic without running actual animations.

### Layer 2: E2E Visual Tests (Playwright)
**What**: Test in real browser with actual rendering
**Why**: Verify animations work, visual appearance is correct
**Where**: `__tests__/e2e/visual.test.js`

```bash
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Interactive UI mode
```

**What we test**:
- ✅ Page loads correctly
- ✅ Elements spawn
- ✅ Buzzwords display from expected list
- ✅ CSS animations are applied
- ✅ Background gradient renders
- ✅ Properties are randomized

### Layer 3: Memory Leak Detection (Playwright)
**What**: Verify elements are cleaned up over time
**Why**: **Critical** - continuous spawning can cause memory leaks
**Where**: `__tests__/e2e/memory-leak.test.js`

```bash
npm run test:e2e        # Includes memory tests
```

**What we test**:
- ✅ DOM element count stays bounded
- ✅ Elements are removed after animations
- ✅ Event listeners are cleaned up
- ✅ Memory usage doesn't grow unbounded
- ✅ Creation/removal ratio is balanced

**Key techniques**:
1. **Monkey-patching** `appendChild` and `remove` to track lifecycle
2. **Sampling** element counts over time
3. **Memory metrics** via `performance.memory` API
4. **Statistical analysis** of growth patterns

## Running All Tests

```bash
npm run test:all        # Run both unit and E2E tests
```

## Test Coverage

Current coverage targets: **70%+** for all metrics

View coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Writing New Tests

### For Unit Tests
```javascript
import { YourClass } from '../src/yourClass.js';

describe('YourClass', () => {
  it('should do something', () => {
    // Arrange
    const instance = new YourClass();

    // Act
    const result = instance.doSomething();

    // Assert
    expect(result).toBe(expected);
  });
});
```

### For E2E Tests
```javascript
test('should verify visual behavior', async ({ page }) => {
  await page.goto('/');

  // Wait for animations to start
  await page.waitForTimeout(1000);

  // Make assertions
  const element = page.locator('.selector');
  await expect(element).toBeVisible();
});
```

## Debugging Tests

### Unit Tests
```bash
npm run test:watch      # Re-run on file changes
```

Add `.only` to run a single test:
```javascript
test.only('should test this specific thing', () => {
  // ...
});
```

### E2E Tests
```bash
npm run test:e2e:ui     # Opens Playwright UI
```

Or use headed mode:
```bash
npx playwright test --headed
```

## Continuous Integration

Tests are designed to run in CI environments:
- Headless browser mode
- Automatic retries for flaky tests
- Screenshots/traces on failure
- Stable element selectors

## Key Testing Insights

### Challenge: Testing Randomness
**Solution**: Run assertions many times statistically
```javascript
// Verify randomness produces different results
for (let i = 0; i < 100; i++) {
  const value = randomFunction();
  expect(value).toBeInRange(min, max);
}
```

### Challenge: Testing Animations
**Solution**: Verify animation properties, not visual frames
```javascript
// Don't test exact pixel positions
// DO test animation names, durations, styles
expect(element.style.animationName).toBe('left');
```

### Challenge: Memory Leaks
**Solution**: Track creation/removal ratios over time
```javascript
// Monkey-patch to track lifecycle
const originalRemove = Element.prototype.remove;
Element.prototype.remove = function() {
  statsTracker.removed++;
  return originalRemove.apply(this);
};
```

## Common Issues

### "Element not found"
- Add `await page.waitForTimeout()` to let animations start
- Use more specific selectors

### "Tests are flaky"
- Increase wait times for slower CI environments
- Use `waitForSelector` instead of fixed timeouts
- Verify assumptions about timing

### "Memory test fails"
- Check if cleanup event listeners are attached
- Verify `animationend` events are firing
- Ensure `remove()` is called, not just hiding elements

## Performance Benchmarks

Expected performance characteristics:
- **Element count**: 5-20 clouds, 1-2 buzzwords active
- **Memory**: Should stabilize after initial allocation
- **Frame rate**: 60fps (animations are CSS-based, GPU accelerated)

## Future Test Improvements

Potential additions:
- [ ] Visual regression testing (screenshot comparison)
- [ ] Cross-browser testing (Firefox, Safari)
- [ ] Performance profiling integration
- [ ] Accessibility testing (aria-labels, reduced-motion)
- [ ] Mobile device testing
