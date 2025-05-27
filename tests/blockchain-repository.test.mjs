import { describe, expect, beforeEach, afterEach, it } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import BlockchainRepository from '../src/repositories/blockchain-repository.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataPath = path.join(__dirname, '..', 'data', 'blockchain.json');

describe('BlockchainRepository', () => {
  let repository;

  beforeEach(async () => {
    // Rensa eventuell testfil före varje test
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      // Ignorera om filen inte existerar
      if (error.code !== 'ENOENT') throw error;
    }
    repository = new BlockchainRepository();
    await repository.initialize();
  });

  afterEach(async () => {
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  });

  it('should create a blockchain with genesis block', async () => {
    const chain = await repository.getChain();
    expect(chain.length).toBe(1);
    expect(chain[0].hash).toBe('#1');
  });

  it('should add a block to the chain', async () => {
    const testData = { test: 'data' };
    const newBlock = await repository.addBlock(testData);

    const chain = await repository.getChain();
    expect(chain.length).toBe(2);
    expect(chain[1].data).toEqual(testData);
  });

  it('should persist the chain to a file', async () => {
    await repository.addBlock({ test: 'persistence' });

    // Skapa en ny instans för att simulera en omstart av appen
    const newRepository = new BlockchainRepository();
    await newRepository.initialize();

    const chain = await newRepository.getChain();
    expect(chain.length).toBe(2);
    expect(chain[1].data).toEqual({ test: 'persistence' });
  });

  it('should retrieve a specific block by index', async () => {
    await repository.addBlock({ name: 'Block 1' });
    await repository.addBlock({ name: 'Block 2' });

    const block = await repository.getBlock(1);
    expect(block).not.toBeNull();
    expect(block.data).toEqual({ name: 'Block 1' });
  });

  it('should validate a valid chain', async () => {
    await repository.addBlock({ name: 'Valid Block' });
    const isValid = await repository.isChainValid();
    expect(isValid).toBe(true);
  });
});
