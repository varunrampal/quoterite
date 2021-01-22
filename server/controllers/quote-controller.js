const { success, error } = require('../helpers/api-response');
const { User } = require('../models/user');
const { Quote } = require('../models/quote');
const emailJob = require('../jobs/send-email-job');
const {receiver_email, sender_email} = require('../utils/constants');
// @route POST /quote
// @desc to create quote, returns quote id
// @access Private

const createQuote = async (req, res, next) => {
    const {
        submitedBy,
        property,
        items,
        notes,
        type,
        status,
        createDate,
        transportType,
        transportDate,
    } = req.body;

    const user = await User.findById(submitedBy);

    if (!user) {
        res.status(400).json(error('Invalid user.', res.statusCode));
    } else {
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
            transportDate,
        });

        // save quote in the db
        await createdQuote.save(function (err, doc) {
            if (err) {
                return res
                    .status(500)
                    .json(
                        error(
                            'Unexpected error has occured. Please try again later',
                            res.statusCode,
                        ),
                    );
            } else {

                const receipentEmail = receiver_email !== '' ? receiver_email: user.email;
                //sendEmail(receipentEmail, user, createdQuote);
             
                return res.status(201).json(
                    success(
                        'Quote created successfully.',
                        {
                            quoteId: createdQuote.id,
                        },
                        res.statusCode,
                    ),
                );
            }
        });
    }
};

//create send email job by passing job to createEmailJob method
const sendEmail = (emailId, userObj, createdQuote) => {
    //email data
    let quoteList = '';

  createdQuote.items.forEach((item,i) => {
    quoteList = `${quoteList}<div>${i+1})${item.name}: ${item.quantity}</div>`; 
  });
    const job = {
        title: 'Send-quote-request-notification' + emailId,
        msg: {
            to: emailId,
            from: sender_email,
            subject: `New quote request - ${createdQuote.id}`,
            text: 'New quote request is submitted by the user',
            html: `<strong>A new quote ${createdQuote.id} is submitted</strong><br><br>
            <strong>Customer</strong>: 
            Name: ${userObj.name}<br>
            Email: ${userObj.email}<br>
            Phone: ${userObj.phone} <br><br>
            <strong>Quote details</strong><br>
            ${quoteList}<br><br>
            <strong>Mode</strong>: ${createdQuote.transportType}<br>
            <strong>Date</strong>: ${createdQuote.transportDate}`
        },
    };

    //create job by calling createEmailJob method
    emailJob
        .createEmailJob(job)
        .then(() => {
            //done();
        })
        .catch((error) => console.log(error)); //done(error));
};

// @route GET quote/:id
// @desc get quote details
// @access Private

const getPendingQuotes = async (req, res, next) => {

    const pendingQuotes = await Quote.find({status: 'OPEN'}).count();
    return res.status(200).json(
            success(
                'Pending quotes.',
                {
                    pendingQuotes,
                },
                res.statusCode
            )
        );
    }

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
    createQuote,
    getPendingQuotes
};
