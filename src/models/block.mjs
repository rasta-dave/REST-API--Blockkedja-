import { GENESIS_BLOCK } from './genesis.mjs';
import { createHash } from '../utilities/hash.mjs';

export default class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ previousBlock, data }) {
    const timestamp = new Date().toString();
    const lastHash = previousBlock.hash;
    const hash = createHash(timestamp, lastHash, data);

    return new this({
      timestamp,
      lastHash,
      hash,
      data,
    });
  }
}
