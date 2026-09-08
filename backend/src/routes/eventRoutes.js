/**
 * Community Events Routes
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const router = express.Router();
const newsEventController = require('../controllers/newsEventController');
const validate = require('../middleware/validate');
const { eventRegistrationSchema } = require('../validations/contactValidation');

router.get('/', newsEventController.listEvents);
router.get('/:id', newsEventController.getEvent);
router.post('/:id/register', validate(eventRegistrationSchema), newsEventController.registerForEvent);

module.exports = router;
