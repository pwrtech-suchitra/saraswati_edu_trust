const test = require('node:test');
const assert = require('node:assert/strict');
const { sendDonationReceiptEmail, sendInquiryNotification } = require('../../backend/src/services/emailService');

test('email services report that messages were not sent when no provider is configured', async () => {
  const donationResult = await sendDonationReceiptEmail({
    toEmail: 'donor@example.com',
    donorName: 'Example Donor',
    receiptNumber: 'SECT/2026/001',
    amount: 100
  });
  const inquiryResult = await sendInquiryNotification({
    fromName: 'Example Visitor',
    fromEmail: 'visitor@example.com',
    subject: 'Question',
    message: 'A message'
  });

  assert.deepEqual(donationResult, { success: false, reason: 'NOT_CONFIGURED' });
  assert.deepEqual(inquiryResult, { success: false, reason: 'NOT_CONFIGURED' });
});
