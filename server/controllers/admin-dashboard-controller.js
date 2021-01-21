const {
    success,
    error
} = require('../helpers/api-response');
const {
    User
} = require('../models/user');
const {
    Quote
} = require('../models/quote');

// @route GET quote/:id
// @desc get quote details
// @access Private

const getWidgetsData = async (req, res, next) => {
    try {
        const pendingQuotes = await Quote.find({
            status: 'OPEN'
        }).count();
        const userCount = await User.find({
            role: 0
        }).count();

        const latestQuotes = await Quote.aggregate([{
            
            $lookup: {
                from: "users",
                localField: "submitedBy",
                foreignField: "_id",
                as: "user"
            },
            
        },{
            $sort: {
              'id':-1
            }
        }]).limit(10);

        let quoteDetails = [];

       latestQuotes.forEach((quote) => {
            quoteDetails.push({
            id: quote.id,
            createDate: quote.createDate,
            status: quote.status,
            transportType: quote.transportType,
            transportDate: quote.transportDate,
            customerName: quote.user[0].name,
            customerEmail: quote.user[0].email,
            customerPhone: quote.user[0].phone
        });
       })

        
       // console.log(latestQuotes[0].user[0].email);

        return res.status(200).json(
            success(
                'Admin dashboard data', {
                    pendingQuotes,
                    totalCustomers: userCount,
                    latestQuotes:quoteDetails
                   
                },
                res.statusCode
            )
        );

    } catch (error) {
        console.log(error);

    }

}

module.exports = {
    getWidgetsData
}