/**
 * Standardized API Response Builder
 * Strictly matches Section 12 of ANTIGRAVITY_TEAM_RULES.md
 * Author: Suchitra (Backend & Database Developer)
 */

class ApiResponse {
  /**
   * Send success response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {any} data
   * @param {object} meta
   * @param {number} statusCode
   */
  static success(res, message = 'Operation completed successfully', data = {}, meta = null, statusCode = 200) {
    const payload = {
      success: true,
      message,
      data
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }

  /**
   * Send created response
   */
  static created(res, message = 'Resource created successfully', data = {}, meta = null) {
    return this.success(res, message, data, meta, 201);
  }

  /**
   * Send error response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {Array} errors
   * @param {number} statusCode
   */
  static error(res, message = 'An error occurred', errors = [], statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [{ message: String(errors) }]
    });
  }
}

module.exports = ApiResponse;
