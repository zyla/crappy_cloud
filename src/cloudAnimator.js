import {
  randomCloudScale,
  randomAnimationDuration,
  randomRotation,
  randomOpacity
} from './utils.js';

/**
 * Manages cloud element spawning and animation
 */
export class CloudAnimator {
  constructor(templateElement, container = document.body) {
    this.templateElement = templateElement;
    this.container = container;
    this.activeCloudCount = 0;
  }

  /**
   * Create and configure a new cloud element
   */
  createCloudElement() {
    const cloud = this.templateElement.cloneNode();
    const scale = randomCloudScale();
    const animationTime = randomAnimationDuration();
    const rotation = randomRotation();
    const opacity = randomOpacity();

    // Calculate vertical position
    const maxHeight = this.container.clientHeight - scale * this.templateElement.clientHeight;
    const top = Math.random() * maxHeight;

    // Apply styles
    cloud.style.top = `${top}px`;
    cloud.style.display = 'block';
    cloud.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    cloud.style.animationDuration = `${animationTime}s`;
    cloud.style.opacity = opacity;

    // Randomly choose direction
    cloud.style.animationName = Math.random() > 0.5 ? 'left' : 'right';

    return cloud;
  }

  /**
   * Spawn a new cloud and set up cleanup
   */
  spawn() {
    const cloud = this.createCloudElement();
    this.container.appendChild(cloud);
    this.activeCloudCount++;

    // Clean up when animation ends
    cloud.addEventListener('animationend', () => {
      cloud.remove();
      this.activeCloudCount--;
    });

    return cloud;
  }

  /**
   * Get the current number of active clouds
   */
  getActiveCloudCount() {
    return document.querySelectorAll('.shit').length;
  }

  /**
   * Calculate next spawn delay based on cloud count
   */
  calculateNextSpawnDelay() {
    const count = this.getActiveCloudCount();
    return Math.random() * count * 1000;
  }

  /**
   * Start spawning clouds continuously
   */
  startSpawning() {
    this.spawn();
    const delay = this.calculateNextSpawnDelay();
    setTimeout(() => this.startSpawning(), delay);
  }
}
