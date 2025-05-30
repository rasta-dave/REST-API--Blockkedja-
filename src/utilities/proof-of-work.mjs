import crypto from 'crypto';

export const createHash = (...args) => {
  const hash = crypto.createHash('sha256');
  hash.update(args.sort().join(' '));
  return hash.digest('hex');
};

export const mineBlock = (timestamp, lastHash, data, difficulty = 2) => {
  let nonce = 0;
  let hash;

  do {
    nonce++;
    hash = createHash(timestamp, lastHash, JSON.stringify(data), nonce);
  } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

  return {
    hash,
    nonce,
  };
};

export const isValidProofOfWork = (
  timestamp,
  lastHash,
  data,
  hash,
  nonce,
  difficulty = 2
) => {
  const validHash = createHash(
    timestamp,
    lastHash,
    JSON.stringify(data),
    nonce
  );
  return (
    validHash === hash &&
    hash.substring(0, difficulty) === '0'.repeat(difficulty)
  );
};
