import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const errorLogPath = path.join(__dirname, '..', '..', 'logs', 'error.log');

export const logError = async (error) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${error.name}: ${error.message}\n${
    error.stack || ''
  }\n\n`;

  try {
    await fs.appendFile(errorLogPath, logMessage, 'utf-8');
    return true;
  } catch (err) {
    console.error('Kunde inte skriva till error log:', err);
    return false;
  }
};
