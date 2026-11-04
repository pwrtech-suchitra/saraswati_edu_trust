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

const razorpayApiUrl = 'https://api.razorpay.com/v1';

function paymentError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function razorpayRequest(endpoint, options = {}) {
  if (!config.payment.keyId || !config.payment.keySecret) {
    throw paymentError('Payment processing is not configured.', 503);
  }

  const authorization = Buffer.from(`${config.payment.keyId}:${config.payment.keySecret}`).toString('base64');
  let response;

  try {
    response = await fetch(`${razorpayApiUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Basic ${authorization}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: AbortSignal.timeout(10000)
    });
  } catch {
    throw paymentError('Payment gateway is temporarily unavailable.', 503);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw paymentError('Payment gateway returned an invalid response.', 502);
  }

  if (!response.ok) {
    throw paymentError('Payment gateway could not process the request.', 502);
  }

  return body;
}

function validatePaymentOrder(order, donationId) {
  if (!order || order.donation_id !== donationId) {
    throw paymentError('Payment order does not match this donation.', 400);
  }

  const amountInPaise = Math.round(Number(order.donation_amount) * 100);
  if (
    !Number.isSafeInteger(amountInPaise) ||
    Number(order.amount_in_paise) !== amountInPaise ||
    order.currency !== order.donation_currency
  ) {
    throw paymentError('Payment order amount or currency does not match the donation.', 400);
  }

  return amountInPaise;
}

function validateGatewayPayment(payment, orderId, amountInPaise, currency) {
  if (
    !payment ||
    payment.order_id !== orderId ||
    Number(payment.amount) !== amountInPaise ||
    payment.currency !== currency ||
    payment.status !== 'captured'
  ) {
    throw paymentError('Captured payment details do not match the donation order.', 400);
  }
}

async function getPaymentOrder(orderId) {
  const result = await db.query(`
    SELECT po.donation_id, po.amount_in_paise, po.currency, po.status,
           d.amount AS donation_amount, d.currency AS donation_currency
    FROM payment_orders po
    JOIN donations d ON d.id = po.donation_id
    WHERE po.gateway_order_id = $1
  `, [orderId]);

  return result.rows[0] || null;
}

/**
 * Create Payment Order
 */
async function createPaymentOrder(donation) {
  const amountInPaise = Math.round(Number(donation.amount) * 100);
  const currency = donation.currency || 'INR';
  if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
    throw paymentError('Donation amount is invalid for payment processing.', 400);
  }

  const gatewayOrder = await razorpayRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt: donation.id,
      notes: { donation_id: donation.id }
    })
  });

  if (
    !gatewayOrder ||
    typeof gatewayOrder.id !== 'string' ||
    Number(gatewayOrder.amount) !== amountInPaise ||
    gatewayOrder.currency !== currency
  ) {
    throw paymentError('Payment gateway returned an order that does not match the donation.', 502);
  }
  const gatewayOrderId = gatewayOrder.id;

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
    currency,
    'CREATED'
  ]);

  return {
    order_id: gatewayOrderId,
    orderId: gatewayOrderId,
    amount: amountInPaise,
    currency,
    key_id: config.payment.keyId,
    key: config.payment.keyId
  };
}

/**
 * Authoritative Payment Verification (HMAC Signature Check & DB Transaction)
 */
async function verifyAndFinalizePayment(data) {
  const donationId = data.donationId || data.donation_id;
  const razorpayOrderId = data.razorpayOrderId || data.razorpay_order_id;
  const razorpayPaymentId = data.razorpayPaymentId || data.razorpay_payment_id;
  const razorpaySignature = data.razorpaySignature || data.razorpay_signature;

  // 1. Signature check
  const isValidSignature = verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
    secret: config.payment.keySecret
  });

  if (!isValidSignature) {
    throw paymentError('Cryptographic signature verification failed.', 400);
  }

  const order = await getPaymentOrder(razorpayOrderId);
  const amountInPaise = validatePaymentOrder(order, donationId);
  const gatewayPayment = await razorpayRequest(`/payments/${encodeURIComponent(razorpayPaymentId)}`);
  validateGatewayPayment(gatewayPayment, razorpayOrderId, amountInPaise, order.currency);

  return finalizeCapturedPayment({
    donationId,
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
    gatewayPayment
  });
}

async function finalizeCapturedPayment({ donationId, orderId, paymentId, signature, gatewayPayment }) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const paymentOrderRes = await client.query(`
      SELECT donation_id, amount_in_paise, currency
      FROM payment_orders
      WHERE gateway_order_id = $1
      FOR UPDATE
    `, [orderId]);
    const paymentOrder = paymentOrderRes.rows[0];
    if (!paymentOrder || (donationId && paymentOrder.donation_id !== donationId)) {
      throw paymentError('Payment order does not match this donation.', 400);
    }

    // Fetch donation with row lock
    const resolvedDonationId = donationId || paymentOrder.donation_id;
    const donationRes = await client.query('SELECT * FROM donations WHERE id = $1 FOR UPDATE', [resolvedDonationId]);
    if (donationRes.rowCount === 0) {
      throw paymentError('Donation record not found.', 404);
    }

    const donation = donationRes.rows[0];
    const amountInPaise = validatePaymentOrder({
      donation_id: paymentOrder.donation_id,
      amount_in_paise: paymentOrder.amount_in_paise,
      currency: paymentOrder.currency,
      donation_amount: donation.amount,
      donation_currency: donation.currency
    }, donation.id);

    if (gatewayPayment) {
      validateGatewayPayment(gatewayPayment, orderId, amountInPaise, donation.currency);
    }

    const existingPayment = await client.query(
      'SELECT donation_id, gateway_order_id FROM payment_transactions WHERE gateway_payment_id = $1 FOR UPDATE',
      [paymentId]
    );
    if (
      existingPayment.rowCount > 0 &&
      (
        existingPayment.rows[0].donation_id !== donation.id ||
        existingPayment.rows[0].gateway_order_id !== orderId
      )
    ) {
      throw paymentError('Payment has already been associated with another donation.', 409);
    }

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
    const trustProfileRes = await client.query(`
      SELECT trust_name, pan, address, registration_no, exemption_80g_no
      FROM trust_profile
      WHERE is_active = TRUE
      ORDER BY id
      LIMIT 1
    `);
    const trustProfile = trustProfileRes.rows[0];
    if (!trustProfile) {
      throw paymentError('Trust profile is not configured for receipt generation.', 503);
    }

    // Update donation status & receipt number
    await client.query(`
      UPDATE donations
      SET status = $1, receipt_number = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [DONATION_STATUS.COMPLETED, receiptNumber, donation.id]);

    // Record payment transaction
    await client.query(`
      INSERT INTO payment_transactions (
        donation_id, gateway_payment_id, gateway_order_id, payment_method,
        amount, gateway_signature, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (gateway_payment_id) DO NOTHING
    `, [
      donation.id,
      paymentId,
      orderId,
      gatewayPayment?.method || 'ONLINE_GATEWAY',
      donation.amount,
      signature || null,
      PAYMENT_STATUS.CAPTURED
    ]);

    // Generate and store 80G receipt voucher
    const receiptPayload = buildReceiptData({
      receiptNumber,
      financialYear,
      donation,
      transactionId: paymentId,
      trustProfile
    });

    await client.query(`
      INSERT INTO donation_receipts (donation_id, receipt_number, donor_name, donor_pan, amount, financial_year, receipt_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (donation_id) DO UPDATE SET receipt_number = EXCLUDED.receipt_number
    `, [
      donation.id,
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
    `, [orderId]);

    await client.query('COMMIT');

    // Non-blocking post-commit actions (audit log & email)
    logAction({
      userId: donation.user_id,
      action: 'DONATION_PAYMENT_VERIFIED',
      entityType: 'donations',
      entityId: donation.id,
      newValues: { receiptNumber, amount: donation.amount, gatewayPaymentId: paymentId }
    });

    sendDonationReceiptEmail({
      toEmail: donation.donor_email,
      donorName: donation.donor_name,
      receiptNumber,
      amount: donation.amount
    });

    return {
      donation_id: donation.id,
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

  if (!isValid) {
    throw paymentError('Invalid webhook signature.', 400);
  }

  const event = payload?.event;
  // Handle payment captured event
  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = payload?.payload?.payment?.entity;
    if (!payment?.id || !payment.order_id) {
      throw paymentError('Webhook payload does not contain a valid payment.', 400);
    }

    const order = await getPaymentOrder(payment.order_id);
    const amountInPaise = validatePaymentOrder(order, order?.donation_id);
    validateGatewayPayment(payment, payment.order_id, amountInPaise, order.currency);

    await finalizeCapturedPayment({
      orderId: payment.order_id,
      paymentId: payment.id,
      gatewayPayment: payment
    });
  }

  return { received: true };
}

module.exports = {
  createPaymentOrder,
  verifyAndFinalizePayment,
  processGatewayWebhook
};
