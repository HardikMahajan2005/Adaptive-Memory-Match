import { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { gameReducer, createInitialGameState } from '@/game/reducer';
import { Difficulty, SessionResult } from '@/game/types';
import { DIFFICULTY_CONFIGS } from '@/game/difficulty';
import { generateRandomSeed } from '@/game/random';
import { saveSessionResult, loadSessionHistory, clearSessionHistory } from '@/lib/storage';
import { calculateStatistics } from '@/lib/statistics';
import confetti from 'canvas-confetti';

export function useGame(initialSeed: number = generateRandomSeed(), initialDifficulty: Difficulty = 'easy') {
  const [state, dispatch] = useReducer(
    gameReducer,
    { seed: initialSeed, difficulty: initialDifficulty },
    (args) => createInitialGameState(args.seed, args.difficulty)
  );

  const [history, setHistory] = useState<SessionResult[]>(() => loadSessionHistory());
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [previewRemainingSec, setPreviewRemainingSec] = useState<number>(() => {
    return DIFFICULTY_CONFIGS[initialDifficulty].previewDurationMs / 1000;
  });

  // Track the generation ID in refs to discard stale async timeouts
  const currentGenerationRef = useRef(state.roundGeneration);
  currentGenerationRef.current = state.roundGeneration;

  // ElapsedMs ref to avoid recreating effect on each tick
  const elapsedMsRef = useRef(state.elapsedMs);
  elapsedMsRef.current = state.elapsedMs;

  // High precision timer reference
  const timerStartRef = useRef<number | null>(null);
  const timerRafRef = useRef<number | null>(null);

  // Mismatch timeout reference
  const mismatchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preview countdown interval reference
  const previewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Safe timer clearing helper
  const clearAllTimers = useCallback(() => {
    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current);
      timerRafRef.current = null;
    }
    if (mismatchTimeoutRef.current) {
      clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = null;
    }
    if (previewIntervalRef.current) {
      clearInterval(previewIntervalRef.current);
      previewIntervalRef.current = null;
    }
  }, []);

  // 1. High precision active timer loop
  useEffect(() => {
    if (!state.isTimerRunning || state.isCompleted) {
      if (timerRafRef.current) {
        cancelAnimationFrame(timerRafRef.current);
        timerRafRef.current = null;
      }
      timerStartRef.current = null;
      return;
    }

    if (timerStartRef.current === null) {
      // Offset by current elapsedMs if resuming
      timerStartRef.current = performance.now() - elapsedMsRef.current;
    }

    let lastTickTime = 0;

    const tick = (now: number) => {
      if (timerStartRef.current !== null && !state.isCompleted) {
        const currentElapsed = Math.floor(now - timerStartRef.current);
        // Throttle dispatch to ~30 FPS to avoid React render churn
        if (now - lastTickTime >= 33) {
          lastTickTime = now;
          dispatch({ type: 'TICK_TIMER', payload: { elapsedMs: currentElapsed } });
        }
        timerRafRef.current = requestAnimationFrame(tick);
      }
    };

    timerRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRafRef.current) {
        cancelAnimationFrame(timerRafRef.current);
      }
    };
  }, [state.isTimerRunning, state.isCompleted, state.roundGeneration]);

  // 2. Opening Preview countdown
  useEffect(() => {
    if (state.phase !== 'previewing') {
      if (previewIntervalRef.current) {
        clearInterval(previewIntervalRef.current);
        previewIntervalRef.current = null;
      }
      return;
    }

    const durationMs = DIFFICULTY_CONFIGS[state.difficulty].previewDurationMs;
    if (durationMs <= 0) {
      dispatch({ type: 'END_PREVIEW' });
      return;
    }

    const startTime = performance.now();
    setPreviewRemainingSec(durationMs / 1000);

    previewIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      setPreviewRemainingSec(remaining);

      if (remaining <= 0) {
        if (previewIntervalRef.current) {
          clearInterval(previewIntervalRef.current);
          previewIntervalRef.current = null;
        }
        dispatch({ type: 'END_PREVIEW' });
      }
    }, 100);

    return () => {
      if (previewIntervalRef.current) {
        clearInterval(previewIntervalRef.current);
      }
    };
  }, [state.phase, state.difficulty, state.roundGeneration]);

  // 3. Mismatch lock and delayed card flip-back
  useEffect(() => {
    if (state.phase !== 'resolvingMismatch') {
      if (mismatchTimeoutRef.current) {
        clearTimeout(mismatchTimeoutRef.current);
        mismatchTimeoutRef.current = null;
      }
      return;
    }

    const delayMs = DIFFICULTY_CONFIGS[state.difficulty].mismatchDelayMs;
    const generationAtSchedule = state.roundGeneration;

    mismatchTimeoutRef.current = setTimeout(() => {
      // AC-12: Stale callbacks from previous games cannot mutate new round!
      if (currentGenerationRef.current === generationAtSchedule) {
        dispatch({
          type: 'RESOLVE_MISMATCH',
          payload: { generation: generationAtSchedule },
        });
      }
    }, delayMs);

    return () => {
      if (mismatchTimeoutRef.current) {
        clearTimeout(mismatchTimeoutRef.current);
      }
    };
  }, [state.phase, state.difficulty, state.roundGeneration]);

  // 4. Game completion, celebratory feedback, and anonymous persistence
  const hasSavedRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.isCompleted && hasSavedRef.current !== state.sessionId) {
      hasSavedRef.current = state.sessionId;
      setIsWinModalOpen(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38BDF8', '#8B5CF6', '#34D399', '#FB7185', '#FBBF24'],
        });
      } catch {
        // Confetti fallback for test environments
      }

      // Calculate accuracy percentage: theoretical minimum 8 moves / actual moves * 100
      const accuracy = Math.round((8 / Math.max(8, state.moves)) * 100);

      const result: SessionResult = {
        id: state.sessionId,
        timestamp: Date.now(),
        seed: state.seed,
        difficulty: state.difficulty,
        moves: state.moves,
        matchedPairs: state.pairsFound,
        elapsedMs: state.elapsedMs,
        nextDifficulty: state.nextDifficulty,
        adaptationReason: state.adaptationReason,
        accuracyPercentage: accuracy,
      };

      saveSessionResult(result);
      setHistory(loadSessionHistory());
    }
  }, [
    state.isCompleted,
    state.sessionId,
    state.seed,
    state.difficulty,
    state.moves,
    state.pairsFound,
    state.elapsedMs,
    state.nextDifficulty,
    state.adaptationReason,
  ]);

  // Game actions
  const selectCard = useCallback((cardId: string) => {
    dispatch({ type: 'SELECT_CARD', payload: { cardId, timestamp: Date.now() } });
  }, []);

  const restartGame = useCallback((seed?: number) => {
    clearAllTimers();
    dispatch({ type: 'RESTART_GAME', payload: { seed } });
    setIsWinModalOpen(false);
  }, [clearAllTimers]);

  const startNewRound = useCallback(() => {
    clearAllTimers();
    // Advance to nextDifficulty adapted by engine
    const nextSeed = generateRandomSeed();
    dispatch({
      type: 'INIT_GAME',
      payload: {
        seed: nextSeed,
        difficulty: state.nextDifficulty,
      },
    });
    setIsWinModalOpen(false);
  }, [clearAllTimers, state.nextDifficulty]);

  const changeDifficulty = useCallback((diff: Difficulty) => {
    clearAllTimers();
    dispatch({ type: 'SET_DIFFICULTY', payload: { difficulty: diff } });
    setIsWinModalOpen(false);
  }, [clearAllTimers]);

  const clearHistoryData = useCallback(() => {
    clearSessionHistory();
    setHistory([]);
  }, []);

  const stats = calculateStatistics(history);

  return {
    state,
    stats,
    history,
    previewRemainingSec,
    isWinModalOpen,
    setIsWinModalOpen,
    selectCard,
    restartGame,
    startNewRound,
    changeDifficulty,
    clearHistoryData,
  };
}
