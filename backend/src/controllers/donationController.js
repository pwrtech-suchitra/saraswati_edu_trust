/**
 * Donation & Receipt Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const donationService = require('../services/donationService');
const paymentService = require('../services/paymentService');
const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const { ROLES } = require('../utils/constants');

async function submitManualDonation(req, res, next) {
  try {
    const donation = await donationService.createManualDonation(req.body, req.user?.id || null);
    return ApiResponse.created(res, 'Donation submitted for payment reconciliation', {
      donation_id: donation.id,
      amount: donation.amount,
      currency: donation.currency,
      status: donation.status,
      payment_method: donation.payment_method,
      created_at: donation.created_at
    });
  } catch (err) {
    next(err);
  }
}

async function createOrder(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const donation = await donationService.createPendingDonation(req.body, userId);
    const orderData = await paymentService.createPaymentOrder(donation);

    return ApiResponse.created(res, 'Donation order created', {
      donation_id: donation.id,
      donationId: donation.id,
      ...orderData
    });
  } catch (err) {
    next(err);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const result = await paymentService.verifyAndFinalizePayment(req.body);
    return ApiResponse.success(res, 'Payment verified successfully. Thank you for your contribution!', result);
  } catch (err) {
    next(err);
  }
}

async function getMyDonations(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await donationService.getUserDonations(req.user.id, { page, limit });
    return ApiResponse.success(res, 'User donation history retrieved', result.donations, result.meta);
  } catch (err) {
    next(err);
  }
}

async function getReceipt(req, res, next) {
  try {
    const { id } = req.params;
    const text = `
      SELECT r.*, d.project_id, d.user_id, p.title as project_title
      FROM donation_receipts r
      JOIN donations d ON r.donation_id = d.id
      LEFT JOIN projects p ON d.project_id = p.id
      WHERE r.donation_id = $1 OR r.id::text = $1 OR r.receipt_number = $1
    `;
    const result = await db.query(text, [id]);

    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'Donation receipt not found', [], 404);
    }

    const receipt = result.rows[0];
    if (req.user.role !== ROLES.ADMIN && receipt.user_id !== req.user.id) {
      return ApiResponse.error(res, 'Donation receipt not found', [], 404);
    }
    return ApiResponse.success(res, 'Receipt details retrieved', receipt.receipt_data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitManualDonation,
  createOrder,
  verifyPayment,
  getMyDonations,
  getReceipt
};
