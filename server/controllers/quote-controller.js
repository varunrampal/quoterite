const { success, error } = require('../helpers/api-response');
const { User } = require('../models/user');
const { Quote } = require('../models/quote');
const { QuoteDetails } = require('../models/quoteDetails');
const { QuoteReply } = require('../models/quotereply');

const { Item } = require('../models/item');
const { Property } = require('../models/property');
//const emailJob = require('../jobs/send-email-job');
const { receiver_email, sender_email } = require('../utils/constants');
const sgMail = require('@sendgrid/mail');
const winston = require('winston');
const { SENDGRID_API_KEY } = require('../utils/constants');

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
                const receipentEmail =
                    receiver_email !== '' ? receiver_email : user.email;
                sendEmail(receipentEmail, user, createdQuote);
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

    createdQuote.items.forEach((item, i) => {
        quoteList = `${quoteList}<div>${i + 1})${item.name}: ${
            item.quantity
        }</div>`;
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
            <strong>Date</strong>: ${createdQuote.transportDate}`,
        },
    };

    try {
        //setup API key
        sgMail.setApiKey(SENDGRID_API_KEY);

        //Send mail
        sgMail
            .send(job.msg)
            .then((result) => {
                //email sent
                winston.info(
                    `Email sent, User: ${job.msg.to}, date: ${new Date()}`,
                );
                // DoneCallback();
                //return result;
            })
            .catch((error) => console.log(error));
    } catch (ex) {
        winston.info(
            `Error in sending email, User: ${
                job.msg.to
            }, date: ${new Date()}, error: ${ex}`,
        );
    }

    //create job by calling createEmailJob method
    // emailJob
    //     .createEmailJob(job)
    //     .then(() => {
    //         //done();
    //     })
    //     .catch((error) => console.log(error)); //done(error));
};

// @route GET quote/:id
// @desc get quote details
// @access Private

const getPendingQuotes = async (req, res, next) => {
    const pendingQuotes = await Quote.find({
        status: 'OPEN',
    }).count();
    return res.status(200).json(
        success(
            'Pending quotes.',
            {
                pendingQuotes,
            },
            res.statusCode,
        ),
    );
};

// @route GET quote/count
// @desc get quotes count
// @access Private
const getTotalQuotes = async (req, res, next) => {
    const quoteCount = await Quote.find().count();
    res.status(200).json(
        success(
            'Quotes count',
            {
                quoteCount,
            },
            res.statusCode,
        ),
    );
};

// @route POST quote/admin/quotes
// @desc get all quotes
// @access Private

const getAllAdminQuotes = async (req, res, next) => {
    try {
        const pagination = req.body.pagination
            ? parseInt(req.body.pagination)
            : 10;

        //PageNumber From which Page to Start
        const pageNumber = req.body.page ? parseInt(req.body.page) : 1;

        const Quotes = await Quote.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'submitedBy',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'property',
                },
            },
            {
                $unwind: '$property',
            },
            {
                $sort: {
                    id: -1,
                },
            },
        ])
            .skip((pageNumber - 1) * pagination)
            .limit(pagination);

        let quoteDetails = [];
        Quotes.forEach((quote) => {
            quoteDetails.push({
                id: quote.id,
                createDate: quote.createDate,
                status: quote.status,
                transportType: quote.transportType,
                transportDate: quote.transportDate,
                customerName: quote.user.name,
                customerEmail: quote.user.email,
                customerPhone: quote.user.phone,
                property: quote.property,
            });
        });
        res.status(200).json(
            success(
                'Quotes list',
                {
                    Quotes: quoteDetails,
                },
                res.statusCode,
            ),
        );
    } catch (err) {
        res.status(500).json(
            error(
                'Unexpected error has occured. Please try again later',
                res.statusCode,
            ),
        );
    }
};

// @route GET quote/admin/:id
// @desc get quote details
// @access Private

const getAdminQuote = async (req, res, next) => {
    try {
        const quoteId = req.params.quoteid;

        const quote = await Quote.findOne({
            id: quoteId,
        });

        if (!quote) {
            return res.status(400).json(error('Invalid quote', res.statusCode));
        }

        const quoteItems = quote.items;

        if (quoteItems.length > 0) {
            let propertyDetails = '';
            let user = {};
            let property = {};
            for (let item in quoteItems) {
                let itemDetails = await Item.find(
                    {
                        id: quoteItems[item].id,
                    },
                    {
                        id: 1,
                        stock: 1,
                        price: 1,
                        commonName: 1,
                        _id: 0,
                    },
                );

                quoteItems[item].stock = itemDetails[0].stock;
                quoteItems[item].price = itemDetails[0].price;
                quoteItems[item].commonName = itemDetails[0].commonName;
            }
            const userDetails = await User.findOne({
                _id: quote.submitedBy,
            });
            user = {
                name: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone,
            };

            if (quote.type === 'PROPERTY') {
                propertyDetails = await Property.findOne({
                    _id: quote.property,
                });

                property = {
                    address: propertyDetails.address,
                    name: propertyDetails.name,
                    email: propertyDetails.custEmail,
                    phone: propertyDetails.phone,
                };
            }

            let quoteDetails = new QuoteDetails({
                id: quoteId,
                user,
                property,
                items: quoteItems,
                notes: quote.notes,
                type: quote.type,
                createDate: quote.CreateDate,
                status: quote.status,
                transportType: quote.transportType,
                transportDate: quote.transportDate,
            });

            res.status(200).json(
                success(
                    'Quote Details',
                    {
                        quoteDetails,
                    },
                    res.statusCode,
                ),
            );
        }
    } catch (err) {
        res.status(500).json(
            error(
                'Unexpected error has occured. Please try again later',
                res.statusCode,
            ),
        );
    }
};

// @route POST /quote
// @desc to save quotereply
// @access Private

const SaveQuoteReply = async (req, res, next) => {
    const {
        id,
        from,
        date,
        notes,
        items,
        transportType,
        transportDate,
    } = req.body;

    let quoteReply = new QuoteReply({
        from: from,
        date: date,
        notes: notes,
        items: items,
        transportType: transportType,
        transportDate: transportDate,
    });
  
    Quote.findOneAndUpdate(
        { id: id },
        { $push: { reply: quoteReply } },
        function (error, doc) {
            if (error) {
                res.status(400).json(error('Unable to perform operation.', res.statusCode));
            } else {
                res.status(200).json(
                    success(
                        'Quote Reply',
                        {
                            quoteReply,
                        },
                        res.statusCode,
                    ),
                );
            }
        },
    );
  
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
    createQuote,
    getPendingQuotes,
    getAdminQuote,
    getAllAdminQuotes,
    getTotalQuotes,
    SaveQuoteReply,
};
