/**
 * Audit Logging Service
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');

async function logAction({ userId = null, action, entityType, entityId, oldValues = null, newValues = null, ipAddress = null, userAgent = null }) {
  try {
    const text = `
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await db.query(text, [
      userId,
      action,
      entityType,
      String(entityId),
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null,
      ipAddress,
      userAgent
    ]);
  } catch (err) {
    // Non-blocking error for audit logging
    console.error('[Audit Log Error]', err.message);
  }
}

module.exports = {
  logAction
};
