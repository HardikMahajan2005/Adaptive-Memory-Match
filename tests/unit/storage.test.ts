import { describe, it, expect, beforeEach } from 'vitest';
import { loadSessionHistory, saveSessionResult, clearSessionHistory } from '@/lib/storage';
import { calculateStatistics } from '@/lib/statistics';
import { SessionResult } from '@/game/types';

describe('Phase 7 & 10 Persistence and Analytics Tests (AC-09, AC-18)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('safely handles empty localStorage history', () => {
    const history = loadSessionHistory();
    expect(history).toEqual([]);
    const stats = calculateStatistics(history);
    expect(stats.totalGames).toBe(0);
    expect(stats.bestMoves).toBeNull();
    expect(stats.bestTimeMs).toBeNull();
  });

  it('safely recovers from corrupted localStorage JSON without crashing', () => {
    localStorage.setItem('cerevyn_ps09_session_history_v1', '{invalid-json---@@!!');
    const history = loadSessionHistory();
    expect(history).toEqual([]);
  });

  it('filters out malformed or tampered records from storage', () => {
    const corruptedData = [
      {
        id: 'valid-1',
        timestamp: 1700000000000,
        seed: 42,
        difficulty: 'easy',
        moves: 10,
        matchedPairs: 8,
        elapsedMs: 45000,
        nextDifficulty: 'medium',
        adaptationReason: 'Great job!',
        accuracyPercentage: 80,
      },
      {
        id: 'corrupt-missing-fields',
        moves: 'not-a-number',
      },
      {
        id: 'corrupt-invalid-difficulty',
        timestamp: 1700000000000,
        seed: 12,
        difficulty: 'super-extreme-unsupported',
        moves: 12,
        matchedPairs: 8,
        elapsedMs: 30000,
        nextDifficulty: 'god-mode',
        adaptationReason: 'Hack',
        accuracyPercentage: 100,
      },
    ];

    localStorage.setItem('cerevyn_ps09_session_history_v1', JSON.stringify(corruptedData));
    const history = loadSessionHistory();

    expect(history).toHaveLength(1);
    expect(history[0].id).toBe('valid-1');
  });

  it('saves session result and prevents duplicate entries for the same session ID (AC-09)', () => {
    const sample: SessionResult = {
      id: 'session-alpha',
      timestamp: Date.now(),
      seed: 999,
      difficulty: 'medium',
      moves: 12,
      matchedPairs: 8,
      elapsedMs: 50000,
      nextDifficulty: 'hard',
      adaptationReason: 'Solid run',
      accuracyPercentage: 67,
    };

    saveSessionResult(sample);
    expect(loadSessionHistory()).toHaveLength(1);

    // Save again with same ID (e.g. accidental double completion dispatch)
    saveSessionResult(sample);
    expect(loadSessionHistory()).toHaveLength(1);
  });

  it('correctly calculates aggregate statistics from multiple sessions', () => {
    const sessions: SessionResult[] = [
      {
        id: 's1',
        timestamp: 1000,
        seed: 1,
        difficulty: 'easy',
        moves: 10,
        matchedPairs: 8,
        elapsedMs: 40000,
        nextDifficulty: 'medium',
        adaptationReason: '',
        accuracyPercentage: 80,
      },
      {
        id: 's2',
        timestamp: 2000,
        seed: 2,
        difficulty: 'medium',
        moves: 14,
        matchedPairs: 8,
        elapsedMs: 60000,
        nextDifficulty: 'medium',
        adaptationReason: '',
        accuracyPercentage: 57,
      },
      {
        id: 's3',
        timestamp: 3000,
        seed: 3,
        difficulty: 'hard',
        moves: 24,
        matchedPairs: 8,
        elapsedMs: 110000,
        nextDifficulty: 'medium',
        adaptationReason: '',
        accuracyPercentage: 33,
      },
    ];

    const stats = calculateStatistics(sessions);
    expect(stats.totalGames).toBe(3);
    expect(stats.bestMoves).toBe(10);
    expect(stats.bestTimeMs).toBe(40000);
    expect(stats.averageMoves).toBe(16); // (10+14+24)/3 = 16
    expect(stats.averageTimeMs).toBe(70000); // (40000+60000+110000)/3 = 70000
    expect(stats.difficultyDistribution.easy).toBe(1);
    expect(stats.difficultyDistribution.medium).toBe(1);
    expect(stats.difficultyDistribution.hard).toBe(1);
  });

  it('clears all session history on clearSessionHistory', () => {
    const sample: SessionResult = {
      id: 'session-to-clear',
      timestamp: Date.now(),
      seed: 123,
      difficulty: 'easy',
      moves: 11,
      matchedPairs: 8,
      elapsedMs: 42000,
      nextDifficulty: 'medium',
      adaptationReason: 'Test',
      accuracyPercentage: 73,
    };

    saveSessionResult(sample);
    expect(loadSessionHistory()).toHaveLength(1);

    clearSessionHistory();
    expect(loadSessionHistory()).toHaveLength(0);
  });
});
