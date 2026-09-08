/**
 * Contact & Volunteer Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const { sendInquiryNotification } = require('../services/emailService');

async function submitInquiry(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    const text = `
      INSERT INTO inquiries (name, email, phone, subject, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(text, [name.trim(), email.toLowerCase().trim(), phone || null, subject || null, message.trim()]);

    sendInquiryNotification({ fromName: name, fromEmail: email, subject, message });

    return ApiResponse.created(res, 'Thank you for reaching out! We will get back to you shortly.', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function submitVolunteerApplication(req, res, next) {
  try {
    const { full_name, email, phone, interests, availability, experience } = req.body;
    const text = `
      INSERT INTO volunteer_applications (full_name, email, phone, interests, availability, experience)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(text, [
      full_name.trim(),
      email.toLowerCase().trim(),
      phone.trim(),
      interests || [],
      availability || null,
      experience || null
    ]);

    return ApiResponse.created(res, 'Volunteer application submitted successfully! Thank you for your interest in joining SECT.', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function listInquiries(req, res, next) {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const offset = (page - 1) * limit;
    const where = status ? 'WHERE status = $1' : '';
    const params = status ? [status] : [];

    const countRes = await db.query(`SELECT COUNT(*) as total FROM inquiries ${where}`, params);
    const total = parseInt(countRes.rows[0].total, 10);

    params.push(limit, offset);
    const dataRes = await db.query(`
      SELECT * FROM inquiries ${where}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    return ApiResponse.success(res, 'Inquiries retrieved', dataRes.rows, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitInquiry,
  submitVolunteerApplication,
  listInquiries
};
