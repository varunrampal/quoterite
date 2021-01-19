const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const quoteController = require('../controllers/quote-controller');

//router.use(checkAuth);
router.post('/create', quoteController.createQuote);
router.get('/pending', quoteController.getPendingQuotes);

module.exports = router;
