/**
 * Trust Profile Database Persistence Tests
 * Validates that all PDF statutory & mission particulars are served directly from PostgreSQL
 * Author: Antigravity & Suchitra
 */

const test = require('node:test');
const assert = require('node:assert');
const db = require('../../backend/src/config/db');
const trustProfileController = require('../../backend/src/controllers/trustProfileController');

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
  return res;
}

test('getTrustProfile loads authentic PDF trust data directly from database', async () => {
  const req = {};
  const res = createMockRes();

  await trustProfileController.getTrustProfile(req, res, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  const data = res.body.data;
  assert.strictEqual(data.trust_name, 'Saraswati Educational & Charitable Trust');
  assert.strictEqual(data.pan, 'ABBTS7158P');
  assert.strictEqual(data.account_number, undefined);
  assert.strictEqual(data.bank_name, undefined);
  assert.strictEqual(data.branch_name, undefined);
  assert.strictEqual(data.ifsc_code, undefined);
  assert.strictEqual(data.pincode, '751029');
});

test('getActivityPillars returns all 4 pillars and 27 mandates from database', async () => {
  const req = {};
  const res = createMockRes();

  await trustProfileController.getActivityPillars(req, res, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  const pillars = Array.isArray(res.body.data) ? res.body.data : res.body.data.pillars;
  assert.strictEqual(Array.isArray(pillars), true);
  assert.strictEqual(pillars.length, 4);

  const totalMandates = pillars.reduce((sum, p) => sum + (p.mandates ? p.mandates.length : 0), 0);
  assert.strictEqual(totalMandates, 27);
});

test('getMissionSustainableIndia returns 5Ps, 6th P, and strategic highlights from database', async () => {
  const req = {};
  const res = createMockRes();

  await trustProfileController.getMissionSustainableIndia(req, res, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  const msi = res.body.data;
  assert.strictEqual(msi.start_date, '2022-08-15');
  assert.strictEqual(Array.isArray(msi.five_ps), true);
  assert.strictEqual(msi.five_ps.length, 5);
  assert.ok(msi.sixth_p);
  assert.strictEqual(Array.isArray(msi.highlights), true);
  assert.strictEqual(msi.highlights.length, 7);
});

test.after(async () => {
  await db.pool.end();
});
