import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, '..', '..', 'logs', 'access.log');

export const logger = async (req, res, next) => {
  const timestamp = new Date().toISOString();
  const message = `${timestamp} - ${req.method} ${req.originalUrl}`;

  console.log(message);

  try {
    await fs.appendFile(logFilePath, message + '\n', 'utf-8');
  } catch (error) {
    console.error('Error writing to log file:', error);
  }

  next();
};
