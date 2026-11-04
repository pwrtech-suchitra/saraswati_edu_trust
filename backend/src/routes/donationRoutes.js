/**
 * Donations & Receipts Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { createDonationOrderSchema, createManualDonationSchema, verifyPaymentSchema } = require('../validations/donationValidation');

router.post('/manual', paymentLimiter, optionalAuth, validate(createManualDonationSchema), donationController.submitManualDonation);

// Initialize donation order
router.post('/create-order', paymentLimiter, optionalAuth, validate(createDonationOrderSchema), donationController.createOrder);

// Authoritative payment verification
router.post('/verify', paymentLimiter, validate(verifyPaymentSchema), donationController.verifyPayment);

// Donor donation history
router.get('/my-donations', authenticate, donationController.getMyDonations);

// Retrieve 80G tax receipt
router.get('/:id/receipt', authenticate, donationController.getReceipt);

module.exports = router;
