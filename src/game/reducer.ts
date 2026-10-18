import { GameState, GameAction, Difficulty } from './types';
import { createDeck } from './deck';
import { DIFFICULTY_CONFIGS, calculateNextDifficulty } from './difficulty';
import { generateRandomSeed } from './random';

export function createInitialGameState(
  seed: number = generateRandomSeed(),
  difficulty: Difficulty = 'easy'
): GameState {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const hasPreview = config.previewDurationMs > 0;
  const initialDeck = createDeck(seed);

  return {
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    roundGeneration: 1,
    seed,
    difficulty,
    deck: initialDeck.map((c) => ({
      ...c,
      isFlipped: hasPreview,
    })),
    selectedCardIds: [],
    matchedCardIds: [],
    moves: 0,
    pairsFound: 0,
    phase: hasPreview ? 'previewing' : 'idle',
    startTime: null,
    elapsedMs: 0,
    isTimerRunning: false,
    nextDifficulty: difficulty,
    adaptationReason: '',
    isCompleted: false,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME': {
      const { seed, difficulty, previewDurationMs } = action.payload;
      const config = DIFFICULTY_CONFIGS[difficulty];
      const previewTime = previewDurationMs !== undefined ? previewDurationMs : config.previewDurationMs;
      const hasPreview = previewTime > 0;
      const deck = createDeck(seed);

      return {
        ...state,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        roundGeneration: state.roundGeneration + 1,
        seed,
        difficulty,
        deck: deck.map((c) => ({
          ...c,
          isFlipped: hasPreview,
          isMatched: false,
        })),
        selectedCardIds: [],
        matchedCardIds: [],
        moves: 0,
        pairsFound: 0,
        phase: hasPreview ? 'previewing' : 'idle',
        startTime: null,
        elapsedMs: 0,
        isTimerRunning: false,
        isCompleted: false,
        nextDifficulty: difficulty,
        adaptationReason: '',
      };
    }

    case 'END_PREVIEW': {
      if (state.phase !== 'previewing') return state;

      return {
        ...state,
        phase: 'idle',
        deck: state.deck.map((card) => ({
          ...card,
          isFlipped: false,
        })),
      };
    }

    case 'SELECT_CARD': {
      // Ignore clicks during preview, mismatch resolution lock, or when game is finished
      if (state.phase !== 'idle' && state.phase !== 'playing') {
        return state;
      }

      const { cardId, timestamp = Date.now() } = action.payload;
      const card = state.deck.find((c) => c.id === cardId);

      // Card must exist and not already be matched or currently flipped
      if (!card || card.isMatched || card.isFlipped) {
        return state;
      }

      // If no card currently selected: reveal first card
      if (state.selectedCardIds.length === 0) {
        const isFirstAction = state.phase === 'idle';

        return {
          ...state,
          phase: 'playing',
          startTime: isFirstAction ? timestamp : state.startTime,
          isTimerRunning: true,
          selectedCardIds: [cardId],
          deck: state.deck.map((c) =>
            c.id === cardId ? { ...c, isFlipped: true } : c
          ),
        };
      }

      // If one card already selected: evaluate pair
      if (state.selectedCardIds.length === 1) {
        const firstCardId = state.selectedCardIds[0];

        // Guard against clicking the exact same card
        if (firstCardId === cardId) {
          return state;
        }

        const firstCard = state.deck.find((c) => c.id === firstCardId);
        if (!firstCard) return state;

        const isMatch = firstCard.pairId === card.pairId;
        const newMoves = state.moves + 1; // 1 move = 1 pair attempt

        if (isMatch) {
          const newPairsFound = state.pairsFound + 1;
          const isGameWon = newPairsFound === 8;

          let nextDiff = state.difficulty;
          let reason = '';

          if (isGameWon) {
            const adaptation = calculateNextDifficulty(
              state.difficulty,
              newMoves,
              state.elapsedMs
            );
            nextDiff = adaptation.nextDifficulty;
            reason = adaptation.reason;
          }

          return {
            ...state,
            moves: newMoves,
            pairsFound: newPairsFound,
            selectedCardIds: [],
            matchedCardIds: [...state.matchedCardIds, firstCard.id, card.id],
            deck: state.deck.map((c) => {
              if (c.id === firstCard.id || c.id === card.id) {
                return { ...c, isFlipped: true, isMatched: true };
              }
              return c;
            }),
            phase: isGameWon ? 'completed' : 'playing',
            isCompleted: isGameWon,
            isTimerRunning: !isGameWon,
            nextDifficulty: nextDiff,
            adaptationReason: reason,
          };
        } else {
          // Mismatch: enter locked resolution phase
          return {
            ...state,
            moves: newMoves,
            phase: 'resolvingMismatch',
            selectedCardIds: [firstCard.id, card.id],
            deck: state.deck.map((c) =>
              c.id === card.id ? { ...c, isFlipped: true } : c
            ),
          };
        }
      }

      // If 2 cards already selected and lock hasn't resolved, ignore any 3rd clicks
      return state;
    }

    case 'RESOLVE_MISMATCH': {
      // Invalidate action if generation token doesn't match current round
      if (action.payload.generation !== state.roundGeneration) {
        return state;
      }

      if (state.phase !== 'resolvingMismatch') {
        return state;
      }

      const [c1, c2] = state.selectedCardIds;

      return {
        ...state,
        phase: 'playing',
        selectedCardIds: [],
        deck: state.deck.map((c) => {
          if (c.id === c1 || c.id === c2) {
            return { ...c, isFlipped: false };
          }
          return c;
        }),
      };
    }

    case 'RESTART_GAME': {
      const nextSeed = action.payload?.seed ?? generateRandomSeed();
      const config = DIFFICULTY_CONFIGS[state.difficulty];
      const hasPreview = config.previewDurationMs > 0;
      const deck = createDeck(nextSeed);

      return {
        ...state,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        roundGeneration: state.roundGeneration + 1, // Invalidate pending timers
        seed: nextSeed,
        deck: deck.map((c) => ({
          ...c,
          isFlipped: hasPreview,
          isMatched: false,
        })),
        selectedCardIds: [],
        matchedCardIds: [],
        moves: 0,
        pairsFound: 0,
        phase: hasPreview ? 'previewing' : 'idle',
        startTime: null,
        elapsedMs: 0,
        isTimerRunning: false,
        isCompleted: false,
        nextDifficulty: state.difficulty,
        adaptationReason: '',
      };
    }

    case 'SET_DIFFICULTY': {
      const newDifficulty = action.payload.difficulty;
      const nextSeed = action.payload.seed ?? generateRandomSeed();
      const config = DIFFICULTY_CONFIGS[newDifficulty];
      const hasPreview = config.previewDurationMs > 0;
      const deck = createDeck(nextSeed);

      return {
        ...state,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        roundGeneration: state.roundGeneration + 1,
        seed: nextSeed,
        difficulty: newDifficulty,
        deck: deck.map((c) => ({
          ...c,
          isFlipped: hasPreview,
          isMatched: false,
        })),
        selectedCardIds: [],
        matchedCardIds: [],
        moves: 0,
        pairsFound: 0,
        phase: hasPreview ? 'previewing' : 'idle',
        startTime: null,
        elapsedMs: 0,
        isTimerRunning: false,
        isCompleted: false,
        nextDifficulty: newDifficulty,
        adaptationReason: '',
      };
    }

    case 'TICK_TIMER': {
      if (!state.isTimerRunning || state.isCompleted) {
        return state;
      }
      return {
        ...state,
        elapsedMs: action.payload.elapsedMs,
      };
    }

    case 'COMPLETE_GAME': {
      return {
        ...state,
        phase: 'completed',
        isCompleted: true,
        isTimerRunning: false,
        nextDifficulty: action.payload.nextDifficulty,
        adaptationReason: action.payload.adaptationReason,
      };
    }

    default:
      return state;
  }
}
