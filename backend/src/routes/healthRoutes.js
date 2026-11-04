/**
 * Health Check Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/live', healthController.getLiveness);
router.get('/ready', healthController.getHealth);
router.get('/', healthController.getHealth);

module.exports = router;
