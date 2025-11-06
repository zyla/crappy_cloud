/**
 * Utility functions for random number generation and validation
 */

/**
 * Generate a random number between min and max
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min (inclusive) and max (exclusive)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Pick a random item from an array
 */
export function randomChoice(array) {
  if (!array || array.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  return array[randomInt(0, array.length)];
}

/**
 * Generate random scale value for clouds
 */
export function randomCloudScale() {
  return randomBetween(0.5, 2.5);
}

/**
 * Generate random animation duration
 */
export function randomAnimationDuration() {
  return randomBetween(0.5, 8.5);
}

/**
 * Generate random rotation angle
 */
export function randomRotation() {
  return randomBetween(-5, 5);
}

/**
 * Generate random opacity
 */
export function randomOpacity() {
  return Math.random();
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
