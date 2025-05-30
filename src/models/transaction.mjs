export default class Transaction {
  constructor({ from, to, amount, description, timestamp = Date.now() }) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.description = description;
    this.timestamp = timestamp;
    this.id = this.generateId();
  }

  generateId() {
    return `${this.from}-${this.to}-${this.timestamp}`;
  }

  isValid() {
    if (!this.from || !this.to) return false;
    if (this.amount <= 0) return false;
    if (this.from === this.to) return false;
    return true;
  }

  toString() {
    return `Transaction: ${this.from} -> ${this.to}: ${this.amount}`;
  }

  toJSON() {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      amount: this.amount,
      description: this.description,
      timestamp: this.timestamp,
    };
  }
}
