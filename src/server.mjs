import { app } from './app.mjs';
import { logError } from './utilities/error-logger.mjs';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `Servern är igång på port ${PORT} i ${process.env.NODE_ENV} läge`
  );
});

process.on('unhandledRejection', (error) => {
  console.error('OHANTERAT LÖFTE:', error.name, error.message);
  logError(error);

  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.error('OHANTERAT UNDANTAG:', error.name, error.message);
  logError(error);

  process.exit(1);
});
