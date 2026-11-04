/**
 * HTTP Server Entry Point
 * Author: Suchitra (Backend & Database Developer)
 */

// Railway's pre-deploy migration uses this credential; the running API must not.
delete process.env.MIGRATION_DATABASE_URL;

const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');
const logger = require('./config/logger');

async function startServer() {
  const dbHealth = await db.testConnection();
  if (dbHealth.ok) {
    logger.info(`Database connected successfully (${dbHealth.engine}).`);
  } else {
    logger.error(`Database connection failed: ${dbHealth.error}`);
    if (config.nodeEnv === 'production') {
      process.exitCode = 1;
      return null;
    }
    logger.warn('The API is starting without a healthy database connection.');
  }

  const server = app.listen(config.port, () => {
    logger.info(`SECT Backend API running on port ${config.port} [${config.nodeEnv}]`);
    logger.info(`Allowing CORS requests from: ${config.frontendUrl}`);
  });

  server.on('error', (error) => {
    logger.error('HTTP server failed to start.', error);
    process.exitCode = 1;
  });

  return server;
}

const serverPromise = startServer().catch((error) => {
  logger.error('Backend startup failed.', error);
  process.exitCode = 1;
  return null;
});

// Graceful Shutdown
async function handleShutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  const server = await serverPromise;
  if (!server) {
    await db.pool.end();
    return;
  }

  server.close(async () => {
    logger.info('HTTP server closed.');
    await db.pool.end();
    logger.info('Database pool drained. Exiting process.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => void handleShutdown('SIGTERM'));
process.on('SIGINT', () => void handleShutdown('SIGINT'));

module.exports = serverPromise;
