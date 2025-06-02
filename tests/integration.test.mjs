import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import { app } from '../src/app.mjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataPath = path.join(__dirname, '..', 'data', 'blockchain.json');

const request = supertest(app);

describe('Blockchain API Integration Tests', () => {
  beforeAll(async () => {
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  });

  afterAll(async () => {
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  });

  describe('Full Blockchain Workflow', () => {
    it('should complete a full blockchain workflow', async () => {
      // 1. Hämta initial blockchain (endast genesis)
      const initialResponse = await request.get('/api/v1/blockchain');
      expect(initialResponse.status).toBe(200);
      expect(initialResponse.body.data.length).toBe(1);
      expect(initialResponse.body.data[0].hash).toBe('#1');

      // 2. Lägg till en vanlig transaktion
      const transactionData = {
        from: 'Alice',
        to: 'Bob',
        amount: 100,
        description: 'Payment for consulting services',
      };

      const transactionResponse = await request
        .post('/api/v1/blockchain/transaction')
        .send(transactionData);

      expect(transactionResponse.status).toBe(201);
      expect(transactionResponse.body.success).toBe(true);
      expect(transactionResponse.body.data.data.from).toBe('Alice');
      expect(transactionResponse.body).toHaveProperty('miningTime');

      // 3. Lägg till ett vanligt block
      const blockData = {
        data: { type: 'system', message: 'System maintenance completed' },
      };

      const blockResponse = await request
        .post('/api/v1/blockchain')
        .send(blockData);

      expect(blockResponse.status).toBe(201);
      expect(blockResponse.body.success).toBe(true);

      // 4. Hämta uppdaterad blockchain
      const updatedResponse = await request.get('/api/v1/blockchain');
      expect(updatedResponse.status).toBe(200);
      expect(updatedResponse.body.data.length).toBe(3);
      expect(updatedResponse.body.length).toBe(3);

      // 5. Hämta specifikt block
      const blockResponse2 = await request.get('/api/v1/blockchain/1');
      expect(blockResponse2.status).toBe(200);
      expect(blockResponse2.body.data.data.from).toBe('Alice');

      // 6. Validera kedjan
      const validationResponse = await request.get(
        '/api/v1/blockchain/validate'
      );
      expect(validationResponse.status).toBe(200);
      expect(validationResponse.body.isValid).toBe(true);
    });

    it('should handle multiple transactions in sequence', async () => {
      const transactions = [
        {
          from: 'Charlie',
          to: 'David',
          amount: 50,
          description: 'Lunch payment',
        },
        {
          from: 'Eve',
          to: 'Frank',
          amount: 200,
          description: 'Freelance work',
        },
        {
          from: 'Grace',
          to: 'Henry',
          amount: 75,
          description: 'Book purchase',
        },
      ];

      for (const transaction of transactions) {
        const response = await request
          .post('/api/v1/blockchain/transaction')
          .send(transaction);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      }

      const finalResponse = await request.get('/api/v1/blockchain');
      expect(finalResponse.body.data.length).toBe(6); // Genesis + tidigare 2 + nya 3
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle invalid transaction data', async () => {
      const invalidTransaction = {
        from: 'Alice',
        amount: -100,
      };

      const response = await request
        .post('/api/v1/blockchain/transaction')
        .send(invalidTransaction);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle invalid block index', async () => {
      const response = await request.get('/api/v1/blockchain/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should handle missing data in block creation', async () => {
      const response = await request.post('/api/v1/blockchain').send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Proof of Work Integration', () => {
    it('should create blocks with valid proof of work', async () => {
      const response = await request
        .post('/api/v1/blockchain')
        .send({ data: { test: 'proof of work test' } });

      expect(response.status).toBe(201);
      expect(response.body.data.hash.substring(0, 2)).toBe('00');
      expect(response.body.data.nonce).toBeGreaterThan(0);
    });
  });
});
