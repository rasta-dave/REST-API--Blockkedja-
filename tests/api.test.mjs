import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from '../src/app.mjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataPath = path.join(__dirname, '..', 'data', 'blockchain.json');

const request = supertest(app);

describe('Blockchain API', () => {
  beforeAll(async () => {
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  });

  afterAll(async () => {
    // Rensa testdata efter testerna
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      // Ignorera om filen inte existerar
      if (error.code !== 'ENOENT') throw error;
    }
  });

  it('should return the blockchain with genesis block', async () => {
    const response = await request.get('/api/v1/blockchain');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].hash).toBe('#1');
  });

  it('should add a new block to the blockchain', async () => {
    const testData = { message: 'Test block data' };
    const response = await request
      .post('/api/v1/blockchain')
      .send({ data: testData });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.data).toEqual(testData);

    const chainResponse = await request.get('/api/v1/blockchain');
    expect(chainResponse.body.data.length).toBe(2);
  });

  it('should return a specific block by index', async () => {
    const response = await request.get('/api/v1/blockchain/1');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.data).toEqual({ message: 'Test block data' });
  });

  it('should return 404 for non-existent block', async () => {
    const response = await request.get('/api/v1/blockchain/999');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('should validate the blockchain', async () => {
    const response = await request.get('/api/v1/blockchain/validate');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.isValid).toBe(true);
  });
});
