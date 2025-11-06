/**
 * @jest-environment jsdom
 */

import { BuzzwordAnimator } from '../src/buzzwordAnimator.js';

describe('BuzzwordAnimator', () => {
  let container;
  let animator;
  const testBuzzwords = ['cloud', 'AI', 'blockchain', 'synergy'];

  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>';
    container = document.getElementById('container');

    Object.defineProperty(container, 'clientHeight', {
      writable: true,
      value: 800
    });

    animator = new BuzzwordAnimator(testBuzzwords, container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should initialize with buzzwords and container', () => {
      expect(animator.buzzwords).toBe(testBuzzwords);
      expect(animator.container).toBe(container);
      expect(animator.activeBuzzwordCount).toBe(0);
    });

    it('should default to document.body if no container provided', () => {
      const defaultAnimator = new BuzzwordAnimator(testBuzzwords);
      expect(defaultAnimator.container).toBe(document.body);
    });
  });

  describe('createBuzzwordElement', () => {
    it('should create an h1 element', () => {
      const buzzword = animator.createBuzzwordElement();
      expect(buzzword.tagName).toBe('H1');
    });

    it('should set text content to a buzzword from the list', () => {
      const buzzword = animator.createBuzzwordElement();
      expect(testBuzzwords).toContain(buzzword.textContent);
    });

    it('should set random top position', () => {
      const buzzword = animator.createBuzzwordElement();
      const top = parseFloat(buzzword.style.top);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThanOrEqual(container.clientHeight - 100);
    });

    it('should set transform with scale', () => {
      const buzzword = animator.createBuzzwordElement();
      expect(buzzword.style.transform).toMatch(/scale\([0-9.]+\)/);
    });

    it('should set animation duration', () => {
      const buzzword = animator.createBuzzwordElement();
      const duration = parseFloat(buzzword.style.animationDuration);
      expect(duration).toBeGreaterThan(0);
    });

    it('should set animation name to buzz0-buzz4', () => {
      const validAnimations = ['buzz0', 'buzz1', 'buzz2', 'buzz3', 'buzz4'];

      // Test multiple times due to randomness
      for (let i = 0; i < 20; i++) {
        const buzzword = animator.createBuzzwordElement();
        expect(validAnimations).toContain(buzzword.style.animationName);
      }
    });

    it('should eventually use all animation types', () => {
      const animations = new Set();

      // Create many buzzwords to ensure we get all animations
      for (let i = 0; i < 100; i++) {
        const buzzword = animator.createBuzzwordElement();
        animations.add(buzzword.style.animationName);
      }

      // Should have multiple animation types
      expect(animations.size).toBeGreaterThan(1);
    });
  });

  describe('spawn', () => {
    it('should create and append a buzzword element', () => {
      const initialChildren = container.children.length;
      const buzzword = animator.spawn();

      expect(container.children.length).toBe(initialChildren + 1);
      expect(container.contains(buzzword)).toBe(true);
    });

    it('should increment activeBuzzwordCount', () => {
      expect(animator.activeBuzzwordCount).toBe(0);
      animator.spawn();
      expect(animator.activeBuzzwordCount).toBe(1);
    });

    it('should attach animationend event listener', () => {
      const buzzword = animator.spawn();
      expect(container.contains(buzzword)).toBe(true);

      // Trigger animationend
      buzzword.dispatchEvent(new Event('animationend'));

      // Buzzword should be removed
      expect(container.contains(buzzword)).toBe(false);
    });

    it('should clean up element after animation ends', () => {
      const buzzword = animator.spawn();
      expect(container.children.length).toBe(1);

      buzzword.dispatchEvent(new Event('animationend'));

      expect(container.children.length).toBe(0);
      expect(animator.activeBuzzwordCount).toBe(0);
    });
  });

  describe('getActiveBuzzwordCount', () => {
    it('should return the current count', () => {
      expect(animator.getActiveBuzzwordCount()).toBe(0);

      animator.spawn();
      expect(animator.getActiveBuzzwordCount()).toBe(1);

      animator.spawn();
      expect(animator.getActiveBuzzwordCount()).toBe(2);
    });
  });

  describe('start', () => {
    it('should spawn an initial buzzword', () => {
      expect(container.children.length).toBe(0);
      animator.start();
      expect(container.children.length).toBe(1);
    });
  });

  describe('memory leak prevention', () => {
    it('should not accumulate elements over time', () => {
      const buzzwords = [];
      for (let i = 0; i < 10; i++) {
        buzzwords.push(animator.spawn());
      }

      expect(container.children.length).toBe(10);
      expect(animator.activeBuzzwordCount).toBe(10);

      // Simulate all animations ending
      buzzwords.forEach(buzzword => {
        buzzword.dispatchEvent(new Event('animationend'));
      });

      expect(container.children.length).toBe(0);
      expect(animator.activeBuzzwordCount).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle single buzzword array', () => {
      const singleAnimator = new BuzzwordAnimator(['lonely'], container);
      const buzzword = singleAnimator.createBuzzwordElement();
      expect(buzzword.textContent).toBe('lonely');
    });

    it('should handle many buzzwords', () => {
      const manyBuzzwords = Array.from({ length: 100 }, (_, i) => `word${i}`);
      const manyAnimator = new BuzzwordAnimator(manyBuzzwords, container);

      const selectedWords = new Set();
      for (let i = 0; i < 50; i++) {
        const buzzword = manyAnimator.createBuzzwordElement();
        selectedWords.add(buzzword.textContent);
      }

      // Should have variety
      expect(selectedWords.size).toBeGreaterThan(1);
    });
  });
});
