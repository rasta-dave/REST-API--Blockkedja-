import { describe, it, expect } from 'vitest';
import { mineBlock } from '../src/utilities/proof-of-work.mjs';

describe('Performance Tests', () => {
  it('should mine blocks within reasonable time limits', async () => {
    const startTime = Date.now();
    const timestamp = Date.now();
    const lastHash = 'test-hash';
    const data = { test: 'performance test' };
    const difficulty = 2;

    const { hash, nonce } = mineBlock(timestamp, lastHash, data, difficulty);
    const miningTime = Date.now() - startTime;

    expect(hash.substring(0, difficulty)).toBe('00');
    expect(nonce).toBeGreaterThan(0);
    expect(miningTime).toBeLessThan(5000); // Mindre än 5 sekunder
  });

  it('should handle multiple rapid mining operations', async () => {
    const results = [];

    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      const { hash, nonce } = mineBlock(
        Date.now(),
        `hash-${i}`,
        { test: i },
        2
      );
      const miningTime = Date.now() - startTime;

      results.push({ hash, nonce, miningTime });
    }

    results.forEach((result) => {
      expect(result.hash.substring(0, 2)).toBe('00');
      expect(result.nonce).toBeGreaterThan(0);
    });
  });
});
