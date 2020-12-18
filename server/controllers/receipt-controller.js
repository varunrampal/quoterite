const { Receipt } = require('../models/receipt');
const HttpError = require('../helpers/http-error');
const { success, error, validation } = require('../helpers/api-response');

// @route POST /receipt
// @desc  given params passed in, create a post
// @access Private
const createReceipt = async (req, res, next) => {
    const { title, amount, category, date, picture } = req.body;
    const user = req.userData.userId;

    try {
        //create new receipt
        const newReceipt = new Receipt({
            title: title,
            user: user,
            amount: amount,
            category: category,
            date: date,
            picture: picture,
        });

        const receipt = await newReceipt.save();

        return res.json(receipt);
    } catch (err) {
        const error = new HttpError('Internal Server Error', 500);
        return next(error);
    }
};

// @route PUT /receipt/:id
// @desc  given an ID and new params, update the receipt
// @access Private
const updateReceipt = async (req, res, next) => {
    try {
        // check
        const receipt = await Receipt.findById(req.params.id);
        if (!receipt) {
            const error = new HttpError('Receipt not found', 404);
            return next(error);
        }
      
        if (receipt.user != req.userData.userId) {
            const error = new HttpError('Not Authorized', 401);
            return next(error);
        }

        //update receipt
        const newReceipt = await Receipt.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        await newReceipt.save();
        return res.json(newReceipt);
    } catch (err) {
        const error = new HttpError('Server Error', 500);
        return next(error);
    }
};

// @route GET /receipt/:id
// @desc given and id, return receipt with that ID
// @access Private
const getReceipt = async (req, res, next) => {
    try { 
        const receipt = await Receipt.findById(req.params.id);
        if (!receipt) {
       
            return res.status(404).json(error("Receipt not found", res.statusCode));
        }

        if (receipt.user != req.userData.userId) {
            const error = new HttpError('Not Authorized', 401);
            return next(error);
        }
       
        return res.json(receipt);
    } catch (err) {
       
        console.log(err);
        const error = new HttpError('Server Error', 500);
        return next(error);
    }
};

module.exports = {
    createReceipt,
    updateReceipt,
    getReceipt,
};
