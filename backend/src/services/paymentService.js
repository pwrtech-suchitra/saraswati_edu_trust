/**
 * Payment Gateway & Webhook Service
 * Strictly adheres to Section 14 (Payment Security) & Section 20 (Definition of Done)
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const config = require('../config/env');
const { verifyPaymentSignature, verifyWebhookSignature } = require('../utils/signatureHelper');
const { generateReceiptNumber, buildReceiptData } = require('./receiptService');
const { sendDonationReceiptEmail } = require('./emailService');
const { logAction } = require('./auditService');
const { DONATION_STATUS, PAYMENT_STATUS } = require('../utils/constants');

/**
 * Create Payment Order
 */
async function createPaymentOrder(donation) {
  // Mock / gateway order creation
  const gatewayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const amountInPaise = Math.round(donation.amount * 100);

  const text = `
    INSERT INTO payment_orders (donation_id, gateway_order_id, gateway_name, amount_in_paise, currency, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  await db.query(text, [
    donation.id,
    gatewayOrderId,
    'RAZORPAY',
    amountInPaise,
    donation.currency || 'INR',
    'CREATED'
  ]);

  return {
    order_id: gatewayOrderId,
    amount: amountInPaise,
    currency: donation.currency || 'INR',
    key_id: config.payment.keyId
  };
}

/**
 * Authoritative Payment Verification (HMAC Signature Check & DB Transaction)
 */
async function verifyAndFinalizePayment({ donationId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  // 1. Signature check
  // In development, allow bypass if testing with demo keys or simulator
  const isDevBypass = config.nodeEnv === 'development' && (
    razorpaySignature === 'mock_signature_for_testing' ||
    (typeof razorpaySignature === 'string' && razorpaySignature.startsWith('sig_mock_signature_'))
  );
  const isValidSignature = isDevBypass || verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
    secret: config.payment.keySecret
  });

  if (!isValidSignature) {
    const error = new Error('Cryptographic signature verification failed.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Transaction execution
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Fetch donation with row lock
    const donationRes = await client.query('SELECT * FROM donations WHERE id = $1 FOR UPDATE', [donationId]);
    if (donationRes.rowCount === 0) {
      const error = new Error('Donation record not found.');
      error.statusCode = 404;
      throw error;
    }

    const donation = donationRes.rows[0];

    // Check if already completed (Idempotency)
    if (donation.status === DONATION_STATUS.COMPLETED) {
      await client.query('COMMIT');
      return {
        donation_id: donation.id,
        receipt_number: donation.receipt_number,
        status: donation.status,
        amount: donation.amount
      };
    }

    // Generate unique receipt number
    const { receiptNumber, financialYear } = await generateReceiptNumber(client);

    // Update donation status & receipt number
    await client.query(`
      UPDATE donations
      SET status = $1, receipt_number = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [DONATION_STATUS.COMPLETED, receiptNumber, donationId]);

    // Record payment transaction
    await client.query(`
      INSERT INTO payment_transactions (
        donation_id, gateway_payment_id, gateway_order_id, payment_method,
        amount, gateway_signature, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (gateway_payment_id) DO NOTHING
    `, [
      donationId,
      razorpayPaymentId,
      razorpayOrderId,
      'ONLINE_GATEWAY',
      donation.amount,
      razorpaySignature,
      PAYMENT_STATUS.CAPTURED
    ]);

    // Generate and store 80G receipt voucher
    const receiptPayload = buildReceiptData({
      receiptNumber,
      financialYear,
      donation,
      transactionId: razorpayPaymentId
    });

    await client.query(`
      INSERT INTO donation_receipts (donation_id, receipt_number, donor_name, donor_pan, amount, financial_year, receipt_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (donation_id) DO UPDATE SET receipt_number = EXCLUDED.receipt_number
    `, [
      donationId,
      receiptNumber,
      donation.donor_name,
      donation.donor_pan,
      donation.amount,
      financialYear,
      JSON.stringify(receiptPayload)
    ]);

    // If donation was earmarked for a project, update project's raised_amount
    if (donation.project_id) {
      await client.query(`
        UPDATE projects
        SET raised_amount = raised_amount + $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [donation.amount, donation.project_id]);
    }

    // Update payment_orders status
    await client.query(`
      UPDATE payment_orders SET status = 'PAID' WHERE gateway_order_id = $1
    `, [razorpayOrderId]);

    await client.query('COMMIT');

    // Non-blocking post-commit actions (audit log & email)
    logAction({
      userId: donation.user_id,
      action: 'DONATION_PAYMENT_VERIFIED',
      entityType: 'donations',
      entityId: donationId,
      newValues: { receiptNumber, amount: donation.amount, gatewayPaymentId: razorpayPaymentId }
    });

    sendDonationReceiptEmail({
      toEmail: donation.donor_email,
      donorName: donation.donor_name,
      receiptNumber,
      amount: donation.amount
    });

    return {
      donation_id: donationId,
      receipt_number: receiptNumber,
      status: DONATION_STATUS.COMPLETED,
      amount: parseFloat(donation.amount),
      currency: donation.currency,
      donor_name: donation.donor_name,
      is_80g_eligible: donation.is_80g_claimed,
      payment_date: new Date().toISOString()
    };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Handle Authoritative Webhook Event from Gateway
 */
async function processGatewayWebhook({ rawBody, signature, payload }) {
  // 1. Verify webhook signature
  const isValid = verifyWebhookSignature({
    rawBody,
    signature,
    webhookSecret: config.payment.webhookSecret
  });

  if (!isValid && config.nodeEnv === 'production') {
    const error = new Error('Invalid webhook signature');
    error.statusCode = 400;
    throw error;
  }

  const event = payload.event;
  // Handle payment captured event
  if (event === 'payment.captured' || event === 'order.paid') {
    const entity = payload.payload.payment.entity;
    const orderId = entity.order_id;
    const paymentId = entity.id;

    // Find order in database
    const orderRes = await db.query('SELECT donation_id FROM payment_orders WHERE gateway_order_id = $1', [orderId]);
    if (orderRes.rowCount > 0) {
      const donationId = orderRes.rows[0].donation_id;
      // Idempotently verify and finalize
      await verifyAndFinalizePayment({
        donationId,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature || 'webhook_verified'
      });
    }
  }

  return { received: true };
}

module.exports = {
  createPaymentOrder,
  verifyAndFinalizePayment,
  processGatewayWebhook
};
