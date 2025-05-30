import { createHash } from '../utilities/proof-of-work.mjs';
import Block from './block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
    this.difficulty = 2;
  }

  addBlock({ data }) {
    const addedBlock = Block.mineBlock({
      previousBlock: this.chain[this.chain.length - 1],
      data,
      difficulty: this.difficulty,
    });

    this.chain.push(addedBlock);
    return addedBlock;
  }

  static isValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (currentBlock.lastHash !== previousBlock.hash) return false;
      if (!currentBlock.isValid()) return false;
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Den nya kedjan måste vara längre');
      return false;
    }

    if (!Blockchain.isValid(newChain)) {
      console.log('Den nya kedjan måste vara giltig');
      return false;
    }

    console.log('Ersätter blockkedjan');
    this.chain = newChain;
    return true;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  getBlockByIndex(index) {
    if (index >= 0 && index < this.chain.length) {
      return this.chain[index];
    }

    return null;
  }
}
