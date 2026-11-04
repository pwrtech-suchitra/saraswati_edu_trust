/**
 * Donation Service
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const { DONATION_STATUS } = require('../utils/constants');

/**
 * Initialize donation record
 */
async function createPendingDonation(data, userId = null) {
  const text = `
    INSERT INTO donations (
      user_id, project_id, amount, currency, donor_name, donor_email,
      donor_phone, donor_pan, donor_address, is_anonymous, is_80g_claimed, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
  const res = await db.query(text, [
    userId,
    data.project_id || null,
    data.amount,
    data.currency || 'INR',
    data.donor_name,
    data.donor_email.toLowerCase().trim(),
    data.donor_phone || null,
    data.donor_pan ? data.donor_pan.toUpperCase().trim() : null,
    data.donor_address || null,
    data.is_anonymous || false,
    data.is_80g_claimed !== undefined ? data.is_80g_claimed : false,
    DONATION_STATUS.PENDING
  ]);

  return res.rows[0];
}

async function createManualDonation(data, userId = null, database = db) {
  try {
    const result = await database.query(`
      INSERT INTO donations (
        user_id, project_id, amount, currency, donor_name, donor_email,
        donor_phone, donor_pan, donor_address, is_80g_claimed, status,
        payment_method, payment_reference
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', 'UPI_QR', $11)
      RETURNING id, amount, currency, status, payment_method, created_at
    `, [
      userId,
      data.project_id || null,
      data.amount,
      'INR',
      data.donor_name,
      data.donor_email.toLowerCase().trim(),
      data.donor_phone || null,
      data.donor_pan ? data.donor_pan.toUpperCase().trim() : null,
      data.donor_address || null,
      Boolean(data.is_80g_claimed),
      data.payment_reference.trim().toUpperCase()
    ]);

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      const conflict = new Error('This UPI transaction reference has already been submitted.');
      conflict.statusCode = 409;
      throw conflict;
    }
    throw error;
  }
}

/**
 * Get donation by ID
 */
async function getDonationById(id) {
  const text = `
    SELECT d.*, p.title as project_title, p.slug as project_slug
    FROM donations d
    LEFT JOIN projects p ON d.project_id = p.id
    WHERE d.id = $1
  `;
  const res = await db.query(text, [id]);
  if (res.rowCount === 0) {
    const error = new Error('Donation not found');
    error.statusCode = 404;
    throw error;
  }
  return res.rows[0];
}

/**
 * Get donations made by a specific user
 */
async function getUserDonations(userId, { page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  const countRes = await db.query(
    'SELECT COUNT(*) as total FROM donations WHERE user_id = $1 AND status = $2',
    [userId, DONATION_STATUS.COMPLETED]
  );
  const total = parseInt(countRes.rows[0].total, 10);

  const text = `
    SELECT 
      d.id, d.amount, d.currency, d.status, d.receipt_number, d.created_at,
      p.id as project_id, p.title as project_title, p.slug as project_slug
    FROM donations d
    LEFT JOIN projects p ON d.project_id = p.id
    WHERE d.user_id = $1 AND d.status = $2
    ORDER BY d.created_at DESC
    LIMIT $3 OFFSET $4
  `;
  const dataRes = await db.query(text, [userId, DONATION_STATUS.COMPLETED, limit, offset]);

  return {
    donations: dataRes.rows,
    meta: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    }
  };
}

module.exports = {
  createPendingDonation,
  createManualDonation,
  getDonationById,
  getUserDonations
};
