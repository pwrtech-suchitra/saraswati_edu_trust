/**
 * Utility formatters for SECT Application
 */

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
