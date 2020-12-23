const {
    userSignupValidationRules,
    userloginValidationRules,
    userlistValidationRules,
    userCountValidationRules,
    validate,
} = require('../validators/user-validators');
const fs = require('fs');
const { success, error, validation } = require('../helpers/api-response');
const imageToBase64 = require('image-to-base64');
const multer = require('multer');
//const upload = multer({dest: __dirname + '/uploads/images'});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/receipts/images/upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const usersController = require('../controllers/users-controller');
const chartController = require('../controllers/chart-controller');
const reportController = require('../controllers/report-controller');
const { route } = require('./receipt-routes');

router.post(
    '/signup',
    userSignupValidationRules(),
    validate,
    usersController.signup
);

router.post(
    '/login',
    userloginValidationRules(),
    validate,
    usersController.login
);

router.post('/base64', upload.single('photo'), (req, res) => {
    if (req.file) {
       
        imageToBase64(req.file.path) // Path to the image
            .then((response) => {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        return res
                            .status(500)
                            .json(
                                error('Internal server error', res.statusCode)
                            );
                    }

                    return res
                        .status(200)
                        .json(
                            success(
                                'File created successfully',
                                { base64: response },
                                res.statusCode
                            )
                        );
                });
            });
    }
});

router.use(checkAuth);

router.get('/receipts/:duration&:timezone', usersController.getAllReceipt);

router.get(
    '/recenttransactions/:userid',
    usersController.getRecentTransactions
);

router.get('/topcategories/:userid', usersController.getTopCategories);
router.get('/monthlytransactions/:userid&:year&:month&:timezone', 
chartController.getMonthlyTransactions);
router.get('/monthlyreport/:userid&:year&:month&:timezone', 
reportController.getMonthlyReport);
router.get('/receipts/export/:month', usersController.exportReceipts);
router.post('/', usersController.getAllUsers);
router.get(
    '/total/:role',
     usersController.getTotalUsers
);
router.post('/update', usersController.updateUser);
router.post('/update/multi', usersController.updateUsers);
router.get(
    '/filter/:role&:page&:pagination&:value',
     usersController.FilterUsersByNameOrEmail
);

module.exports = router;
