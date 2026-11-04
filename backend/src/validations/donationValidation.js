/**
 * Donation & Payment Validation Schemas (Zod)
 * Author: Suchitra (Backend & Database Developer)
 */

const { z } = require('zod');

const createDonationOrderSchema = z.object({
  amount: z.coerce.number().min(10, 'Minimum donation amount is ₹10'),
  currency: z.string().default('INR'),
  donor_name: z.string().min(2, 'Donor name is required').max(150).optional(),
  donorName: z.string().min(2, 'Donor name is required').max(150).optional(),
  donor_email: z.string().email('Valid donor email is required').optional(),
  donorEmail: z.string().email('Valid donor email is required').optional(),
  donor_phone: z.string().optional().nullable(),
  donorPhone: z.string().optional().nullable(),
  donor_pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid Indian PAN format (e.g. ABCDE1234F)')
    .optional()
    .nullable()
    .or(z.literal('')),
  donorPan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid Indian PAN format (e.g. ABCDE1234F)')
    .optional()
    .nullable()
    .or(z.literal('')),
  donor_address: z.string().optional().nullable(),
  donorAddress: z.string().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  is_anonymous: z.coerce.boolean().optional().default(false),
  isAnonymous: z.coerce.boolean().optional(),
  is_80g_claimed: z.coerce.boolean().optional(),
  require80G: z.coerce.boolean().optional()
}).refine(data => Boolean(data.donor_name || data.donorName), {
  message: 'Donor name is required',
  path: ['donor_name']
}).refine(data => Boolean(data.donor_email || data.donorEmail), {
  message: 'Valid donor email is required',
  path: ['donor_email']
}).refine(data => {
  const is80GClaimed = data.is_80g_claimed !== undefined
    ? data.is_80g_claimed
    : data.require80G !== undefined
      ? data.require80G
      : false;
  return !is80GClaimed || Boolean(data.donor_pan || data.donorPan);
}, {
  message: 'Donor PAN is required when requesting 80G documentation',
  path: ['donor_pan']
}).transform(data => ({
  amount: data.amount,
  currency: data.currency || 'INR',
  donor_name: data.donor_name || data.donorName,
  donor_email: data.donor_email || data.donorEmail,
  donor_phone: data.donor_phone || data.donorPhone || null,
  donor_pan: data.donor_pan || data.donorPan || null,
  donor_address: data.donor_address || data.donorAddress || null,
  project_id: data.project_id || data.projectId || null,
  is_anonymous: data.is_anonymous || data.isAnonymous || false,
  is_80g_claimed: data.is_80g_claimed !== undefined ? data.is_80g_claimed : (data.require80G !== undefined ? data.require80G : false)
}));

const createManualDonationSchema = z.object({
  amount: z.coerce.number().finite().min(50, 'Minimum donation amount is ₹50'),
  donorName: z.string().trim().min(2).max(150),
  donorEmail: z.string().trim().email().max(255),
  donorPhone: z.string().trim().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/).optional().nullable().or(z.literal('')),
  donorPan: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/).optional().nullable().or(z.literal('')),
  donorAddress: z.string().trim().max(1000).optional().nullable(),
  paymentReference: z.string().trim().min(6).max(100).regex(/^[A-Za-z0-9_-]+$/),
  projectId: z.string().uuid().optional().nullable(),
  require80G: z.boolean().optional().default(false)
}).refine((data) => !data.require80G || Boolean(data.donorPan), {
  message: 'A valid PAN is required when requesting 80G documentation',
  path: ['donorPan']
}).transform((data) => ({
  amount: data.amount,
  currency: 'INR',
  donor_name: data.donorName,
  donor_email: data.donorEmail.toLowerCase(),
  donor_phone: data.donorPhone || null,
  donor_pan: data.donorPan || null,
  donor_address: data.donorAddress || null,
  project_id: data.projectId || null,
  is_80g_claimed: data.require80G,
  payment_reference: data.paymentReference.toUpperCase()
}));

const verifyPaymentSchema = z.object({
  donation_id: z.string().optional(),
  donationId: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  orderId: z.string().optional(),
  razorpay_payment_id: z.string().optional(),
  paymentId: z.string().optional(),
  razorpay_signature: z.string().optional(),
  signature: z.string().optional()
}).refine(data => Boolean(data.donation_id || data.donationId), {
  message: 'Valid donation ID required',
  path: ['donation_id']
}).refine(data => Boolean(data.razorpay_order_id || data.orderId), {
  message: 'Order ID is required',
  path: ['razorpay_order_id']
}).refine(data => Boolean(data.razorpay_payment_id || data.paymentId), {
  message: 'Payment ID is required',
  path: ['razorpay_payment_id']
}).refine(data => Boolean(data.razorpay_signature || data.signature), {
  message: 'Payment signature is required',
  path: ['razorpay_signature']
}).transform(data => ({
  donation_id: data.donation_id || data.donationId,
  donationId: data.donation_id || data.donationId,
  razorpay_order_id: data.razorpay_order_id || data.orderId,
  razorpayOrderId: data.razorpay_order_id || data.orderId,
  razorpay_payment_id: data.razorpay_payment_id || data.paymentId,
  razorpayPaymentId: data.razorpay_payment_id || data.paymentId,
  razorpay_signature: data.razorpay_signature || data.signature,
  razorpaySignature: data.razorpay_signature || data.signature
}));

module.exports = {
  createDonationOrderSchema,
  createManualDonationSchema,
  verifyPaymentSchema
};
