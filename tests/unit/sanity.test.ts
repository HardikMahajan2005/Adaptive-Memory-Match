import { describe, it, expect } from 'vitest';

describe('Sanity test', () => {
  it('verifies test environment is active and running', () => {
    expect(1 + 1).toBe(2);
  });
});
