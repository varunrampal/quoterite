const express = require('express');
const router = express.Router();

const s3_controller = require('../controllers/s3-controller');
const checkAuth = require('../middleware/check-auth');

// router.use(checkAuth);

router.post('/', s3_controller.sign_s3);

module.exports = router;
