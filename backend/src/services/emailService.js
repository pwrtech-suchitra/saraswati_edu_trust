/**
 * Email & Notification Dispatcher Service
 * Author: Suchitra (Backend & Database Developer)
 */

const logger = require('../config/logger');

async function sendDonationReceiptEmail() {
  logger.warn('Donation receipt email was not sent because no email provider is configured.');
  return { success: false, reason: 'NOT_CONFIGURED' };
}

async function sendInquiryNotification() {
  logger.warn('Inquiry notification email was not sent because no email provider is configured.');
  return { success: false, reason: 'NOT_CONFIGURED' };
}

module.exports = {
  sendDonationReceiptEmail,
  sendInquiryNotification
};
