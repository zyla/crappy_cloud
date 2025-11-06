import { CloudAnimator } from './cloudAnimator.js';
import { BuzzwordAnimator } from './buzzwordAnimator.js';

/**
 * Initialize the crappy cloud application
 */
export function init() {
  // Cloud animation setup
  const cloudTemplate = document.querySelector('.shit');
  const cloudAnimator = new CloudAnimator(cloudTemplate);

  // Spawn initial clouds
  for (let i = 0; i < 5; i++) {
    cloudAnimator.spawn();
  }

  // Start continuous spawning
  setTimeout(() => cloudAnimator.startSpawning(), cloudAnimator.calculateNextSpawnDelay());

  // Buzzword animation setup
  const buzzwords = [
    'cloud',
    'multicore',
    'maszyn lerning',
    'sieci neuronowe',
    'agile',
    'mobile',
    'Byg Data'
  ];

  const buzzwordAnimator = new BuzzwordAnimator(buzzwords);
  buzzwordAnimator.start();

  // Expose for debugging
  window.cloudAnimator = cloudAnimator;
  window.buzzwordAnimator = buzzwordAnimator;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
