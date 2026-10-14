/**
 * Trust Profile & Statutory Particulars Controller
 * Directly queries and updates PostgreSQL trust_profile table
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

/**
 * Get active trust profile with statutory credentials, mission, and activities
 */
async function getTrustProfile(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM trust_profile WHERE is_active = TRUE ORDER BY id ASC LIMIT 1');
    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'Trust profile not found in database', [], 404);
    }
    return ApiResponse.success(res, 'Trust profile retrieved from database', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

/**
 * Get the 4 core activity pillars and 27 mandates
 */
async function getActivityPillars(req, res, next) {
  try {
    const result = await db.query('SELECT activity_pillars FROM trust_profile WHERE is_active = TRUE ORDER BY id ASC LIMIT 1');
    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'Activity pillars not found', [], 404);
    }
    return ApiResponse.success(res, 'Activity pillars retrieved from database', result.rows[0].activity_pillars);
  } catch (err) {
    next(err);
  }
}

/**
 * Get Mission Sustainable India initiative, 5Ps, and strategic highlights
 */
async function getMissionSustainableIndia(req, res, next) {
  try {
    const result = await db.query('SELECT mission_sustainable_india FROM trust_profile WHERE is_active = TRUE ORDER BY id ASC LIMIT 1');
    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'Mission Sustainable India profile not found', [], 404);
    }
    return ApiResponse.success(res, 'Mission Sustainable India profile retrieved from database', result.rows[0].mission_sustainable_india);
  } catch (err) {
    next(err);
  }
}

/**
 * Update trust profile (Admin only)
 */
async function updateTrustProfile(req, res, next) {
  try {
    const updates = req.body;
    const currentRes = await db.query('SELECT id FROM trust_profile WHERE is_active = TRUE LIMIT 1');
    
    if (currentRes.rowCount === 0) {
      return ApiResponse.error(res, 'Trust profile not found to update', [], 404);
    }

    const id = currentRes.rows[0].id;
    const fields = [];
    const values = [];

    const allowedFields = [
      'trust_name', 'short_name', 'pan', 'registration_no', 'exemption_80g_no',
      'address', 'city', 'state', 'pincode', 'phone_landline', 'phone_mobiles',
      'email', 'qr_code_url', 'facebook_url', 'twitter_handle', 'linkedin_url',
      'whatsapp_numbers', 'introduction', 'vision', 'mission'
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        values.push(updates[field]);
        fields.push(`${field} = $${values.length}`);
      }
    });

    if (updates.mission_sustainable_india) {
      values.push(JSON.stringify(updates.mission_sustainable_india));
      fields.push(`mission_sustainable_india = $${values.length}::jsonb`);
    }

    if (updates.activity_pillars) {
      values.push(JSON.stringify(updates.activity_pillars));
      fields.push(`activity_pillars = $${values.length}::jsonb`);
    }

    if (fields.length === 0) {
      return ApiResponse.error(res, 'No valid fields provided to update', [], 400);
    }

    values.push(id);
    const sql = `
      UPDATE trust_profile 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING *
    `;

    const updateRes = await db.query(sql, values);
    return ApiResponse.success(res, 'Trust profile updated successfully in database', updateRes.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTrustProfile,
  getActivityPillars,
  getMissionSustainableIndia,
  updateTrustProfile
};
