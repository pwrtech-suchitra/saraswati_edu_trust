/**
 * PostgreSQL Database Connection (Adaptive: External PostgreSQL or Persistent PGlite)
 * Stored in: database/pgdata for persistent disk storage
 * Author: Suchitra (Backend & Database Developer)
 */

const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { PGlite } = require('@electric-sql/pglite');
const config = require('./env');

const isProduction = config.nodeEnv === 'production';
const pgDataDir = path.resolve(__dirname, '../../../database/pgdata');

// Ensure pgdata dir exists
if (!fs.existsSync(pgDataDir)) {
  fs.mkdirSync(pgDataDir, { recursive: true });
}

let activeEngine = null; // 'pg' or 'pglite'
let pgPool = null;
let pgliteInstance = null;
let initPromise = null;

async function getEngine() {
  if (activeEngine) return activeEngine;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // 1. If explicit embedded mode is not requested, attempt external PostgreSQL
    if (process.env.USE_EMBEDDED_DB !== 'true') {
      let pool = null;
      try {
        pool = new Pool({
          connectionString: config.databaseUrl,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          connectionTimeoutMillis: 1500,
        });

        // Quick connection test
        const testClient = await pool.connect();
        await testClient.query('SELECT 1');
        testClient.release();

        pgPool = pool;
        activeEngine = 'pg';
        console.log('[DB] Connected to external PostgreSQL database via Pool');
        return 'pg';
      } catch (err) {
        if (pool) {
          await pool.end().catch(() => {});
        }
        console.log(`[DB] External PostgreSQL not reachable (${err.message}). Using persistent disk-backed PostgreSQL engine...`);
      }
    }

    // 2. Initialize persistent PGlite PostgreSQL database
    pgliteInstance = new PGlite(pgDataDir);
    activeEngine = 'pglite';
    console.log(`[DB] Persistent PostgreSQL engine initialized at: ${pgDataDir}`);
    return 'pglite';
  })();

  return initPromise;
}

/**
 * Execute SQL statement or multiple statements
 * @param {string} text 
 * @param {Array} params 
 * @returns {Promise<any>}
 */
async function query(text, params = []) {
  const engine = await getEngine();
  const start = Date.now();

  let res;
  if (engine === 'pg') {
    res = await pgPool.query(text, params);
  } else {
    // If no params and contains multiple statements or DDL script, use exec()
    if ((!params || params.length === 0) && (text.includes(';') || text.trim().startsWith('--'))) {
      const execRes = await pgliteInstance.exec(text);
      if (Array.isArray(execRes) && execRes.length > 0) {
        res = execRes[execRes.length - 1];
      } else {
        res = execRes || { rows: [], rowCount: 0 };
      }
    } else {
      res = await pgliteInstance.query(text, params);
    }
  }

  const duration = Date.now() - start;
  if (config.nodeEnv === 'development' && duration > 500) {
    console.warn(`[Slow Query] ${duration}ms: ${text}`);
  }
  return res;
}

/**
 * Direct multi-statement execution helper (ideal for migrations and seeds)
 * @param {string} sql 
 * @returns {Promise<any>}
 */
async function exec(sql) {
  const engine = await getEngine();
  if (engine === 'pg') {
    return await pgPool.query(sql);
  } else {
    return await pgliteInstance.exec(sql);
  }
}

/**
 * Acquire client for transactions
 * @returns {Promise<any>}
 */
async function getClient() {
  const engine = await getEngine();
  if (engine === 'pg') {
    return await pgPool.connect();
  }

  // PGlite transactional client wrapper
  return {
    query: async (text, params = []) => {
      return await query(text, params);
    },
    exec: async (sql) => {
      return await exec(sql);
    },
    release: () => {
      // no-op for embedded pglite
    }
  };
}

/**
 * Test connectivity
 */
async function testConnection() {
  try {
    const engine = await getEngine();
    const res = await query('SELECT NOW() as now');
    return { ok: true, timestamp: res.rows[0].now, engine };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

const poolProxy = {
  query,
  exec,
  connect: getClient,
  end: async () => {
    if (pgPool) await pgPool.end();
    if (pgliteInstance) await pgliteInstance.close();
  }
};

module.exports = {
  pool: poolProxy,
  query,
  exec,
  getClient,
  testConnection,
  getEngine
};
