
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item-controller');
const checkAuth = require('../middleware/check-auth');

//router.use(checkAuth);

router.get(
    '/searchbyname/:value',
    itemController.getItemsByNameOrAlternateName
);

module.exports = router;