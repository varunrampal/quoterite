
const { success, error } = require('../helpers/api-response');
const { Quote } = require('../models/quote');

// @route POST /quote
// @desc to create quote, returns quote id
// @access Private

const createQuote = async (req, res, next) => {
    const { submitedBy, property, items, notes, type, status, createDate, transportType, transportDate } = req.body;
      
    // quote object to save in the db
    let createdQuote = new Quote({
        submitedBy,
        property,
        items,
        notes,
        type,
        createDate,
        status,
        transportType,
        transportDate
    });

   // save quote in the db
    await createdQuote.save(function(err, doc) {
        if (err){ return res
            .status(500)
            .json(error('Unexpected error has occured. Please try again later', res.statusCode));
        }
        return res.status(201).json(
            success(
                'Quote created successfully.',
                {
                    quoteId: createdQuote.id,
                   
                },
                res.statusCode,
            ),
        );
      });
};


// @route GET quote/:id
// @desc get quote details
// @access Private

// const getQuote = async (req, res, next) => {
//     const quoteId = req.params.quoteid;

//     const quote = await Quote.findById(quoteId);

//     if (!quote) {
//         return res.status(400).json(error("Invalid quote id.", res.statusCode));
//     } else {
//         const userIdd = mongoose.Types.ObjectId(userId);
//         const receipts = await Receipt.aggregate(
//             [
//                 {
//                     $match: {
//                         user: userIdd,
//                     },
//                 },
//                 // Grouping pipeline
//                 {
//                     $group: {
//                         _id: '$category',
//                         total: {
//                             $sum: '$amount',
//                         },
//                     },
//                 },
//                 // Sorting pipeline
//                 {
//                     $sort: {
//                         total: -1,
//                     },
//                 },
//                 // Optionally limit results
//                 {
//                     $limit: 3,
//                 },
//             ],
//             function (err, result) {
//                 if (err !== null) {
//                     winston.error(`error in getMonthlyTransactions, error:  ${err}`);
//                 }
//             }
//         );
//         return res.status(200).json(
//             success(
//                 'Top categories.',
//                 {
//                     receipts,
//                 },
//                 res.statusCode
//             )
//         );
//     }
// };


module.exports = {
    createQuote
};
