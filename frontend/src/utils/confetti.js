/**
 * Dynamic confetti loader
 * Loads 'canvas-confetti' on demand to prevent bundling it into the main or initial page chunks.
 */
let confettiPromise = null;

export async function triggerConfetti(options = {}) {
  try {
    if (!confettiPromise) {
      confettiPromise = import('canvas-confetti').then((mod) => mod.default || mod);
    }
    const confetti = await confettiPromise;
    return confetti(options);
  } catch (error) {
    console.warn('Unable to trigger confetti animation:', error);
  }
}

export default triggerConfetti;
