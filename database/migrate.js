/**
 * Standalone Database Migration & Seeder Runner
 * Uses Adaptive PostgreSQL Connection (External Pool or Persistent PGlite)
 * Author: Suchitra (Backend & Database Developer)
 */

const fs = require('fs');
const path = require('path');
const db = require('../backend/src/config/db');

const destructiveSeedTables = {
  '004_projects_seed.sql': ['projects', 'project_images', 'project_updates'],
  '005_news_and_events_seed.sql': ['news_articles', 'events', 'event_registrations'],
  '006_documents_and_media_seed.sql': ['documents', 'media_files'],
  '007_trust_profile_seed.sql': ['trust_profile'],
  '008_donations_seed.sql': [
    'donations',
    'donation_receipts',
    'payment_transactions',
    'payment_orders'
  ]
};

async function shouldSkipSeed(file, client) {
  const tables = destructiveSeedTables[file] || [];

  for (const table of tables) {
    const result = await client.query(
      `SELECT EXISTS (SELECT 1 FROM ${table} LIMIT 1) AS has_data`
    );
    if (result.rows[0].has_data) {
      console.warn(`[Seed] Skipping ${file}; ${table} already contains data.`);
      return true;
    }
  }

  return false;
}

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
        if (await shouldSkipSeed(file, client)) {
          continue;
        }
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

module.exports = { runMigrations, shouldSkipSeed };
