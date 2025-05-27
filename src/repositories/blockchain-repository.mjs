import Storage from '../utilities/storage.mjs';
import Blockchain from '../models/blockchain.mjs';
import Block from '../models/block.mjs';

class BlockchainRepository {
  constructor() {
    this.storage = new Storage('data', 'blockchain.json');
    this.blockchain = null;
  }

  async initialize() {
    try {
      const data = await this.storage.readFromFile();
      if (data && data.length > 0) {
        this.blockchain = new Blockchain();
        this.blockchain.chain = data;
      } else {
        this.blockchain = new Blockchain();
        await this.storage.writeToFile(this.blockchain.chain);
      }
    } catch (error) {
      this.blockchain = new Blockchain();
      await this.storage.writeToFile(this.blockchain.chain);
    }
  }

  async getChain() {
    return this.blockchain.chain;
  }

  async getBlock(index) {
    if (index >= 0 && index < this.blockchain.chain.length) {
      return this.blockchain.chain[index];
    }
    return null;
  }

  async addBlock(data) {
    const newBlock = this.blockchain.addBlock({ data });
    await this.storage.writeToFile(this.blockchain.chain);
    return newBlock;
  }

  async isChainValid() {
    return Blockchain.isValid(this.blockchain.chain);
  }
}

export default BlockchainRepository;
