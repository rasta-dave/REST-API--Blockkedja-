import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Storage {
  #filePath = undefined;

  constructor(folder, filename) {
    this.#filePath = path.join(__dirname, '..', '..', folder, filename);
  }

  async readFromFile() {
    try {
      const content = await fs.readFile(this.#filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeToFile(data) {
    await fs.writeFile(this.#filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
