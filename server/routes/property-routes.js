const { success, error, validation } = require('../helpers/api-response');
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const propertyController = require('../controllers/property-controller');
//router.use(checkAuth);

router.post('/properties', propertyController.getProperties);

module.exports = router;