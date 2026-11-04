/**
 * System Health Test
 * Author: Suchitra (Backend & Database Developer)
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const testDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sect-health-'));
process.env.USE_EMBEDDED_DB = 'true';
process.env.PGLITE_DATA_DIR = testDataDir;

test('Health controller format test', async () => {
  const req = {};
  let capturedStatus = 200;
  let capturedBody = null;

  const res = {
    status: (code) => {
      capturedStatus = code;
      return res;
    },
    json: (data) => {
      capturedBody = data;
      return res;
    }
  };

  const healthController = require('../../backend/src/controllers/healthController');
  await healthController.getHealth(req, res);

  assert.ok(capturedBody !== null);
  assert.strictEqual(typeof capturedBody.success, 'boolean');
  assert.ok(capturedBody.message);
});

test('Liveness check succeeds without querying the database', () => {
  let capturedStatus = 200;
  let capturedBody = null;
  const res = {
    status: (code) => {
      capturedStatus = code;
      return res;
    },
    json: (data) => {
      capturedBody = data;
      return res;
    }
  };

  const healthController = require('../../backend/src/controllers/healthController');
  healthController.getLiveness({}, res);

  assert.equal(capturedStatus, 200);
  assert.equal(capturedBody.success, true);
  assert.equal(capturedBody.data.status, 'UP');
  assert.equal('database' in capturedBody.data, false);
});

test('Readiness returns 503 without leaking database errors in production', async (t) => {
  const db = require('../../backend/src/config/db');
  const originalNodeEnv = process.env.NODE_ENV;
  const originalTestConnection = db.testConnection;
  process.env.NODE_ENV = 'production';
  db.testConnection = async () => ({ ok: false, error: 'private database endpoint details' });
  t.after(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    db.testConnection = originalTestConnection;
  });

  let capturedStatus = 200;
  let capturedBody = null;
  const res = {
    status: (code) => {
      capturedStatus = code;
      return res;
    },
    json: (data) => {
      capturedBody = data;
      return res;
    }
  };

  const healthController = require('../../backend/src/controllers/healthController');
  await healthController.getHealth({}, res);

  assert.equal(capturedStatus, 503);
  assert.equal(capturedBody.success, false);
  assert.deepEqual(capturedBody.errors, []);
  assert.doesNotMatch(JSON.stringify(capturedBody), /private database endpoint details/);
});

test.after(async () => {
  const db = require('../../backend/src/config/db');
  await db.pool.end();
  fs.rmSync(testDataDir, { recursive: true, force: true });
});
