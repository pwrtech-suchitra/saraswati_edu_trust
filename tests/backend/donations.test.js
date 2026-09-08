/**
 * Donation & 80G Receipt Unit Tests
 * Author: Suchitra (Backend & Database Developer)
 */

const test = require('node:test');
const assert = require('node:assert');
const { numberToWordsINR, buildReceiptData } = require('../../backend/src/services/receiptService');
const { createDonationOrderSchema } = require('../../backend/src/validations/donationValidation');

test('numberToWordsINR converts rupee amounts correctly', () => {
  assert.strictEqual(numberToWordsINR(500), 'Rupees Five Hundred Only');
  assert.strictEqual(numberToWordsINR(2500), 'Rupees Two Thousand Five Hundred Only');
  assert.strictEqual(numberToWordsINR(100000), 'Rupees One Lakh Only');
});

test('createDonationOrderSchema validates valid donation inputs with Indian PAN', () => {
  const validDonation = {
    amount: 5000,
    donor_name: 'Rajesh Kumar',
    donor_email: 'rajesh@example.com',
    donor_pan: 'ABCDE1234F',
    donor_address: 'Bhubaneswar, Odisha',
    is_80g_claimed: true
  };

  const parsed = createDonationOrderSchema.safeParse(validDonation);
  assert.strictEqual(parsed.success, true);
});

test('createDonationOrderSchema rejects invalid PAN format', () => {
  const invalidPan = {
    amount: 5000,
    donor_name: 'Rajesh Kumar',
    donor_email: 'rajesh@example.com',
    donor_pan: 'INVALID_PAN_123'
  };

  const parsed = createDonationOrderSchema.safeParse(invalidPan);
  assert.strictEqual(parsed.success, false);
});

test('buildReceiptData constructs complete 80G certificate record', () => {
  const donation = {
    donor_name: 'Subhashree Roy',
    donor_email: 'subhashree@example.com',
    donor_pan: 'AAAPB1234K',
    donor_address: 'Cuttack, Odisha',
    amount: 10000,
    currency: 'INR'
  };

  const receipt = buildReceiptData({
    receiptNumber: 'SECT/2026-27/00001',
    financialYear: '2026-27',
    donation,
    transactionId: 'pay_mock_test_123'
  });

  assert.strictEqual(receipt.receipt_number, 'SECT/2026-27/00001');
  assert.strictEqual(receipt.donor.pan, 'AAAPB1234K');
  assert.strictEqual(receipt.payment.amount, 10000);
  assert.strictEqual(receipt.payment.amount_in_words, 'Rupees Ten Thousand Only');
  assert.ok(receipt.trust.name);
  assert.ok(receipt.trust.section_80g_no);
});
