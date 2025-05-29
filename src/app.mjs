import express from 'express';
import dotenv from 'dotenv';
import { logger } from './middleware/logger.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import errorHandler from './middleware/errorHandler.mjs';
import AppError from './models/appError.mjs';

dotenv.config({ path: './config/settings.env' });

// Skapa Express app
const app = express();

// Middleware för att parsa JSON
app.use(express.json());

// Använd logger om vi är i utvecklingsmiljö
if (process.env.NODE_ENV === 'development') {
  app.use(logger);
}

// Basväg för API
app.use('/api/v1/blockchain', blockchainRouter);

// Hantera 404 för okända routes
app.all('*', (req, res, next) => {
  next(
    new AppError(`Det gick inte att hitta ${req.originalUrl} på servern.`, 404)
  );
});

// Centralisera felhantering
app.use(errorHandler);

export { app };
