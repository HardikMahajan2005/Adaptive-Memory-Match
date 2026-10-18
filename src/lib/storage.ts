import { SessionResult, Difficulty } from '@/game/types';

const STORAGE_KEY = 'cerevyn_ps09_session_history_v1';
const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * Validates a single session record to ensure it is not corrupt or malformed.
 */
function isValidSessionResult(obj: unknown): obj is SessionResult {
  if (!obj || typeof obj !== 'object') return false;
  const r = obj as Record<string, unknown>;

  return (
    typeof r.id === 'string' &&
    typeof r.timestamp === 'number' &&
    !isNaN(r.timestamp) &&
    typeof r.seed === 'number' &&
    typeof r.difficulty === 'string' &&
    VALID_DIFFICULTIES.includes(r.difficulty as Difficulty) &&
    typeof r.moves === 'number' &&
    r.moves >= 0 &&
    typeof r.matchedPairs === 'number' &&
    r.matchedPairs >= 0 &&
    r.matchedPairs <= 8 &&
    typeof r.elapsedMs === 'number' &&
    r.elapsedMs >= 0 &&
    typeof r.nextDifficulty === 'string' &&
    VALID_DIFFICULTIES.includes(r.nextDifficulty as Difficulty) &&
    typeof r.adaptationReason === 'string' &&
    typeof r.accuracyPercentage === 'number'
  );
}

/**
 * Safely loads session history from localStorage, discarding any corrupt records.
 */
export function loadSessionHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out corrupted or invalid records
    return parsed.filter(isValidSessionResult);
  } catch (error) {
    console.warn('Corrupted or inaccessible session storage encountered, resetting:', error);
    return [];
  }
}

/**
 * Saves a completed session result to localStorage anonymously.
 * Preserves the most recent 100 sessions.
 */
export function saveSessionResult(result: SessionResult): boolean {
  try {
    const history = loadSessionHistory();
    // Prevent duplicate entries of the exact same session ID
    if (history.some((item) => item.id === result.id)) {
      return true;
    }

    const updated = [result, ...history].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save game session to localStorage:', error);
    return false;
  }
}

/**
 * Clears all stored session history.
 */
export function clearSessionHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear session history:', error);
    return false;
  }
}
