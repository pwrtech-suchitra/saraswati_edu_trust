/**
 * Utility formatters for SECT Application
 */

/**
 * Format number into Indian Rupees (INR) format (e.g. ₹1,50,000)
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const numericAmount = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Format ISO date string into readable format (e.g. 15 Sep 2026)
 * @param {string|Date} dateStr 
 * @param {boolean} includeTime
 * @returns {string}
 */
export function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  } catch {
    return String(dateStr);
  }
}

/**
 * Calculate progress percentage
 * @param {number} raised 
 * @param {number} target 
 * @returns {number} percentage (0 - 100)
 */
export function calculateProgress(raised = 0, target = 1) {
  if (!target || target <= 0) return 0;
  const pct = Math.round((Number(raised) / Number(target)) * 100);
  return Math.min(Math.max(pct, 0), 100);
}

/**
 * Truncate long text with ellipsis
 * @param {string} text 
 * @param {number} length 
 * @returns {string}
 */
export function truncateText(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}
