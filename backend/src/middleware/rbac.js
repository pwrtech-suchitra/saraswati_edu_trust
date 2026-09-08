/**
 * Role-Based Access Control (RBAC) Middleware
 * Author: Suchitra (Backend & Database Developer)
 */

const ApiResponse = require('../utils/apiResponse');

/**
 * Check if the user has any of the allowed roles
 * @param  {...string} allowedRoles 
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return ApiResponse.error(res, 'Unauthorized access', [{ message: 'User context not found' }], 401);
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return ApiResponse.error(res, 'Forbidden: Insufficient permissions', [{ message: `Requires one of roles: ${allowedRoles.join(', ')}` }], 403);
    }

    next();
  };
}

module.exports = {
  requireRole
};
