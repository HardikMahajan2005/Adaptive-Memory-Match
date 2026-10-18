import { describe, it, expect } from 'vitest';
import { createDeck, CARD_SYMBOLS } from '@/game/deck';
import { mulberry32 } from '@/game/random';
import { createInitialGameState, gameReducer } from '@/game/reducer';
import { calculateNextDifficulty } from '@/game/difficulty';

describe('Phase 3 Core Game Engine Tests', () => {
  describe('Seeded PRNG & Shuffling (AC-02)', () => {
    it('produces identical random sequences with the same seed', () => {
      const prng1 = mulberry32(12345);
      const prng2 = mulberry32(12345);
      const seq1 = [prng1(), prng1(), prng1(), prng1()];
      const seq2 = [prng2(), prng2(), prng2(), prng2()];
      expect(seq1).toEqual(seq2);
    });

    it('produces different sequences with different seeds', () => {
      const prng1 = mulberry32(12345);
      const prng2 = mulberry32(54321);
      expect(prng1()).not.toEqual(prng2());
    });

    it('generates reproducible deck layout for fixed seed', () => {
      const deckA = createDeck(42);
      const deckB = createDeck(42);
      expect(deckA.map((c) => c.id)).toEqual(deckB.map((c) => c.id));
    });

    it('generates different layouts for different seeds', () => {
      const deckA = createDeck(42);
      const deckB = createDeck(999);
      expect(deckA.map((c) => c.id)).not.toEqual(deckB.map((c) => c.id));
    });

    it('contains exactly 16 cards (8 pairs) with each symbol appearing exactly twice (AC-01)', () => {
      const deck = createDeck(100);
      expect(deck).toHaveLength(16);

      const symbolCounts: Record<string, number> = {};
      const uniqueIds = new Set<string>();

      for (const card of deck) {
        uniqueIds.add(card.id);
        symbolCounts[card.symbol] = (symbolCounts[card.symbol] || 0) + 1;
      }

      expect(uniqueIds.size).toBe(16);
      expect(CARD_SYMBOLS).toHaveLength(8);

      for (const sym of CARD_SYMBOLS) {
        expect(symbolCounts[sym]).toBe(2);
      }
    });
  });

  describe('Card Selection & Matching Rules (AC-04, AC-05, AC-06, AC-07)', () => {
    it('reveals first card without incrementing moves (1 move = 1 pair attempt)', () => {
      const state = createInitialGameState(100, 'hard'); // 'hard' has 0 preview
      expect(state.phase).toBe('idle');
      expect(state.moves).toBe(0);

      const firstCard = state.deck[0];
      const nextState = gameReducer(state, {
        type: 'SELECT_CARD',
        payload: { cardId: firstCard.id },
      });

      expect(nextState.phase).toBe('playing');
      expect(nextState.moves).toBe(0);
      expect(nextState.selectedCardIds).toEqual([firstCard.id]);
      expect(nextState.deck[0].isFlipped).toBe(true);
      expect(nextState.isTimerRunning).toBe(true);
    });

    it('safely ignores clicking the exact same card twice (AC-07)', () => {
      let state = createInitialGameState(100, 'hard');
      const firstCard = state.deck[0];

      state = gameReducer(state, {
        type: 'SELECT_CARD',
        payload: { cardId: firstCard.id },
      });
      expect(state.selectedCardIds).toHaveLength(1);

      // Repeat click
      const repeatState = gameReducer(state, {
        type: 'SELECT_CARD',
        payload: { cardId: firstCard.id },
      });

      expect(repeatState.selectedCardIds).toHaveLength(1);
      expect(repeatState.moves).toBe(0);
    });

    it('correctly matches pair, marks matched, and leaves cards face up (AC-04)', () => {
      let state = createInitialGameState(100, 'hard');
      const card1 = state.deck[0];
      // Find its partner
      const card2 = state.deck.find((c) => c.pairId === card1.pairId && c.id !== card1.id)!;

      state = gameReducer(state, {
        type: 'SELECT_CARD',
        payload: { cardId: card1.id },
      });
      state = gameReducer(state, {
        type: 'SELECT_CARD',
        payload: { cardId: card2.id },
      });

      expect(state.moves).toBe(1);
      expect(state.pairsFound).toBe(1);
      expect(state.selectedCardIds).toHaveLength(0);
      expect(state.matchedCardIds).toContain(card1.id);
      expect(state.matchedCardIds).toContain(card2.id);

      const c1 = state.deck.find((c) => c.id === card1.id)!;
      const c2 = state.deck.find((c) => c.id === card2.id)!;
      expect(c1.isMatched).toBe(true);
      expect(c2.isMatched).toBe(true);
      expect(c1.isFlipped).toBe(true);
      expect(c2.isFlipped).toBe(true);
    });

    it('safely ignores clicks on already matched cards (AC-07)', () => {
      let state = createInitialGameState(100, 'hard');
      const card1 = state.deck[0];
      const card2 = state.deck.find((c) => c.pairId === card1.pairId && c.id !== card1.id)!;

      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card1.id } });
      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card2.id } });
      expect(state.matchedCardIds).toHaveLength(2);

      // Try selecting already matched card
      const stateAfterClick = gameReducer(state, {
        type: 'SELECT_CARD',
        payload: { cardId: card1.id },
      });

      expect(stateAfterClick.selectedCardIds).toHaveLength(0);
      expect(stateAfterClick.moves).toBe(1);
    });

    it('locks state and ignores third card click during mismatch resolution (AC-05)', () => {
      let state = createInitialGameState(100, 'hard');
      const card1 = state.deck[0];
      // Find a different symbol
      const card2 = state.deck.find((c) => c.pairId !== card1.pairId)!;
      // Third different card
      const card3 = state.deck.find((c) => c.id !== card1.id && c.id !== card2.id)!;

      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card1.id } });
      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card2.id } });

      expect(state.moves).toBe(1);
      expect(state.phase).toBe('resolvingMismatch');
      expect(state.selectedCardIds).toEqual([card1.id, card2.id]);

      // Attempt third click while locked
      const thirdClickState = gameReducer(state, {
        type: 'SELECT_CARD',
        payload: { cardId: card3.id },
      });

      // Third click must be blocked
      expect(thirdClickState.selectedCardIds).toEqual([card1.id, card2.id]);
      expect(thirdClickState.deck.find((c) => c.id === card3.id)!.isFlipped).toBe(false);
      expect(thirdClickState.moves).toBe(1);
    });

    it('turns cards back face down on RESOLVE_MISMATCH', () => {
      let state = createInitialGameState(100, 'hard');
      const card1 = state.deck[0];
      const card2 = state.deck.find((c) => c.pairId !== card1.pairId)!;

      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card1.id } });
      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card2.id } });

      state = gameReducer(state, {
        type: 'RESOLVE_MISMATCH',
        payload: { generation: state.roundGeneration },
      });

      expect(state.phase).toBe('playing');
      expect(state.selectedCardIds).toEqual([]);
      expect(state.deck.find((c) => c.id === card1.id)!.isFlipped).toBe(false);
      expect(state.deck.find((c) => c.id === card2.id)!.isFlipped).toBe(false);
    });
  });

  describe('Race Condition & Timer Safety Safeguards (AC-12)', () => {
    it('invalidates pending mismatch callback when game is restarted', () => {
      let state = createInitialGameState(100, 'hard');
      const card1 = state.deck[0];
      const card2 = state.deck.find((c) => c.pairId !== card1.pairId)!;

      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card1.id } });
      state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: card2.id } });
      expect(state.phase).toBe('resolvingMismatch');

      const oldGeneration = state.roundGeneration;

      // User restarts during pending mismatch
      state = gameReducer(state, { type: 'RESTART_GAME' });
      expect(state.roundGeneration).toBe(oldGeneration + 1);
      expect(state.moves).toBe(0);

      // Now the delayed callback from old round arrives
      const stateAfterStaleCallback = gameReducer(state, {
        type: 'RESOLVE_MISMATCH',
        payload: { generation: oldGeneration },
      });

      // It must be safely ignored and not corrupt new game
      expect(stateAfterStaleCallback.roundGeneration).toBe(oldGeneration + 1);
      expect(stateAfterStaleCallback.moves).toBe(0);
    });
  });

  describe('Adaptive Difficulty Calculation (AC-08, AC-10)', () => {
    it('increases difficulty from Easy to Medium on strong performance (moves <= 12)', () => {
      const res = calculateNextDifficulty('easy', 10, 35000);
      expect(res.nextDifficulty).toBe('medium');
      expect(res.tier).toBe('strong');
      expect(res.reason).toContain('Easy to Medium');
    });

    it('increases difficulty from Medium to Hard on strong performance', () => {
      const res = calculateNextDifficulty('medium', 11, 40000);
      expect(res.nextDifficulty).toBe('hard');
      expect(res.tier).toBe('strong');
      expect(res.reason).toContain('Medium to Hard');
    });

    it('maintains Hard difficulty at upper boundary on strong performance', () => {
      const res = calculateNextDifficulty('hard', 9, 30000);
      expect(res.nextDifficulty).toBe('hard');
      expect(res.tier).toBe('strong');
      expect(res.reason).toContain('mastered Hard');
    });

    it('maintains current difficulty on moderate performance (13-20 moves)', () => {
      const res = calculateNextDifficulty('medium', 16, 75000);
      expect(res.nextDifficulty).toBe('medium');
      expect(res.tier).toBe('moderate');
      expect(res.reason).toContain('stays on Medium');
    });

    it('decreases difficulty from Hard to Medium on struggling performance (>= 21 moves)', () => {
      const res = calculateNextDifficulty('hard', 24, 130000);
      expect(res.nextDifficulty).toBe('medium');
      expect(res.tier).toBe('struggling');
      expect(res.reason).toContain('Hard to Medium');
    });

    it('decreases difficulty from Medium to Easy on struggling performance', () => {
      const res = calculateNextDifficulty('medium', 22, 140000);
      expect(res.nextDifficulty).toBe('easy');
      expect(res.tier).toBe('struggling');
      expect(res.reason).toContain('Medium to Easy');
    });

    it('maintains Easy difficulty at lower boundary on struggling performance', () => {
      const res = calculateNextDifficulty('easy', 25, 150000);
      expect(res.nextDifficulty).toBe('easy');
      expect(res.tier).toBe('struggling');
      expect(res.reason).toContain('Keeping on Easy');
    });
  });

  describe('Full Game Completion & Win State (AC-01, AC-08)', () => {
    it('detects completion exactly when 8th pair is found and triggers adaptation', () => {
      let state = createInitialGameState(42, 'easy');
      // End the opening preview so cards can be selected
      state = gameReducer(state, { type: 'END_PREVIEW' });

      // Group cards by symbol
      const pairs: Record<string, string[]> = {};
      for (const card of state.deck) {
        if (!pairs[card.symbol]) pairs[card.symbol] = [];
        pairs[card.symbol].push(card.id);
      }

      // Play 8 matching pairs
      for (const symbol of CARD_SYMBOLS) {
        const [c1, c2] = pairs[symbol];
        state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: c1 } });
        state = gameReducer(state, { type: 'SELECT_CARD', payload: { cardId: c2 } });
      }

      expect(state.pairsFound).toBe(8);
      expect(state.moves).toBe(8);
      expect(state.isCompleted).toBe(true);
      expect(state.phase).toBe('completed');
      expect(state.isTimerRunning).toBe(false);
      expect(state.nextDifficulty).toBe('medium'); // 8 moves is strong performance: Easy -> Medium!
      expect(state.adaptationReason).toContain('Easy to Medium');
    });
  });
});
