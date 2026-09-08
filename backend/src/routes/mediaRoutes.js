/**
 * Media Gallery & Documents Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const upload = require('../middleware/upload');
const { ROLES } = require('../utils/constants');

// Media Gallery
router.get('/media', mediaController.listMedia);
router.post(
  '/media/upload',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.STAFF),
  upload.single('media_file'),
  mediaController.uploadMedia
);

// Documents
router.get('/documents', mediaController.listDocuments);
router.post(
  '/documents/upload',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.STAFF),
  upload.single('document_file'),
  mediaController.uploadDocument
);

module.exports = router;
