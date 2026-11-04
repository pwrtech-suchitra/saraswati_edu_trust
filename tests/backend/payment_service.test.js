const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../../backend/src/config/db');
const config = require('../../backend/src/config/env');
const paymentService = require('../../backend/src/services/paymentService');

test('production donation orders are created by Razorpay before being persisted', async (t) => {
  const originalFetch = global.fetch;
  const originalQuery = db.query;
  const originalNodeEnv = config.nodeEnv;
  const originalKeyId = config.payment.keyId;
  const originalKeySecret = config.payment.keySecret;
  let insertedValues;

  t.after(() => {
    global.fetch = originalFetch;
    db.query = originalQuery;
    config.nodeEnv = originalNodeEnv;
    config.payment.keyId = originalKeyId;
    config.payment.keySecret = originalKeySecret;
  });

  config.nodeEnv = 'production';
  config.payment.keyId = 'rzp_live_unit_test';
  config.payment.keySecret = 'unit-test-secret';
  global.fetch = async (url, options) => {
    assert.strictEqual(url, 'https://api.razorpay.com/v1/orders');
    assert.strictEqual(options.method, 'POST');
    assert.match(options.headers.Authorization, /^Basic /);
    assert.strictEqual(options.signal.aborted, false);

    const requestBody = JSON.parse(options.body);
    assert.deepStrictEqual(requestBody, {
      amount: 250000,
      currency: 'INR',
      receipt: 'donation-123',
      notes: { donation_id: 'donation-123' }
    });

    return {
      ok: true,
      json: async () => ({
        id: 'order_rzp_123',
        amount: 250000,
        currency: 'INR'
      })
    };
  };
  db.query = async (query, values) => {
    assert.match(query, /INSERT INTO payment_orders/);
    insertedValues = values;
    return { rows: [] };
  };

  const order = await paymentService.createPaymentOrder({
    id: 'donation-123',
    amount: '2500.00',
    currency: 'INR'
  });

  assert.deepStrictEqual(order, {
    order_id: 'order_rzp_123',
    orderId: 'order_rzp_123',
    amount: 250000,
    currency: 'INR',
    key_id: 'rzp_live_unit_test',
    key: 'rzp_live_unit_test'
  });
  assert.deepStrictEqual(insertedValues, [
    'donation-123',
    'order_rzp_123',
    'RAZORPAY',
    250000,
    'INR',
    'CREATED'
  ]);
});

test('production gateway errors do not persist a fake payment order', async (t) => {
  const originalFetch = global.fetch;
  const originalQuery = db.query;
  const originalNodeEnv = config.nodeEnv;
  let databaseWrites = 0;

  t.after(() => {
    global.fetch = originalFetch;
    db.query = originalQuery;
    config.nodeEnv = originalNodeEnv;
  });

  config.nodeEnv = 'production';
  global.fetch = async () => ({
    ok: false,
    json: async () => ({ error: { description: 'private gateway response' } })
  });
  db.query = async () => {
    databaseWrites += 1;
    return { rows: [] };
  };

  await assert.rejects(
    paymentService.createPaymentOrder({
      id: 'donation-456',
      amount: 500,
      currency: 'INR'
    }),
    (error) => error.statusCode === 502 && !error.message.includes('private gateway response')
  );
  assert.strictEqual(databaseWrites, 0);
});

test('invalid webhooks are rejected in development before reading payment data', async (t) => {
  const originalQuery = db.query;
  const originalWebhookSecret = config.payment.webhookSecret;
  let databaseReads = 0;

  t.after(() => {
    db.query = originalQuery;
    config.payment.webhookSecret = originalWebhookSecret;
  });

  config.payment.webhookSecret = 'unit-test-webhook-secret';
  db.query = async () => {
    databaseReads += 1;
    return { rows: [] };
  };

  await assert.rejects(
    paymentService.processGatewayWebhook({
      rawBody: '{"event":"payment.captured"}',
      signature: 'invalid-signature',
      payload: { event: 'payment.captured' }
    }),
    (error) => error.statusCode === 400 && error.message === 'Invalid webhook signature.'
  );
  assert.strictEqual(databaseReads, 0);
});
