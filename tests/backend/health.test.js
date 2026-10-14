/**
 * System Health Test
 * Author: Suchitra (Backend & Database Developer)
 */

const test = require('node:test');
const assert = require('node:assert');

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

test.after(async () => {
  const db = require('../../backend/src/config/db');
  await db.pool.end();
});
