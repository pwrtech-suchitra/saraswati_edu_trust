/**
 * Webhook Cryptographic Verification Test
 * Author: Suchitra (Backend & Database Developer)
 */

const test = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const { verifyPaymentSignature, verifyWebhookSignature } = require('../../backend/src/utils/signatureHelper');

test('verifyPaymentSignature accepts valid Razorpay signature', () => {
  const orderId = 'order_test_123';
  const paymentId = 'pay_test_456';
  const secret = 'my_super_secret_webhook_key';

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = verifyPaymentSignature({
    orderId,
    paymentId,
    signature: expectedSignature,
    secret
  });

  assert.strictEqual(isValid, true, 'Valid signature must return true');
});

test('verifyPaymentSignature rejects tampered or fraudulent signature', () => {
  const isValid = verifyPaymentSignature({
    orderId: 'order_test_123',
    paymentId: 'pay_test_456',
    signature: 'fake_tampered_signature_string_here',
    secret: 'my_super_secret_webhook_key'
  });

  assert.strictEqual(isValid, false, 'Invalid signature must return false');
});

test('verifyWebhookSignature verifies raw webhook payload', () => {
  const secret = 'whsec_test_secret';
  const rawBody = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_123' } } } });

  const signature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const isValid = verifyWebhookSignature({
    rawBody,
    signature,
    webhookSecret: secret
  });

  assert.strictEqual(isValid, true);
});
