/**
 * 80G Tax Exemption Receipt Service
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const config = require('../config/env');

/**
 * Convert number to words in Indian Rupees
 */
function numberToWordsINR(amount) {
  const words = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(num) {
    let str = '';
    if (num >= 100) {
      str += words[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    if (num > 0) {
      str += words[num] + ' ';
    }
    return str.trim();
  }

  const intAmount = Math.floor(amount);
  if (intAmount === 0) return 'Zero Rupees Only';

  let result = '';
  const crore = Math.floor(intAmount / 10000000);
  let rem = intAmount % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  const hundreds = rem;

  if (crore > 0) result += convertChunk(crore) + ' Crore ';
  if (lakh > 0) result += convertChunk(lakh) + ' Lakh ';
  if (thousand > 0) result += convertChunk(thousand) + ' Thousand ';
  if (hundreds > 0) result += convertChunk(hundreds) + ' ';

  return 'Rupees ' + result.trim() + ' Only';
}

/**
 * Generate sequential 80G receipt number (e.g. SECT/2026-27/00142)
 */
async function generateReceiptNumber(client = null) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = (currentYear + 1).toString().slice(-2);
  const financialYear = `${currentYear}-${nextYear}`;

  const queryFn = client ? client.query.bind(client) : db.query;
  const res = await queryFn('SELECT COUNT(*) as count FROM donation_receipts WHERE financial_year = $1', [financialYear]);
  const sequence = parseInt(res.rows[0].count, 10) + 1;
  const paddedSeq = sequence.toString().padStart(5, '0');

  return {
    receiptNumber: `SECT/${financialYear}/${paddedSeq}`,
    financialYear
  };
}

/**
 * Build 80G Receipt payload
 */
function buildReceiptData({ receiptNumber, financialYear, donation, transactionId }) {
  return {
    receipt_number: receiptNumber,
    financial_year: financialYear,
    trust: {
      name: config.trust.name,
      registration_no: config.trust.registrationNo,
      section_80g_no: config.trust.exemption80GNo
    },
    donor: {
      name: donation.donor_name,
      email: donation.donor_email,
      phone: donation.donor_phone,
      pan: donation.donor_pan,
      address: donation.donor_address
    },
    payment: {
      amount: parseFloat(donation.amount),
      amount_in_words: numberToWordsINR(donation.amount),
      currency: donation.currency || 'INR',
      transaction_id: transactionId,
      date: donation.created_at || new Date().toISOString()
    }
  };
}

module.exports = {
  generateReceiptNumber,
  buildReceiptData,
  numberToWordsINR
};
