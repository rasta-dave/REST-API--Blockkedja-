import { describe, it, expect } from 'vitest';
import Transaction from '../src/models/transaction.mjs';

describe('Transaction', () => {
  const validTransaction = new Transaction({
    from: 'Alice',
    to: 'Bob',
    amount: 100,
    description: 'Payment for services',
  });

  describe('Constructor', () => {
    it('should create a transaction with all properties', () => {
      expect(validTransaction).toHaveProperty('from');
      expect(validTransaction).toHaveProperty('to');
      expect(validTransaction).toHaveProperty('amount');
      expect(validTransaction).toHaveProperty('description');
      expect(validTransaction).toHaveProperty('timestamp');
      expect(validTransaction).toHaveProperty('id');
    });

    it('should generate a unique ID', () => {
      expect(validTransaction.id).toBeTruthy();
      expect(validTransaction.id).toContain('Alice');
      expect(validTransaction.id).toContain('Bob');
    });
  });

  describe('Validation', () => {
    it('should validate a correct transaction', () => {
      expect(validTransaction.isValid()).toBe(true);
    });

    it('should invalidate transaction without from', () => {
      const invalidTransaction = new Transaction({
        to: 'Bob',
        amount: 100,
      });
      expect(invalidTransaction.isValid()).toBe(false);
    });

    it('should invalidate transaction with negative amount', () => {
      const invalidTransaction = new Transaction({
        from: 'Alice',
        to: 'Bob',
        amount: -100,
      });
      expect(invalidTransaction.isValid()).toBe(false);
    });

    it('should invalidate transaction to same person', () => {
      const invalidTransaction = new Transaction({
        from: 'Alice',
        to: 'Alice',
        amount: 100,
      });
      expect(invalidTransaction.isValid()).toBe(false);
    });
  });
});
