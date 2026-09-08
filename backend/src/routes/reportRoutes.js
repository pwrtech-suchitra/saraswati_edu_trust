/**
 * Reports Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ROLES } = require('../utils/constants');

// Protected for ADMIN and STAFF
router.use(authenticate, requireRole(ROLES.ADMIN, ROLES.STAFF));

router.get('/donations', reportController.getDonationReports);
router.get('/80g', reportController.get80GReports);

module.exports = router;
