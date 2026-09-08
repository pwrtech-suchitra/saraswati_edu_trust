/**
 * Central API Router (/api/v1)
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const donationRoutes = require('./donationRoutes');
const paymentRoutes = require('./paymentRoutes');
const newsRoutes = require('./newsRoutes');
const eventRoutes = require('./eventRoutes');
const mediaRoutes = require('./mediaRoutes');
const contactRoutes = require('./contactRoutes');
const adminRoutes = require('./adminRoutes');
const reportRoutes = require('./reportRoutes');
const healthRoutes = require('./healthRoutes');
const projectController = require('../controllers/projectController');

// Mount Modules
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.get('/categories', projectController.listCategories);
router.use('/donations', donationRoutes);
router.use('/payments', paymentRoutes);
router.use('/news', newsRoutes);
router.use('/events', eventRoutes);
router.use('/', mediaRoutes);
router.use('/', contactRoutes);
router.use('/admin', adminRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
