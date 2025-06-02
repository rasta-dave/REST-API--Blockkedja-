import { describe, expect, it } from 'vitest';
import Block from '../src/models/block.mjs';
import { GENESIS_BLOCK } from '../src/models/genesis.mjs';
import { createHash } from '../src/utilities/hash.mjs';
import { isValidProofOfWork } from '../src/utilities/proof-of-work.mjs';

describe('Block', () => {
  const timestamp = new Date().toString();
  const currentHash = 'current-hash';
  const lastHash = 'prev-hash';
  const data = [1, 2, 3, 4, 5];
  const block = new Block({ hash: currentHash, timestamp, lastHash, data });

  describe('should have the correct properties', () => {
    it('should have a timestamp property', () => {
      expect(block).toHaveProperty('timestamp');
    });

    it('should have a hash property', () => {
      expect(block).toHaveProperty('hash');
    });

    it('should have a lastHash property', () => {
      expect(block).toHaveProperty('lastHash');
    });

    it('should have a data property', () => {
      expect(block).toHaveProperty('data');
    });
  });

  describe('should have its properties correct initialized', () => {
    it('should set a timestamp value', () => {
      expect(block.timestamp).not.toEqual(undefined);
    });

    it('should have a correct hash', () => {
      expect(block.hash).toEqual(currentHash);
    });

    it('should set the lastHash to the hash of previous block', () => {
      expect(block.lastHash).toEqual(lastHash);
    });

    it('should set the data property', () => {
      expect(block.data).toEqual(data);
    });

    it('should return an instance of the Block class', () => {
      expect(block instanceof Block).toBeTruthy();
    });
  });

  describe('genesis() function', () => {
    const genesisBlock = Block.genesis();

    it('should return an instance of the Block class', () => {
      expect(genesisBlock instanceof Block).toBeTruthy();
    });
    it('should return the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_BLOCK);
    });
  });

  describe('mineblock() function', () => {
    const previousBlock = Block.genesis();
    const data = [6, 7, 8, 9, 10];
    const minedBlock = Block.mineBlock({ previousBlock, data });

    it('should return an instance of class Block', () => {
      expect(minedBlock instanceof Block).toBeTruthy();
    });

    it('should set the lastHash to the hash of the previous block', () => {
      expect(minedBlock.lastHash).toEqual(previousBlock.hash);
    });

    it('should set the data', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('should set the timestamp', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('should create a valid proof-of-work hash', () => {
      expect(minedBlock.hash.substring(0, 2)).toBe('00');
      expect(minedBlock.nonce).toBeGreaterThan(0);
      expect(
        isValidProofOfWork(
          minedBlock.timestamp,
          previousBlock.hash,
          data,
          minedBlock.hash,
          minedBlock.nonce,
          minedBlock.difficulty
        )
      ).toBe(true);
    });
  });
});
