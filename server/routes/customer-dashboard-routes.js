const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const customerDashboardController = require('../controllers/customer-dashboard-controller');

router.use(checkAuth);

router.get(
    '/dashboard/widget/:userid',
    customerDashboardController.getWidgetsData
);

module.exports = router;
