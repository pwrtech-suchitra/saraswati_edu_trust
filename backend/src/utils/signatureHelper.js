/**
 * HMAC-SHA256 Payment Gateway Signature Helper
 * Author: Suchitra (Backend & Database Developer)
 */

const crypto = require('crypto');

/**
 * Verify Razorpay payment signature
 * order_id + "|" + razorpay_payment_id
 */
function verifyPaymentSignature({ orderId, paymentId, signature, secret }) {
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
  const signatureBuf = Buffer.from(signature, 'utf-8');

  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}

/**
 * Verify Webhook signature
 */
function verifyWebhookSignature({ rawBody, signature, webhookSecret }) {
  if (!rawBody || !signature || !webhookSecret) {
    return false;
  }
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
  const signatureBuf = Buffer.from(signature, 'utf-8');

  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}

module.exports = {
  verifyPaymentSignature,
  verifyWebhookSignature
};
