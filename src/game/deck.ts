import { Card, CardSymbol } from './types';
import { mulberry32, seededShuffle } from './random';

export const CARD_SYMBOLS: readonly CardSymbol[] = [
  'heart',
  'star',
  'leaf',
  'moon',
  'sun',
  'diamond',
  'lightning',
  'paper-plane',
] as const;

/**
 * Creates an unshuffled list of 8 pairs (16 cards total) with unique IDs.
 */
export function createUnshuffledDeck(): Omit<Card, 'position'>[] {
  const cards: Omit<Card, 'position'>[] = [];

  for (const symbol of CARD_SYMBOLS) {
    cards.push({
      id: `${symbol}-1`,
      pairId: symbol,
      symbol,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `${symbol}-2`,
      pairId: symbol,
      symbol,
      isFlipped: false,
      isMatched: false,
    });
  }

  return cards;
}

/**
 * Creates and deterministically shuffles a 4x4 card deck (16 cards)
 * using the provided seed.
 */
export function createDeck(seed: number): Card[] {
  const prng = mulberry32(seed);
  const unshuffled = createUnshuffledDeck();
  const shuffled = seededShuffle(unshuffled, prng);

  return shuffled.map((card, index) => ({
    ...card,
    position: index,
  }));
}
