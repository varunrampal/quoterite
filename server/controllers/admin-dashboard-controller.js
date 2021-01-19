const { success, error } = require('../helpers/api-response');
const { User } = require('../models/user');
const { Quote } = require('../models/quote');

// @route GET quote/:id
// @desc get quote details
// @access Private

const getWidgetsData = async (req, res, next) => {
    try {
        const pendingQuotes = await Quote.find({status: 'OPEN'}).count();
        const userCount = await User.find({role:0}).count();
        const latestQuotes = await Quote.find({}).sort().limit(10);
    
         const test =  Quote.aggregate({ $lookup: {from : "User", localField: "submitedBy", foreignField: "__id", as : "barcaInWorldXI"}})
         console.log(test);
        return res.status(200).json(
                success(
                    'Admin dashboard widgets.',
                    {
                        pendingQuotes,
                        totalCustomers: userCount,
                        latestQuotes
                    },
                    res.statusCode
                )
            );

    }catch(error){
          console.log(error);

    }
   
    }

    module.exports = {getWidgetsData}