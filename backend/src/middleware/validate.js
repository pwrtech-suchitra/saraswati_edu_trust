/**
 * Request Validation Middleware
 * Author: Suchitra (Backend & Database Developer)
 */

const ApiResponse = require('../utils/apiResponse');

/**
 * Validate request body, query, or params using a Zod schema or validation function
 * @param {object} schema
 * @param {'body' | 'query' | 'params'} source
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      if (typeof schema.parse === 'function') {
        req[source] = schema.parse(req[source]);
        return next();
      }
      if (typeof schema.validate === 'function') {
        const result = schema.validate(req[source]);
        if (result.error) {
          return ApiResponse.error(res, 'Validation failed', result.error.details || [{ message: result.error.message }], 422);
        }
        req[source] = result.value;
        return next();
      }
      next();
    } catch (err) {
      const validationIssues = Array.isArray(err.issues)
        ? err.issues
        : err.errors;
      if (Array.isArray(validationIssues)) {
        const formattedErrors = validationIssues.map(e => ({
          field: e.path ? e.path.join('.') : undefined,
          message: e.message
        }));
        return ApiResponse.error(res, 'Validation failed', formattedErrors, 422);
      }
      return ApiResponse.error(res, 'Validation failed', [{ message: err.message }], 422);
    }
  };
}

module.exports = validate;
