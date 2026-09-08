/**
 * Donation & Payment Validation Schemas (Zod)
 * Author: Suchitra (Backend & Database Developer)
 */

const { z } = require('zod');

const createDonationOrderSchema = z.object({
  amount: z.coerce.number().min(10, 'Minimum donation amount is ₹10'),
  currency: z.string().default('INR'),
  donor_name: z.string().min(2, 'Donor name is required').max(150),
  donor_email: z.string().email('Valid donor email is required'),
  donor_phone: z.string().optional().nullable(),
  donor_pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid Indian PAN format (e.g. ABCDE1234F)')
    .optional()
    .nullable()
    .or(z.literal('')),
  donor_address: z.string().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  is_anonymous: z.coerce.boolean().optional().default(false),
  is_80g_claimed: z.coerce.boolean().optional().default(true)
});

const verifyPaymentSchema = z.object({
  donation_id: z.string().uuid('Valid donation ID required'),
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Payment signature is required')
});

module.exports = {
  createDonationOrderSchema,
  verifyPaymentSchema
};
