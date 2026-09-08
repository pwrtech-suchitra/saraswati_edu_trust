/**
 * Validation utilities for forms in SECT Application
 */

/**
 * Validate standard email format
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
}

/**
 * Validate 10-digit Indian mobile number
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidIndianPhone(phone) {
  if (!phone) return false;
  const cleanPhone = String(phone).replace(/[\s\-+]/g, '');
  // Matches 10 digits starting with 6, 7, 8, or 9 (optionally with 91 or 0 prefix)
  const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Validate Indian PAN card format (ABCDE1234F)
 * Essential for Section 80G tax benefit donation receipt
 * @param {string} pan 
 * @returns {boolean}
 */
export function isValidPAN(pan) {
  if (!pan) return false;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(String(pan).trim().toUpperCase());
}

/**
 * Validate minimum password strength
 * @param {string} password 
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
}
