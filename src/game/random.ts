/**
 * Mulberry32 is a simple, high-quality 32-bit pseudo-random number generator
 * with a period of 2^32. It is completely deterministic given a numeric seed,
 * ensuring test reproducibility and fair gameplay.
 */
export function mulberry32(seed: number): () => number {
  let s = Math.floor(seed) >>> 0;
  return function (): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Modern Fisher-Yates shuffle using a deterministic PRNG function.
 * Returns a new shuffled array without mutating the input array.
 */
export function seededShuffle<T>(array: readonly T[], randomFn: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Generate a random 32-bit integer seed for standard new games.
 */
export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 2147483647) + 1;
}
