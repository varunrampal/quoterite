const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const adminDashboardController = require('../controllers/admin-dashboard-controller');

//router.use(checkAuth);

router.get(
    '/dashboard/widget',
    adminDashboardController.getWidgetsData
);

module.exports = router;
