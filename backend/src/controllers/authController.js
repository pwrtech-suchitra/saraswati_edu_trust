/**
 * Authentication Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const authService = require('../services/authService');
const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    return ApiResponse.created(res, 'Registration successful', result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    return ApiResponse.success(res, 'Login successful', result);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await authService.refreshAccessToken(req.body.refresh_token);
    return ApiResponse.success(res, 'Token refreshed successfully', result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // In stateless JWT, client deletes tokens; server confirms logout
  return ApiResponse.success(res, 'Logout successful');
}

async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const text = `
      SELECT u.id, u.full_name, u.email, u.phone, u.address, u.pan_number, u.created_at, r.name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
    `;
    const result = await db.query(text, [userId]);
    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'User not found', [], 404);
    }
    return ApiResponse.success(res, 'Profile retrieved', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  getProfile
};
