const { success, error } = require('../helpers/api-response');
const { User } = require('../models/user');
const { Quote } = require('../models/quote');

// @route GET quote/:id
// @desc get quote details
// @access Private

const getWidgetsData = async (req, res, next) => {
    const pendingQuotes = await Quote.find({status: 'OPEN'}).count();
    const userCount = await User.find({role:0}).count();
  
    return res.status(200).json(
            success(
                'Admin dashboard widgets.',
                {
                    pendingQuotes,
                    totalCustomers: userCount
                },
                res.statusCode
            )
        );
    }

    module.exports = {getWidgetsData}