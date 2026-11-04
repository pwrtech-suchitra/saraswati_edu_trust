const test = require('node:test');
const assert = require('node:assert/strict');
const { sendInquiryNotification } = require('../../backend/src/services/emailService');

test('inquiry email reports that no message was sent when no provider is configured', async () => {
  const inquiryResult = await sendInquiryNotification({
    fromName: 'Example Visitor',
    fromEmail: 'visitor@example.com',
    subject: 'Question',
    message: 'A message'
  });

  assert.deepEqual(inquiryResult, { success: false, reason: 'NOT_CONFIGURED' });
});
