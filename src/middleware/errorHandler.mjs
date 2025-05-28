import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const errorLogPath = path.join(__dirname, '..', '..', 'logs', 'error.log');

export default async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  // Logga felet till konsolen
  console.error(`ERROR: ${err.name}: ${err.message}`);

  // Formatera felmeddelandet för loggfilen
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${err.statusCode} - ${err.name}: ${err.message}\n${err.stack}\n\n`;

  // Skriv till fellogg
  try {
    await fs.appendFile(errorLogPath, logMessage, 'utf-8');
  } catch (error) {
    console.error('Kunde inte skriva till fealloggen:', error);
  }

  // Skicka svar till klienten
  res.status(err.statusCode).json({
    success: err.success,
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
  });
};
