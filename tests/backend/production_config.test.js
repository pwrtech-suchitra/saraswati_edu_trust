const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const configPath = path.join(__dirname, '../../backend/src/config/env.js');
const dbPath = path.join(__dirname, '../../backend/src/config/db.js');
const serverPath = path.join(__dirname, '../../backend/src/server.js');
const appPath = path.join(__dirname, '../../backend/src/app.js');
const validProductionEnvironment = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://db.example.test/sect',
  USE_EMBEDDED_DB: 'false',
  JWT_SECRET: 'a'.repeat(40),
  JWT_REFRESH_SECRET: 'b'.repeat(40),
  PAYMENT_KEY_ID: 'rzp_live_sect_482a9',
  PAYMENT_KEY_SECRET: 'c'.repeat(32),
  PAYMENT_WEBHOOK_SECRET: 'd'.repeat(40),
  FRONTEND_URL: 'https://sect.example.test'
};

function loadProductionConfig(overrides = {}) {
  const env = {
    ...process.env,
    ...validProductionEnvironment,
    ...overrides
  };
  const result = spawnSync(process.execPath, ['-e', `require(${JSON.stringify(configPath)})`], {
    env,
    encoding: 'utf8'
  });

  assert.ifError(result.error);
  return result;
}

test('production configuration accepts complete production settings', () => {
  const result = loadProductionConfig();

  assert.strictEqual(result.status, 0, result.stderr);
});

test('production configuration accepts QR-only donations without gateway credentials', () => {
  const result = loadProductionConfig({
    PAYMENT_KEY_ID: '',
    PAYMENT_KEY_SECRET: '',
    PAYMENT_WEBHOOK_SECRET: ''
  });

  assert.strictEqual(result.status, 0, result.stderr);
});

test('production configuration rejects placeholder authentication secrets', () => {
  const result = loadProductionConfig({
    JWT_SECRET: 'change_me_to_a_long_secret_value_123456',
    JWT_REFRESH_SECRET: 'b'.repeat(40)
  });

  assert.notStrictEqual(result.status, 0);
  assert.match(result.stderr, /JWT_SECRET must be a non-placeholder value/);
});

test('production configuration rejects embedded databases and configured non-live payment keys', () => {
  const result = loadProductionConfig({
    USE_EMBEDDED_DB: 'true',
    PAYMENT_KEY_ID: 'rzp_test_examplekey'
  });

  assert.notStrictEqual(result.status, 0);
  assert.match(result.stderr, /USE_EMBEDDED_DB cannot be enabled in production/);
  assert.match(result.stderr, /PAYMENT_KEY_ID must be a live Razorpay key when gateway settings are configured/);
});

test('production configuration requires HTTPS for the frontend origin', () => {
  const result = loadProductionConfig({
    FRONTEND_URL: 'http://sect.example.test'
  });

  assert.notStrictEqual(result.status, 0);
  assert.match(result.stderr, /FRONTEND_URL must use HTTPS in production/);
});

test('production configuration rejects invalid trusted proxy hop counts', () => {
  const result = loadProductionConfig({ TRUST_PROXY_HOPS: '0' });

  assert.notStrictEqual(result.status, 0);
  assert.match(result.stderr, /TRUST_PROXY_HOPS must be an integer between 1 and 5/);
});

test('production Express app trusts the configured proxy chain', () => {
  const env = {
    ...process.env,
    ...validProductionEnvironment,
    TRUST_PROXY_HOPS: '2'
  };
  const result = spawnSync(
    process.execPath,
    ['-e', `process.stdout.write(String(require(${JSON.stringify(appPath)}).get('trust proxy')))`],
    { env, encoding: 'utf8' }
  );

  assert.ifError(result.error);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.strictEqual(result.stdout, '2');
});

test('production database failures do not initialize embedded storage', () => {
  const embeddedDataDir = path.join(os.tmpdir(), `sect-production-db-${process.pid}`);
  const env = {
    ...process.env,
    ...validProductionEnvironment,
    DATABASE_URL: 'postgresql://127.0.0.1:1/sect',
    PGLITE_DATA_DIR: embeddedDataDir
  };
  env.USE_EMBEDDED_DB = 'false';

  const script = [
    `const db = require(${JSON.stringify(dbPath)});`,
    `db.testConnection().then(async health => {`,
    `  await db.pool.end();`,
    `  if (health.ok) process.exitCode = 1;`,
    `  else console.log(health.error);`,
    `});`
  ].join('\n');
  const result = spawnSync(process.execPath, ['-e', script], {
    env,
    encoding: 'utf8',
    timeout: 10000
  });

  assert.ifError(result.error);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.match(result.stdout, /refusing to use an embedded database in production/);
  assert.strictEqual(fs.existsSync(embeddedDataDir), false);
});

test('production server does not listen when PostgreSQL is unavailable', () => {
  const env = {
    ...process.env,
    ...validProductionEnvironment,
    DATABASE_URL: 'postgresql://127.0.0.1:1/sect',
    PORT: '0'
  };
  env.USE_EMBEDDED_DB = 'false';

  const result = spawnSync(process.execPath, [serverPath], {
    env,
    encoding: 'utf8',
    timeout: 10000
  });

  assert.ifError(result.error);
  assert.strictEqual(result.status, 1, result.stderr);
  assert.doesNotMatch(result.stdout, /SECT Backend API running on port/);
});
