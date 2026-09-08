/**
 * Email & Notification Dispatcher Service
 * Author: Suchitra (Backend & Database Developer)
 */

const logger = require('../config/logger');

async function sendDonationReceiptEmail({ toEmail, donorName, receiptNumber, amount, receiptUrl = null }) {
  logger.info(`[Email Dispatcher] Sending 80G Receipt to ${toEmail}`, {
    donorName,
    receiptNumber,
    amount
  });
  // In production, integrate SendGrid/Nodemailer/Resend here
  return { success: true, messageId: `msg_${Date.now()}` };
}

async function sendInquiryNotification({ fromName, fromEmail, subject, message }) {
  logger.info(`[Email Dispatcher] Alerting Admin about new inquiry from ${fromEmail}`, {
    fromName,
    subject
  });
  return { success: true };
}

module.exports = {
  sendDonationReceiptEmail,
  sendInquiryNotification
};
