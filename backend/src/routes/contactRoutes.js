/**
 * Inquiries & Volunteer Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const validate = require('../middleware/validate');
const { contactInquirySchema, volunteerApplicationSchema } = require('../validations/contactValidation');

// Submit public contact inquiry
router.post('/contact', validate(contactInquirySchema), contactController.submitInquiry);

// Submit public volunteer application
router.post('/volunteers', validate(volunteerApplicationSchema), contactController.submitVolunteerApplication);

module.exports = router;
