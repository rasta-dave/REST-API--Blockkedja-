import { GENESIS_BLOCK } from './genesis.mjs';
import { mineBlock, isValidProofOfWork } from '../utilities/proof-of-work.mjs';

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
    const { hash, nonce } = mineBlock(timestamp, lastHash, data, difficulty);

    return new this({
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
      difficulty,
    });
  }

  isValid() {
    if (this.hash === '#1') return true;

    return isValidProofOfWork(
      this.timestamp,
      this.lastHash,
      this.data,
      this.hash,
      this.nonce,
      this.difficulty
    );
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
