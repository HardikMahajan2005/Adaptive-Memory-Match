import { SessionResult, HistoryStatistics, Difficulty } from '@/game/types';

/**
 * Calculates aggregate performance statistics from historical sessions.
 */
export function calculateStatistics(sessions: SessionResult[]): HistoryStatistics {
  if (sessions.length === 0) {
    return {
      totalGames: 0,
      bestMoves: null,
      bestTimeMs: null,
      averageMoves: 0,
      averageTimeMs: 0,
      difficultyDistribution: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      recentSessions: [],
    };
  }

  let totalMoves = 0;
  let totalTimeMs = 0;
  let bestMoves: number | null = null;
  let bestTimeMs: number | null = null;

  const distribution: Record<Difficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  for (const session of sessions) {
    totalMoves += session.moves;
    totalTimeMs += session.elapsedMs;

    if (bestMoves === null || session.moves < bestMoves) {
      bestMoves = session.moves;
    }

    if (bestTimeMs === null || session.elapsedMs < bestTimeMs) {
      bestTimeMs = session.elapsedMs;
    }

    if (session.difficulty in distribution) {
      distribution[session.difficulty]++;
    }
  }

  return {
    totalGames: sessions.length,
    bestMoves,
    bestTimeMs,
    averageMoves: Math.round((totalMoves / sessions.length) * 10) / 10,
    averageTimeMs: Math.round(totalTimeMs / sessions.length),
    difficultyDistribution: distribution,
    recentSessions: sessions.slice(0, 10),
  };
}
