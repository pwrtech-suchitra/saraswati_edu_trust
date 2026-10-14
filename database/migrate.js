/**
 * Standalone Database Migration & Seeder Runner
 * Uses Adaptive PostgreSQL Connection (External Pool or Persistent PGlite)
 * Author: Suchitra (Backend & Database Developer)
 */

const fs = require('fs');
const path = require('path');
const db = require('../backend/src/config/db');

async function runMigrations() {
  const client = await db.getClient();
  console.log('[Migration] Database client acquired...');

  try {
    // 1. Create migration history tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Read migration files in alphabetical order
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const checkRes = await client.query('SELECT id FROM schema_migrations WHERE filename = $1', [file]);
      if (checkRes.rowCount === 0) {
        console.log(`[Migration] Executing: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        await (client.exec ? client.exec(sql) : client.query(sql));
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        console.log(`[Migration] Completed: ${file}`);
      } else {
        console.log(`[Migration] Skipped (already applied): ${file}`);
      }
    }

    // 3. Run seeds if flag is provided
    if (process.argv.includes('--seed')) {
      console.log('[Migration] Running seed scripts...');
      const seedsDir = path.join(__dirname, 'seeds');
      const seedFiles = fs.readdirSync(seedsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

      for (const file of seedFiles) {
        console.log(`[Seed] Executing: ${file}`);
        const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
        await (client.exec ? client.exec(sql) : client.query(sql));
        console.log(`[Seed] Completed: ${file}`);
      }
    }

    console.log('[Migration] All migrations executed successfully!');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[Migration Error]', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
