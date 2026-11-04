const test = require('node:test');
const assert = require('node:assert/strict');
const { createManualDonationSchema } = require('../../backend/src/validations/donationValidation');
const { createManualDonation } = require('../../backend/src/services/donationService');
const {
  confirmManualDonation,
  rejectManualDonation
} = require('../../backend/src/services/manualDonationService');

const validSubmission = {
  amount: 250,
  donorName: 'Test Donor',
  donorEmail: 'donor@example.org',
  paymentReference: 'upi-ref-123456'
};

function makeDonation(overrides = {}) {
  return {
    id: 'donation-id',
    amount: '250.00',
    currency: 'INR',
    donor_name: 'Test Donor',
    donor_email: 'donor@example.org',
    donor_phone: null,
    donor_pan: null,
    donor_address: null,
    is_80g_claimed: false,
    status: 'PENDING',
    payment_method: 'UPI_QR',
    payment_reference: 'UPI-REF-123456',
    project_id: 'project-id',
    project_title: 'Test Project',
    created_at: '2026-11-02T00:00:00.000Z',
    receipt_number: null,
    ...overrides
  };
}

function makeTransactionDatabase(donation, { trustProfile = true, receiptCount = 0 } = {}) {
  const calls = [];
  const client = {
    query: async (sql, params = []) => {
      calls.push({ sql, params });
      if (sql.includes('SELECT d.*, p.title')) {
        return { rowCount: donation ? 1 : 0, rows: donation ? [{ ...donation }] : [] };
      }
      if (sql.includes('SELECT trust_name, pan')) {
        return { rowCount: trustProfile ? 1 : 0, rows: trustProfile ? [{
          trust_name: 'SECT',
          pan: 'AABTS1234C',
          address: 'Bhubaneswar',
          registration_no: 'SECT-001',
          exemption_80g_no: '80G-001'
        }] : [] };
      }
      if (sql.includes('COUNT(*) as count')) return { rowCount: 1, rows: [{ count: String(receiptCount) }] };
      return { rowCount: 1, rows: [] };
    },
    release: () => calls.push({ sql: 'RELEASE', params: [] })
  };

  return {
    calls,
    database: { getClient: async () => client }
  };
}

test('manual donation schema normalizes a valid UPI reference and requires PAN for 80G', () => {
  const parsed = createManualDonationSchema.safeParse({
    ...validSubmission,
    paymentReference: 'upi-ref-123456',
    require80G: false
  });
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.payment_reference, 'UPI-REF-123456');
  assert.equal(parsed.data.donor_email, 'donor@example.org');

  const missingPan = createManualDonationSchema.safeParse({ ...validSubmission, require80G: true });
  assert.equal(missingPan.success, false);
});

test('manual donation submission stays pending and duplicate references return a conflict', async () => {
  let insertedParams;
  const database = {
    query: async (_sql, params) => {
      insertedParams = params;
      return { rows: [{ id: 'donation-id', status: 'PENDING', payment_method: 'UPI_QR' }] };
    }
  };
  const parsed = createManualDonationSchema.parse(validSubmission);
  const result = await createManualDonation(parsed, null, database);
  assert.equal(result.status, 'PENDING');
  assert.equal(insertedParams[9], false);
  assert.equal(insertedParams[10], 'UPI-REF-123456');

  const duplicateDatabase = { query: async () => { throw Object.assign(new Error('duplicate'), { code: '23505' }); } };
  await assert.rejects(createManualDonation(parsed, null, duplicateDatabase), { statusCode: 409 });
});

test('admin confirmation is atomic and issues a receipt only for a pending UPI donation', async () => {
  const { calls, database } = makeTransactionDatabase(makeDonation());
  const auditEvents = [];
  const emails = [];
  const result = await confirmManualDonation({
    donationId: 'donation-id',
    adminUserId: 'admin-id',
    database,
    audit: (event) => auditEvents.push(event),
    sendReceiptEmail: (message) => emails.push(message)
  });

  assert.equal(result.status, 'COMPLETED');
  assert.match(result.receipt_number, /^SECT\/\d{4}-\d{2}\/\d{5}$/);
  assert.ok(calls.some(({ sql }) => sql.includes('INSERT INTO donation_receipts')));
  assert.ok(calls.some(({ sql }) => sql.includes('UPDATE projects')));
  assert.ok(calls.some(({ sql }) => sql === 'COMMIT'));
  assert.ok(!calls.some(({ sql }) => sql === 'ROLLBACK'));
  assert.equal(auditEvents[0].action, 'MANUAL_UPI_DONATION_CONFIRMED');
  assert.equal(emails[0].receiptNumber, result.receipt_number);
});

test('confirmation retry for an already completed donation does not issue another receipt', async () => {
  const { calls, database } = makeTransactionDatabase(makeDonation({
    status: 'COMPLETED',
    receipt_number: 'SECT/2026-27/00001'
  }));
  const result = await confirmManualDonation({ donationId: 'donation-id', adminUserId: 'admin-id', database });

  assert.equal(result.already_confirmed, true);
  assert.equal(result.receipt_number, 'SECT/2026-27/00001');
  assert.ok(!calls.some(({ sql }) => sql.includes('INSERT INTO donation_receipts')));
  assert.ok(!calls.some(({ sql }) => sql.includes('UPDATE projects')));
});

test('manual confirmation refuses non-UPI submissions and missing trust profile', async () => {
  const otherMethod = makeTransactionDatabase(makeDonation({ payment_method: 'RAZORPAY' }));
  await assert.rejects(
    confirmManualDonation({ donationId: 'donation-id', adminUserId: 'admin-id', database: otherMethod.database }),
    { statusCode: 400 }
  );

  const missingProfile = makeTransactionDatabase(makeDonation(), { trustProfile: false });
  await assert.rejects(
    confirmManualDonation({ donationId: 'donation-id', adminUserId: 'admin-id', database: missingProfile.database }),
    { statusCode: 503 }
  );
  assert.ok(missingProfile.calls.some(({ sql }) => sql === 'ROLLBACK'));
});

test('admin can reject only pending UPI submissions', async () => {
  const calls = [];
  const database = {
    query: async (_sql, params) => {
      calls.push(params);
      return { rowCount: 1, rows: [{ id: 'donation-id', status: 'FAILED', payment_reference: 'UPI-REF-123456', amount: '250' }] };
    }
  };
  const auditEvents = [];
  const result = await rejectManualDonation({
    donationId: 'donation-id',
    adminUserId: 'admin-id',
    database,
    audit: (event) => auditEvents.push(event)
  });

  assert.equal(result.status, 'FAILED');
  assert.deepEqual(calls[0], ['FAILED', 'donation-id', 'PENDING']);
  assert.equal(auditEvents[0].action, 'MANUAL_UPI_DONATION_REJECTED');
});