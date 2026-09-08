/**
 * HTTP Server Entry Point
 * Author: Suchitra (Backend & Database Developer)
 */

const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');
const logger = require('./config/logger');

const server = app.listen(config.port, async () => {
  logger.info(`SECT Backend API running on port ${config.port} [${config.nodeEnv}]`);
  logger.info(`Allowing CORS requests from: ${config.frontendUrl}`);

  // Test database connection
  const dbHealth = await db.testConnection();
  if (dbHealth.ok) {
    logger.info('PostgreSQL Database connected successfully.');
  } else {
    logger.warn('PostgreSQL Database connection warning: ' + dbHealth.error);
    logger.warn('Please check DATABASE_URL in backend/.env');
  }
});

// Graceful Shutdown
function handleShutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await db.pool.end();
    logger.info('Database pool drained. Exiting process.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;
