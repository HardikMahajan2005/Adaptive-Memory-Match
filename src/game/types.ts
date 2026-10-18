export type CardSymbol =
  | 'heart'
  | 'star'
  | 'leaf'
  | 'moon'
  | 'sun'
  | 'diamond'
  | 'lightning'
  | 'paper-plane';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id: string; // e.g., "heart-1", "heart-2"
  pairId: string; // e.g., "heart"
  symbol: CardSymbol;
  isFlipped: boolean;
  isMatched: boolean;
  position: number; // 0 to 15
}

export interface DifficultyConfig {
  name: Difficulty;
  label: string;
  mismatchDelayMs: number;
  previewDurationMs: number;
  description: string;
}

export type GamePhase =
  | 'idle'
  | 'previewing'
  | 'playing'
  | 'resolvingMismatch'
  | 'completed';

export interface GameState {
  sessionId: string;
  roundGeneration: number; // Token incremented on every round/restart to invalidate pending async callbacks
  seed: number;
  difficulty: Difficulty;
  deck: Card[];
  selectedCardIds: string[];
  matchedCardIds: string[];
  moves: number; // 1 move = 1 pair attempt
  pairsFound: number; // 0 to 8
  phase: GamePhase;
  startTime: number | null;
  elapsedMs: number;
  isTimerRunning: boolean;
  nextDifficulty: Difficulty;
  adaptationReason: string;
  isCompleted: boolean;
}

export type GameAction =
  | { type: 'INIT_GAME'; payload: { seed: number; difficulty: Difficulty; previewDurationMs?: number } }
  | { type: 'END_PREVIEW' }
  | { type: 'SELECT_CARD'; payload: { cardId: string; timestamp?: number } }
  | { type: 'RESOLVE_MATCH'; payload: { cardId1: string; cardId2: string } }
  | { type: 'RESOLVE_MISMATCH'; payload: { generation: number } }
  | { type: 'RESTART_GAME'; payload?: { seed?: number } }
  | { type: 'SET_DIFFICULTY'; payload: { difficulty: Difficulty; seed?: number } }
  | { type: 'TICK_TIMER'; payload: { elapsedMs: number } }
  | { type: 'COMPLETE_GAME'; payload: { nextDifficulty: Difficulty; adaptationReason: string } };

export interface SessionResult {
  id: string;
  timestamp: number;
  seed: number;
  difficulty: Difficulty;
  moves: number;
  matchedPairs: number;
  elapsedMs: number;
  nextDifficulty: Difficulty;
  adaptationReason: string;
  accuracyPercentage: number;
}

export interface HistoryStatistics {
  totalGames: number;
  bestMoves: number | null;
  bestTimeMs: number | null;
  averageMoves: number;
  averageTimeMs: number;
  difficultyDistribution: Record<Difficulty, number>;
  recentSessions: SessionResult[];
}
