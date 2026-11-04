/**
 * Authentication Service
 * Author: Suchitra (Backend & Database Developer)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/env');
const { ROLES } = require('../utils/constants');

/**
 * Generate Access and Refresh JWT tokens
 */
function generateTokens(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || ROLES.MEMBER
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn
  });

  return { accessToken, refreshToken };
}

/**
 * Register new user
 */
async function registerUser({ full_name, email, password, phone = null, address = null, role = ROLES.MEMBER }) {
  const existingRes = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  if (existingRes.rowCount > 0) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // 1. Insert user
    const userInsertRes = await client.query(`
      INSERT INTO users (full_name, email, password_hash, phone, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, phone, address, created_at
    `, [full_name.trim(), email.toLowerCase().trim(), passwordHash, phone, address]);

    const newUser = userInsertRes.rows[0];

    // 2. Fetch role ID
    const roleRes = await client.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleRes.rowCount === 0) {
      throw new Error(`Role ${role} is not configured`);
    }
    const roleId = roleRes.rows[0].id;

    // 3. Assign role
    await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [newUser.id, roleId]);

    await client.query('COMMIT');

    newUser.role = role;
    const tokens = generateTokens(newUser);

    return { user: newUser, ...tokens };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Authenticate user with email and password
 */
async function loginUser({ email, password }) {
  const text = `
    SELECT u.id, u.full_name, u.email, u.password_hash, u.is_active, r.name as role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.email = $1
  `;
  const res = await db.query(text, [email.toLowerCase().trim()]);

  if (res.rowCount === 0) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const user = res.rows[0];

  if (!user.is_active) {
    const error = new Error('Your account has been deactivated. Please contact SECT admin.');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Update last login timestamp
  await db.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

  delete user.password_hash;
  const tokens = generateTokens(user);

  return { user, ...tokens };
}

/**
 * Refresh expired access token
 */
async function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const userRes = await db.query(`
      SELECT u.id, u.email, u.is_active, r.name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
    `, [decoded.id]);

    if (userRes.rowCount === 0 || !userRes.rows[0].is_active) {
      const error = new Error('User no longer exists or is deactivated.');
      error.statusCode = 401;
      throw error;
    }

    const user = userRes.rows[0];
    const newAccessToken = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    return { access_token: newAccessToken };
  } catch {
    const error = new Error('Invalid or expired refresh token.');
    error.statusCode = 401;
    throw error;
  }
}

module.exports = {
  generateTokens,
  registerUser,
  loginUser,
  refreshAccessToken
};
