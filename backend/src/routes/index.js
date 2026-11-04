/**
 * Central API Router (/api/v1)
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const newsRoutes = require('./newsRoutes');
const eventRoutes = require('./eventRoutes');
const mediaRoutes = require('./mediaRoutes');
const contactRoutes = require('./contactRoutes');
const adminRoutes = require('./adminRoutes');
const healthRoutes = require('./healthRoutes');
const projectController = require('../controllers/projectController');

const trustProfileRoutes = require('./trustProfileRoutes');
const trustProfileController = require('../controllers/trustProfileController');

// Mount Modules
router.use('/health', healthRoutes);
router.use('/trust', trustProfileRoutes);
router.get('/profile', trustProfileController.getTrustProfile);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.get('/categories', projectController.listCategories);
router.use('/news', newsRoutes);
router.use('/events', eventRoutes);
router.use('/', mediaRoutes);
router.use('/', contactRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
