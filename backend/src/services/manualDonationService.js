const db = require('../config/db');
const { DONATION_STATUS } = require('../utils/constants');
const { generateReceiptNumber, buildReceiptData } = require('./receiptService');
const { logAction } = require('./auditService');
const { sendDonationReceiptEmail } = require('./emailService');

function serviceError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function confirmManualDonation({ donationId, adminUserId, database = db, audit = logAction, sendReceiptEmail = sendDonationReceiptEmail }) {
  const client = await database.getClient();
  let donation;

  try {
    await client.query('BEGIN');
    const donationResult = await client.query(`
      SELECT d.*, p.title AS project_title
      FROM donations d
      LEFT JOIN projects p ON p.id = d.project_id
      WHERE d.id = $1
      FOR UPDATE OF d
    `, [donationId]);

    if (donationResult.rowCount === 0) {
      throw serviceError('Donation submission not found.', 404);
    }
    donation = donationResult.rows[0];
    if (donation.payment_method !== 'UPI_QR') {
      throw serviceError('Only UPI QR submissions can be manually reconciled.', 400);
    }
    if (donation.status === DONATION_STATUS.COMPLETED) {
      await client.query('COMMIT');
      return {
        donation_id: donation.id,
        status: donation.status,
        receipt_number: donation.receipt_number,
        already_confirmed: true
      };
    }
    if (donation.status !== DONATION_STATUS.PENDING) {
      throw serviceError('Only pending UPI submissions can be confirmed.', 409);
    }

    const trustResult = await client.query(`
      SELECT trust_name, pan, address, registration_no, exemption_80g_no
      FROM trust_profile
      WHERE is_active = TRUE
      ORDER BY id
      LIMIT 1
    `);
    const trustProfile = trustResult.rows[0];
    if (!trustProfile) {
      throw serviceError('Trust profile is not configured for receipt generation.', 503);
    }
    if (donation.is_80g_claimed && !trustProfile.exemption_80g_no) {
      throw serviceError('The trust has no active 80G registration for this request.', 409);
    }

    const { receiptNumber, financialYear } = await generateReceiptNumber(client);
    donation.receipt_number = receiptNumber;
    const receiptPayload = buildReceiptData({
      receiptNumber,
      financialYear,
      donation,
      transactionId: donation.payment_reference,
      trustProfile
    });

    await client.query(`
      UPDATE donations
      SET status = $1, receipt_number = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [DONATION_STATUS.COMPLETED, receiptNumber, donation.id]);

    await client.query(`
      INSERT INTO donation_receipts (
        donation_id, receipt_number, donor_name, donor_pan, amount,
        financial_year, receipt_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      donation.id,
      receiptNumber,
      donation.donor_name,
      donation.donor_pan,
      donation.amount,
      financialYear,
      JSON.stringify(receiptPayload)
    ]);

    if (donation.project_id) {
      await client.query(`
        UPDATE projects
        SET raised_amount = raised_amount + $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [donation.amount, donation.project_id]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }

  audit({
    userId: adminUserId,
    action: 'MANUAL_UPI_DONATION_CONFIRMED',
    entityType: 'donations',
    entityId: donation.id,
    newValues: {
      receiptNumber: donation.receipt_number,
      paymentReference: donation.payment_reference,
      amount: donation.amount
    }
  });
  sendReceiptEmail({
    toEmail: donation.donor_email,
    donorName: donation.donor_name,
    receiptNumber: donation.receipt_number,
    amount: donation.amount
  });

  return {
    donation_id: donation.id,
    status: DONATION_STATUS.COMPLETED,
    receipt_number: donation.receipt_number,
    payment_reference: donation.payment_reference,
    amount: Number(donation.amount)
  };
}

async function rejectManualDonation({ donationId, adminUserId, database = db, audit = logAction }) {
  const result = await database.query(`
    UPDATE donations
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND payment_method = 'UPI_QR' AND status = $3
    RETURNING id, status, payment_reference, amount
  `, [DONATION_STATUS.FAILED, donationId, DONATION_STATUS.PENDING]);

  if (result.rowCount === 0) {
    const error = serviceError('Pending UPI submission not found.', 404);
    throw error;
  }

  audit({
    userId: adminUserId,
    action: 'MANUAL_UPI_DONATION_REJECTED',
    entityType: 'donations',
    entityId: donationId,
    newValues: {
      paymentReference: result.rows[0].payment_reference,
      amount: result.rows[0].amount
    }
  });

  return result.rows[0];
}

async function listDonations({ status = null, database = db } = {}) {
  const result = await database.query(`
    SELECT d.id, d.donor_name, d.donor_email, d.donor_phone, d.donor_pan,
           d.amount, d.currency, d.status, d.payment_method, d.payment_reference,
           d.receipt_number, d.created_at, p.title AS project_title
    FROM donations d
    LEFT JOIN projects p ON p.id = d.project_id
    WHERE ($1::text IS NULL OR d.status = $1)
    ORDER BY d.created_at DESC
    LIMIT 200
  `, [status]);
  return result.rows;
}

module.exports = {
  confirmManualDonation,
  rejectManualDonation,
  listDonations
};