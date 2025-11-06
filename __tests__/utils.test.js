import {
  randomBetween,
  randomInt,
  randomChoice,
  randomCloudScale,
  randomAnimationDuration,
  randomRotation,
  randomOpacity,
  clamp
} from '../src/utils.js';

describe('utils', () => {
  describe('randomBetween', () => {
    it('should return a number between min and max', () => {
      // Run multiple times due to randomness
      for (let i = 0; i < 100; i++) {
        const result = randomBetween(5, 10);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThan(10);
      }
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomBetween(-10, -5);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThan(-5);
      }
    });
  });

  describe('randomInt', () => {
    it('should return an integer between min (inclusive) and max (exclusive)', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(0, 5);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(5);
      }
    });

    it('should never return the max value', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(0, 5);
        expect(result).not.toBe(5);
      }
    });
  });

  describe('randomChoice', () => {
    it('should return an item from the array', () => {
      const array = ['a', 'b', 'c', 'd'];
      for (let i = 0; i < 100; i++) {
        const result = randomChoice(array);
        expect(array).toContain(result);
      }
    });

    it('should throw error for empty array', () => {
      expect(() => randomChoice([])).toThrow('Cannot pick from empty array');
    });

    it('should throw error for null/undefined', () => {
      expect(() => randomChoice(null)).toThrow();
      expect(() => randomChoice(undefined)).toThrow();
    });
  });

  describe('randomCloudScale', () => {
    it('should return a scale between 0.5 and 2.5', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomCloudScale();
        expect(result).toBeGreaterThanOrEqual(0.5);
        expect(result).toBeLessThan(2.5);
      }
    });
  });

  describe('randomAnimationDuration', () => {
    it('should return a duration between 0.5 and 8.5 seconds', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomAnimationDuration();
        expect(result).toBeGreaterThanOrEqual(0.5);
        expect(result).toBeLessThan(8.5);
      }
    });
  });

  describe('randomRotation', () => {
    it('should return a rotation between -5 and 5 degrees', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomRotation();
        expect(result).toBeGreaterThanOrEqual(-5);
        expect(result).toBeLessThan(5);
      }
    });
  });

  describe('randomOpacity', () => {
    it('should return an opacity between 0 and 1', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomOpacity();
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
      }
    });
  });

  describe('clamp', () => {
    it('should clamp value to min', () => {
      expect(clamp(5, 10, 20)).toBe(10);
    });

    it('should clamp value to max', () => {
      expect(clamp(25, 10, 20)).toBe(20);
    });

    it('should return value if within range', () => {
      expect(clamp(15, 10, 20)).toBe(15);
    });

    it('should handle edge cases', () => {
      expect(clamp(10, 10, 20)).toBe(10);
      expect(clamp(20, 10, 20)).toBe(20);
    });
  });
});
