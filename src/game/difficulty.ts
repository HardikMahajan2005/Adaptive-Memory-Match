import { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: 'easy',
    label: 'Easy',
    mismatchDelayMs: 1200,
    previewDurationMs: 2500,
    description: 'Longer reveal window (1.2s) & 2.5s opening memory preview.',
  },
  medium: {
    name: 'medium',
    label: 'Medium',
    mismatchDelayMs: 900,
    previewDurationMs: 1200,
    description: 'Balanced reveal window (0.9s) & 1.2s quick preview.',
  },
  hard: {
    name: 'hard',
    label: 'Hard',
    mismatchDelayMs: 650,
    previewDurationMs: 0,
    description: 'Fast-paced reveal window (0.65s) with no opening preview.',
  },
};

export interface AdaptationResult {
  currentDifficulty: Difficulty;
  nextDifficulty: Difficulty;
  tier: 'strong' | 'moderate' | 'struggling';
  reason: string;
}

/**
 * Evaluates game performance based on move count and elapsed time.
 * Performance policy:
 * - Strong: <= 12 moves (or <= 45s with <= 16 moves)
 * - Moderate: 13-20 moves
 * - Struggling: >= 21 moves
 */
export function calculateNextDifficulty(
  currentDifficulty: Difficulty,
  moves: number,
  elapsedMs: number
): AdaptationResult {
  const elapsedSec = Math.round(elapsedMs / 1000);

  let tier: 'strong' | 'moderate' | 'struggling';

  if (moves <= 12 || (moves <= 16 && elapsedSec <= 45)) {
    tier = 'strong';
  } else if (moves <= 20 && elapsedSec <= 120) {
    tier = 'moderate';
  } else {
    tier = 'struggling';
  }

  let nextDifficulty: Difficulty = currentDifficulty;
  let reason = '';

  if (tier === 'strong') {
    if (currentDifficulty === 'easy') {
      nextDifficulty = 'medium';
      reason = `Outstanding memory! You found all 8 pairs in ${moves} moves (${elapsedSec}s). Difficulty increased from Easy to Medium.`;
    } else if (currentDifficulty === 'medium') {
      nextDifficulty = 'hard';
      reason = `Exceptional mastery! Completed in ${moves} moves (${elapsedSec}s). Difficulty increased from Medium to Hard.`;
    } else {
      nextDifficulty = 'hard';
      reason = `Flawless execution! Completed in ${moves} moves (${elapsedSec}s). You have mastered Hard difficulty!`;
    }
  } else if (tier === 'moderate') {
    nextDifficulty = currentDifficulty;
    const diffLabel = DIFFICULTY_CONFIGS[currentDifficulty].label;
    reason = `Solid run! You found 8 pairs in ${moves} moves (${elapsedSec}s). Next round stays on ${diffLabel} to reinforce your skills.`;
  } else {
    if (currentDifficulty === 'hard') {
      nextDifficulty = 'medium';
      reason = `A tough round with ${moves} moves (${elapsedSec}s). Difficulty adjusted from Hard to Medium for better pacing.`;
    } else if (currentDifficulty === 'medium') {
      nextDifficulty = 'easy';
      reason = `Completed in ${moves} moves (${elapsedSec}s). Difficulty adjusted from Medium to Easy to build accuracy.`;
    } else {
      nextDifficulty = 'easy';
      reason = `Completed in ${moves} moves (${elapsedSec}s). Keeping on Easy so you can practice pattern recognition.`;
    }
  }

  return {
    currentDifficulty,
    nextDifficulty,
    tier,
    reason,
  };
}
