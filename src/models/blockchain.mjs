import Block from './block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      previousBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
    return newBlock;
  }

  static isValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const previousBlock = chain[i - 1];

      if (block.lastHash !== previousBlock.hash) {
        return false;
      }

      const validHash = Block.mineBlock({
        previousBlock: previousBlock,
        data: block.data,
      }).hash;

      if (block.hash !== validHash) {
        return false;
      }
    }

    return true;
  }
}
