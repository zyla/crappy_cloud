import { randomChoice, randomBetween, randomInt } from './utils.js';

/**
 * Manages buzzword element spawning and animation
 */
export class BuzzwordAnimator {
  constructor(buzzwords, container = document.body) {
    this.buzzwords = buzzwords;
    this.container = container;
    this.activeBuzzwordCount = 0;
  }

  /**
   * Create and configure a new buzzword element
   */
  createBuzzwordElement() {
    const element = document.createElement('h1');
    const word = randomChoice(this.buzzwords);
    const scale = randomBetween(0.5, 5.5);
    const animationTime = randomBetween(0.5, 8.5);
    const animationIndex = randomInt(0, 5);

    element.textContent = word;

    // Calculate vertical position
    const top = Math.random() * (this.container.clientHeight - 100);

    // Apply styles
    element.style.top = `${top}px`;
    element.style.transform = `scale(${scale})`;
    element.style.animationDuration = `${animationTime}s`;
    element.style.animationName = `buzz${animationIndex}`;

    return element;
  }

  /**
   * Spawn a new buzzword and set up cleanup and respawn
   */
  spawn() {
    const buzzword = this.createBuzzwordElement();
    this.container.appendChild(buzzword);
    this.activeBuzzwordCount++;

    // Clean up when animation ends and spawn next
    buzzword.addEventListener('animationend', () => {
      buzzword.remove();
      this.activeBuzzwordCount--;

      // Spawn next buzzword immediately
      setTimeout(() => this.spawn(), Math.random() * 0);
    });

    return buzzword;
  }

  /**
   * Get the current number of active buzzwords
   */
  getActiveBuzzwordCount() {
    return this.activeBuzzwordCount;
  }

  /**
   * Start the buzzword animation system
   */
  start() {
    this.spawn();
  }
}
