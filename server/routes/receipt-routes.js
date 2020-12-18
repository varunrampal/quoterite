const express = require('express');
const router = express.Router();

const receiptController = require('../controllers/receipt-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.post('/', receiptController.createReceipt);

router.put('/:id', receiptController.updateReceipt);

router.get('/:id', receiptController.getReceipt);

module.exports = router;
