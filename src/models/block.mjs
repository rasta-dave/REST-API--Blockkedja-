import { GENESIS_BLOCK } from './genesis.mjs';
import { createHash } from '../utilities/hash.mjs';

export default class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ previousBlock, data, difficulty = 2 }) {
    const timestamp = new Date().toString();
    const lastHash = previousBlock.hash;
    const hash = createHash(timestamp, lastHash, data);

    return new this({
      timestamp,
      lastHash,
      hash,
      data,
      nonce: 0,
      difficulty,
    });
  }

  isValid() {
    if (this.hash === '#1') return true;

    const validHash = createHash(this.timestamp, this.lastHash, this.data);
    return this.hash === validHash;
  }

  toString() {
    return `Block:
    Timestamp: ${this.timestamp}
    Last Hash: ${this.lastHash}
    Hash: ${this.hash}
    Nonce: ${this.nonce}
    Difficulty: ${this.difficulty}
    Data: ${JSON.stringify(this.data)}`;
  }
}
