/**
 * System Health Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

async function getHealth(req, res) {
  const dbStatus = await db.testConnection();
  const uptime = Math.floor(process.uptime());

  const data = {
    status: dbStatus.ok ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    database: dbStatus.ok ? 'CONNECTED' : 'DISCONNECTED',
    uptime_seconds: uptime,
    environment: process.env.NODE_ENV || 'development'
  };

  if (!dbStatus.ok) {
    return ApiResponse.error(res, 'Database connection error', [{ error: dbStatus.error }], 503);
  }

  return ApiResponse.success(res, 'SECT Backend API is healthy', data);
}

module.exports = {
  getHealth
};
