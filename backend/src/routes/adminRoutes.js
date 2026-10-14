/**
 * Admin Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const contactController = require('../controllers/contactController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { ROLES } = require('../utils/constants');

// All admin routes require ADMIN role
router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.listUsers);
router.get('/inquiries', contactController.listInquiries);
router.put('/inquiries/:id/status', contactController.updateInquiryStatus);
router.patch('/inquiries/:id/status', contactController.updateInquiryStatus);

module.exports = router;
