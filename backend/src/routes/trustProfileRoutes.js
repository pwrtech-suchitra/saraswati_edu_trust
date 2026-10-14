/**
 * Trust Profile Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const trustProfileController = require('../controllers/trustProfileController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ROLES } = require('../utils/constants');

// Public endpoints
router.get('/profile', trustProfileController.getTrustProfile);
router.get('/activities', trustProfileController.getActivityPillars);
router.get('/mission-sustainable-india', trustProfileController.getMissionSustainableIndia);

// Admin-only updates
router.put('/profile', authenticate, requireRole(ROLES.ADMIN), trustProfileController.updateTrustProfile);

module.exports = router;
