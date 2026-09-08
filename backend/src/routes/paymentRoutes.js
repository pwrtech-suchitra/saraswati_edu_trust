/**
 * Payment Webhooks Route
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Gateway Webhook
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
