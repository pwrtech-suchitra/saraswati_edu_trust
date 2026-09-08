/**
 * PostgreSQL Database Connection Pool & Query Helpers
 * Author: Suchitra (Backend & Database Developer)
 */

const { Pool } = require('pg');
const config = require('./env');

const isProduction = config.nodeEnv === 'production';

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB Pool Unexpected Error]', err);
});

/**
 * Execute parameterized query safely
 * @param {string} text 
 * @param {Array} params 
 * @returns {Promise<any>}
 */
async function query(text, params = []) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.nodeEnv === 'development' && duration > 500) {
    console.warn(`[Slow Query] ${duration}ms: ${text}`);
  }
  return res;
}

/**
 * Acquire client for transactions
 * @returns {Promise<any>}
 */
async function getClient() {
  return await pool.connect();
}

/**
 * Test connectivity
 */
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as now');
    return { ok: true, timestamp: res.rows[0].now };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};
