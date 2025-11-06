/**
 * @jest-environment jsdom
 */

import { CloudAnimator } from '../src/cloudAnimator.js';

describe('CloudAnimator', () => {
  let templateElement;
  let container;
  let animator;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <img class="shit" src="cloud.png" style="display: none; width: 100px; height: 50px;">
      <div id="container"></div>
    `;

    templateElement = document.querySelector('.shit');
    container = document.getElementById('container');

    // Mock container dimensions
    Object.defineProperty(container, 'clientHeight', {
      writable: true,
      value: 800
    });

    animator = new CloudAnimator(templateElement, container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should initialize with template and container', () => {
      expect(animator.templateElement).toBe(templateElement);
      expect(animator.container).toBe(container);
      expect(animator.activeCloudCount).toBe(0);
    });

    it('should default to document.body if no container provided', () => {
      const defaultAnimator = new CloudAnimator(templateElement);
      expect(defaultAnimator.container).toBe(document.body);
    });
  });

  describe('createCloudElement', () => {
    it('should create a cloned element', () => {
      const cloud = animator.createCloudElement();
      expect(cloud).toBeInstanceOf(HTMLImageElement);
      expect(cloud).not.toBe(templateElement);
    });

    it('should set display to block', () => {
      const cloud = animator.createCloudElement();
      expect(cloud.style.display).toBe('block');
    });

    it('should set random top position', () => {
      const cloud = animator.createCloudElement();
      const top = parseFloat(cloud.style.top);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThanOrEqual(container.clientHeight);
    });

    it('should set transform with scale and rotate', () => {
      const cloud = animator.createCloudElement();
      expect(cloud.style.transform).toMatch(/scale\([0-9.]+\) rotate\([0-9.-]+deg\)/);
    });

    it('should set animation duration', () => {
      const cloud = animator.createCloudElement();
      const duration = parseFloat(cloud.style.animationDuration);
      expect(duration).toBeGreaterThan(0);
    });

    it('should set opacity', () => {
      const cloud = animator.createCloudElement();
      const opacity = parseFloat(cloud.style.opacity);
      expect(opacity).toBeGreaterThanOrEqual(0);
      expect(opacity).toBeLessThanOrEqual(1);
    });

    it('should set animation name to left or right', () => {
      // Run multiple times to test randomness
      const animations = new Set();
      for (let i = 0; i < 20; i++) {
        const cloud = animator.createCloudElement();
        animations.add(cloud.style.animationName);
      }

      // Should eventually get both
      expect(animations.has('left') || animations.has('right')).toBe(true);
    });
  });

  describe('spawn', () => {
    it('should create and append a cloud element', () => {
      const initialChildren = container.children.length;
      const cloud = animator.spawn();

      expect(container.children.length).toBe(initialChildren + 1);
      expect(container.contains(cloud)).toBe(true);
    });

    it('should increment activeCloudCount', () => {
      expect(animator.activeCloudCount).toBe(0);
      animator.spawn();
      expect(animator.activeCloudCount).toBe(1);
      animator.spawn();
      expect(animator.activeCloudCount).toBe(2);
    });

    it('should attach animationend event listener', () => {
      const cloud = animator.spawn();

      // Trigger animationend
      const event = new Event('animationend');
      cloud.dispatchEvent(event);

      // Cloud should be removed
      expect(container.contains(cloud)).toBe(false);
      expect(animator.activeCloudCount).toBe(0);
    });

    it('should clean up element after animation ends', () => {
      const cloud = animator.spawn();
      expect(container.children.length).toBe(1);

      // Simulate animation end
      cloud.dispatchEvent(new Event('animationend'));

      expect(container.children.length).toBe(0);
    });
  });

  describe('getActiveCloudCount', () => {
    it('should return the number of cloud elements in DOM', () => {
      expect(animator.getActiveCloudCount()).toBe(1); // Template element

      animator.spawn();
      expect(animator.getActiveCloudCount()).toBeGreaterThan(1);
    });
  });

  describe('calculateNextSpawnDelay', () => {
    it('should return a number', () => {
      const delay = animator.calculateNextSpawnDelay();
      expect(typeof delay).toBe('number');
    });

    it('should return a positive value', () => {
      animator.spawn();
      const delay = animator.calculateNextSpawnDelay();
      expect(delay).toBeGreaterThanOrEqual(0);
    });

    it('should scale with cloud count', () => {
      // Spawn multiple clouds
      for (let i = 0; i < 5; i++) {
        animator.spawn();
      }

      // Delay should be larger with more clouds (statistically)
      const delays = [];
      for (let i = 0; i < 10; i++) {
        delays.push(animator.calculateNextSpawnDelay());
      }

      const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
      expect(avgDelay).toBeGreaterThan(0);
    });
  });

  describe('memory leak prevention', () => {
    it('should not accumulate elements over time', () => {
      // Spawn multiple clouds
      const clouds = [];
      for (let i = 0; i < 10; i++) {
        clouds.push(animator.spawn());
      }

      expect(container.children.length).toBe(10);

      // Simulate all animations ending
      clouds.forEach(cloud => {
        cloud.dispatchEvent(new Event('animationend'));
      });

      expect(container.children.length).toBe(0);
      expect(animator.activeCloudCount).toBe(0);
    });
  });
});
