/**
 * News Articles Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const newsEventController = require('../controllers/newsEventController');

router.get('/', newsEventController.listNews);
router.get('/:id', newsEventController.getNewsArticle);

module.exports = router;
