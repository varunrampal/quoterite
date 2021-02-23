const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const quoteController = require('../controllers/quote-controller');

//router.use(checkAuth);
router.get('/pending', quoteController.getPendingQuotes);
router.get('/count', quoteController.getTotalQuotes);
router.get('/admin/:quoteid', quoteController.getAdminQuote);
router.post('/admin/quotes', quoteController.getAllAdminQuotes);
router.post('/create', quoteController.createQuote);

module.exports = router;
