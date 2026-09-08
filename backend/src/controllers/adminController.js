/**
 * Admin Dashboard & User Management Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const { logAction } = require('../services/auditService');

async function getDashboardStats(req, res, next) {
  try {
    // 1. Total donations collected
    const donRes = await db.query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(DISTINCT donor_email) as total_donors,
        COUNT(*) as total_donations
      FROM donations
      WHERE status = 'COMPLETED'
    `);

    // 2. Active projects count
    const projRes = await db.query(`
      SELECT COUNT(*) as active_count
      FROM projects
      WHERE status = 'ACTIVE' AND is_deleted = FALSE
    `);

    // 3. Pending inquiries
    const inqRes = await db.query(`
      SELECT COUNT(*) as pending_count
      FROM inquiries
      WHERE status = 'PENDING'
    `);

    // 4. Recent completed donations
    const recentRes = await db.query(`
      SELECT d.id, d.donor_name, d.amount, d.currency, d.receipt_number, d.created_at, p.title as project_title
      FROM donations d
      LEFT JOIN projects p ON d.project_id = p.id
      WHERE d.status = 'COMPLETED'
      ORDER BY d.created_at DESC
      LIMIT 5
    `);

    return ApiResponse.success(res, 'Admin metrics retrieved', {
      total_donations_amount: parseFloat(donRes.rows[0].total_amount),
      total_donors_count: parseInt(donRes.rows[0].total_donors, 10),
      total_donations_count: parseInt(donRes.rows[0].total_donations, 10),
      active_projects_count: parseInt(projRes.rows[0].active_count, 10),
      pending_inquiries_count: parseInt(inqRes.rows[0].pending_count, 10),
      recent_donations: recentRes.rows
    });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const where = [];
    const params = [];

    if (role) {
      params.push(role);
      where.push(`r.name = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      where.push(`(u.full_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ${whereSql}
    `;
    const countRes = await db.query(countSql, params);
    const total = parseInt(countRes.rows[0].total, 10);

    params.push(limit, offset);
    const dataSql = `
      SELECT u.id, u.full_name, u.email, u.phone, u.is_active, u.created_at, u.last_login_at, r.name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ${whereSql}
      ORDER BY u.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    const dataRes = await db.query(dataSql, params);

    return ApiResponse.success(res, 'Users retrieved', dataRes.rows, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const roleRes = await db.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleRes.rowCount === 0) {
      return ApiResponse.error(res, 'Invalid role name', [], 400);
    }
    const roleId = roleRes.rows[0].id;

    // Fetch old role for audit
    const oldRoleRes = await db.query(`
      SELECT r.name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = $1
    `, [id]);
    const oldRole = oldRoleRes.rowCount ? oldRoleRes.rows[0].name : 'NONE';

    await db.query(`
      INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET role_id = EXCLUDED.role_id
    `, [id, roleId]);

    logAction({
      userId: req.user.id,
      action: 'USER_ROLE_UPDATED',
      entityType: 'users',
      entityId: id,
      oldValues: { role: oldRole },
      newValues: { role }
    });

    return ApiResponse.success(res, `User role updated to ${role}`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats,
  listUsers,
  updateUserRole
};
