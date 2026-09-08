/**
 * Projects & Categories Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { createProjectSchema, updateProjectSchema } = require('../validations/projectValidation');
const { ROLES } = require('../utils/constants');

// Public project routes
router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);

// Protected Admin / Staff project management
router.post(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.STAFF),
  upload.single('hero_image'),
  validate(createProjectSchema),
  projectController.createProject
);

router.put(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.STAFF),
  upload.single('hero_image'),
  validate(updateProjectSchema),
  projectController.updateProject
);

router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN),
  projectController.deleteProject
);

module.exports = router;
