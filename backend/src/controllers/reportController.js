/**
 * Financial & 80G Tax Reports Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

async function getDonationReports(req, res, next) {
  try {
    const { from, to, project_id, status = 'COMPLETED' } = req.query;
    const where = ['d.status = $1'];
    const params = [status];

    if (from) {
      params.push(from);
      where.push(`d.created_at >= $${params.length}`);
    }
    if (to) {
      params.push(to);
      where.push(`d.created_at <= $${params.length}`);
    }
    if (project_id) {
      params.push(project_id);
      where.push(`d.project_id = $${params.length}`);
    }

    const whereSql = `WHERE ${where.join(' AND ')}`;
    const sql = `
      SELECT 
        d.id, d.donor_name, d.donor_email, d.donor_phone, d.donor_pan,
        d.amount, d.currency, d.status, d.receipt_number, d.created_at,
        p.title as project_title
      FROM donations d
      LEFT JOIN projects p ON d.project_id = p.id
      ${whereSql}
      ORDER BY d.created_at DESC
    `;
    const result = await db.query(sql, params);

    const totalAmount = result.rows.reduce((sum, r) => sum + parseFloat(r.amount), 0);

    return ApiResponse.success(res, 'Donation reports generated', {
      count: result.rowCount,
      total_amount: totalAmount,
      donations: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function get80GReports(req, res, next) {
  try {
    const { financial_year } = req.query;
    const params = [];
    let where = 'WHERE d.status = \'COMPLETED\' AND d.is_80g_claimed = TRUE';

    if (financial_year) {
      params.push(financial_year);
      where += ` AND r.financial_year = $1`;
    }

    const sql = `
      SELECT 
        r.receipt_number, r.financial_year, r.amount, r.issued_at,
        d.donor_name, d.donor_email, d.donor_pan, d.donor_address,
        d.created_at as donation_date, p.title as project_name
      FROM donation_receipts r
      JOIN donations d ON r.donation_id = d.id
      LEFT JOIN projects p ON d.project_id = p.id
      ${where}
      ORDER BY r.issued_at DESC
    `;
    const result = await db.query(sql, params);

    return ApiResponse.success(res, '80G Tax Exemption Report generated', {
      count: result.rowCount,
      total_amount: result.rows.reduce((sum, r) => sum + parseFloat(r.amount), 0),
      records: result.rows
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDonationReports,
  get80GReports
};
