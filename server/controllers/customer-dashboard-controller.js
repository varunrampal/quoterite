const mongoose = require('mongoose');
const {
    success,
    error
} = require('../helpers/api-response');
const {
    Quote
} = require('../models/quote');

// @route GET quote/:id
// @desc get quote details
// @access Private

const getWidgetsData = async (req, res, next) => {
    try {
          
        const pendingQuotes = await Quote.find({
            _id:  req.params.userid },
            {status: 'OPEN'
        }).count();

        const repliedQuotes = await Quote.find({
            status: 'REPLIED'
        },{_id:  req.params.userid }).count();

        const latestQuotes = await Quote.find({
            submitedBy:  req.params.userid
        }).sort({id: -1}).limit(10);
            
         
        
       // console.log(latestQuotes[0].user[0].email);

        return res.status(200).json(
            success(
                'Admin dashboard data', {
                    pendingQuotes,
                    repliedQuotes,
                    latestQuotes
                   
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