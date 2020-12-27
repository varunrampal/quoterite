const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const mongoose = require('mongoose');
const kue = require('kue');
//const queue = kue.createQueue();
//const winston = require('winston');

const { success, error } = require('../helpers/api-response');
const { User } = require('../models/user');
//const { Receipt } = require('../models/receipt');
//const HttpError = require('../helpers/http-error');
//const job = require('../jobs/export-receipts-job');
//const { appEnums } = require('../helpers/app-enums');
const {JWT_KEY} = require('../utils/constants');

// @route POST /user/signup
// @desc to register user, returns userid, email and token
// @access Public
// const signup = async (req, res, next) => {
//     const { name, email, password, phone } = req.body;
//     //throw new Error('Could not sign up the user');
//     const hasUser = await User.findOne({
//         email: email,
//     });

//     // if user with the provided email already exists
//     if (hasUser) {
//         return res.status(422).json(error("User already exists.", res.statusCode));
//     }

//     // hash the password
//     let hashedPassword;
//     hashedPassword = await bcrypt.hash(password, 12);

//     // user object to save in the db
//     let createdUser = new User({
//         name,
//         email,
//         phone,
//         password: hashedPassword,
//         role: 0,
//         active: true
//     });

//     // save user in the db
//     await createdUser.save();

//     // generate token
//     let token;
//     token = jwt.sign(
//         {
//             usrId: createdUser.id,
//             email: createdUser.email,
//         },
//         //process.env.JWT_KEY,
//         JWT_KEY,
//         {
//             expiresIn: '1h',
//         }
//     );
//     return res.status(201).json(
//         success(
//             'You are signed up successfully.',
//             {
//                 userId: createdUser.id,
//                 userName: createdUser.name,
//                 userRole: createdUser.role,
//                 userEmail: createdUser.email,
//                 token: token,
//             },
//             res.statusCode
//         )
//     );
// };

// @route POST /user/login
// @desc to authenticate user, returns userid, email and token
// @access Public
const login = async (req, res, next) => {
    const { email, password } = req.body;

    // check if user with the provided email-id exists
    let existingUser;

    existingUser = await User.findOne({
        email: email,
        active: 1
    });

    //user not exists with the provide email-id
    if (!existingUser) {
       
        return res.status(401).json(error("Invalid credentials.", res.statusCode));
    }


    // check if provided password is correct( compare the password with the password saved in the database)
    let isValidPassword = false;

    isValidPassword = await bcrypt.compare(password, existingUser.password);

    // Password is not valid
    if (!isValidPassword) {
     
        return res.status(401).json(error("Invalid credentials.", res.statusCode));
    }

    // generate token
    let token;

    token = jwt.sign(
        {
            userId: existingUser.id,
            email: existingUser.email,
        },
        //process.env.JWT_KEY,
        JWT_KEY,
        {
            expiresIn: '1h',
        }
    );

     res.status(200).json(
        success(
            'You are logged in successfully.',
            {
                userId: existingUser.id,
                userName: existingUser.name,
                userRole: existingUser.role,
                userEmail: existingUser.email,
                token: token,
            },
            res.statusCode
        )
    );
};

// @route GET user/receipts
// @desc get ALL receipts for that user with given duration.
// duration can be: daily, weekly, monthly, annual
// @access Private
// const getAllReceipt = async (req, res, next) => {
//     const userId = req.userData.userId;
//     const { duration, timezone } = req.params;
//     let days = 0;
//     if (duration !== 'all') {
//         switch (duration) {
//             case 'daily':
//                 days = 1;
//                 break;
//             case 'weekly':
//                 days = 7;
//                 break;
//             case 'monthly':
//                 days = 30;
//                 break;
//             case 'annually':
//                 days = 365;
//                 break;
//         }
//     }
//     try {
//         const id = mongoose.Types.ObjectId(userId);

//         if (duration !== 'all') {
//             const dateSince = new Date(new Date() - days * 60 * 60 * 24 * 1000);
//             const receipts = await Receipt.aggregate([
//                 {
//                     $match: {
//                         user: id,
//                         date: { $gte: dateSince }
//                     }
//                 },
//                 {
//                     $project: {
//                         user: "$user",
//                         title: "$title",
//                         amount: "$amount",
//                         category: "$category",
//                         picture: "$picture",
//                         date: {
//                             $dateToString: {
//                                 date: "$date",
//                                 timezone: timezone
//                             }
//                         }
//                     }
//                 },
//                 {
//                     $sort: { date: -1 }
//                 }
//             ], function (err, result) {
//                 console.log(err);
//             })

//             res.status(200).json(receipts);
//         } else {
//             const receipts = await Receipt.aggregate([
//                 {
//                     $match: {
//                         user: id,
//                     }
//                 },
//                 {
//                     $project: {
//                         user: "$user",
//                         title: "$title",
//                         amount: "$amount",
//                         category: "$category",
//                         picture: "$picture",
//                         date: {
//                             $dateToString: {
//                                 date: "$date",
//                                 timezone: timezone
//                             }
//                         }
//                     }
//                 },
//                 {
//                     $sort: { date: -1 }
//                 }
//             ], function (err, result) {
//                 console.log(err);
//             })

//             res.status(200).json(receipts);
//         }
//     } catch {
//         const error = new HttpError('Server Error', 500);
//         return next(error);
//     }
// };

// @route GET user/recent transactions
// @desc get user recent transactions.
// @access Private
// const getRecentTransactions = async (req, res, next) => {
//     const userId = req.params.userid;

//     const user = await User.findById(userId);

//     if (!user) {
//         return res.status(400).json(error("Invalid user details.", res.statusCode));
//     } else {
//         const receipts = await Receipt.find({
//             user: userId,
//         })
//             .sort({
//                 date: -1,
//             })
//             .limit(3);

//         return res.status(200).json(
//             success(
//                 'Recent transactions',
//                 {
//                     transactions: receipts,
//                 },
//                 res.statusCode
//             )
//         );
//     }
// };

// @route GET user/topcategories
// @desc get user top categories.
// @access Private

// const getTopCategories = async (req, res, next) => {
//     const userId = req.params.userid;

//     const user = await User.findById(userId);

//     if (!user) {
//         return res.status(400).json(error("Invalid user details.", res.statusCode));
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

// @route GET user/receipts/export
// @desc get user receipts in a csv file.
// @access Private

// const exportReceipts = async (req, res, next) => {

//     const userId = req.headers['userid'];
//     const month = parseInt(req.params.month);
//     const userIdd = mongoose.Types.ObjectId(userId);

//     //check if user exists with userid
//     const user = await User.findById(userIdd);

//     if (!user) {

//         return res.status(400).json(error("Invalid user details.", res.statusCode));
//     }

//     //create job by calling createJob method
//     const result = job.createJob({
//         title: 'Receipt-Export-Request-' + userId,
//         userId: userIdd,
//         month: month,
//         email: user.email,
//     });

//     // check response from createJob method
//     const response = await result;

//     if (response == appEnums.RECEIPT.OK) {
//         // send success response to the user
//         return res.status(201).json(
//             success(
//                 'File created successfully',
//                 {},
//                 res.statusCode
//             )
//         );

//     } else if (response == appEnums.RECEIPT.NODATA) {
//         //send error response to the user
//         return res.status(404).json(error("No receipts found.", res.statusCode));
//     }

// };

// const getTotalUsers = async (req, res, next) => {
//     const role = parseInt(req.params.role);
//     const userCount = await User.find({role}).count();
//     res.status(200).json(
//         success(
//             'Users count',
//             {
//                 userCount,
//             },
//             res.statusCode
//         )
//     );
// };


// @route GET/
// @desc get all users based on role.
// @access Private

// const getAllUsers = async (req, res, next) => {

//      const pagination = req.body.pagination ? parseInt(req.body.pagination) : 10;
   
//     //PageNumber From which Page to Start 
//     const pageNumber = req.body.page ? parseInt(req.body.page) : 1;

//      const users = await User.find({
//         role:req.body.role
//     }, { name: 1, email: 1, phone: 1, _id: 1, active: 1 })
//     .sort({"name" : 1})
//         .skip((pageNumber - 1) * pagination)
//         .limit(pagination);

//        res.status(200).json(
//             success(
//                 'Users list',
//                 {
//                     users,
//                 },
//                 res.statusCode
//             )
//         );
// };


// const FilterUsersByNameOrEmail = async (req, res, next) => {

//     const pagination =req.params.pagination ? parseInt(req.params.pagination) : 10;
//     const pageNumber = req.params.page ? parseInt(req.params.page) : 1;
//     const { role, value} = req.params;

//     const userCount = await User.find({ $or:[{name:{ $regex: value + '.*', $options: 'i' }},{email: { $regex: value + '.*', $options: 'i' }}], role:role}).count();
  
//     const users = await User.find({
//         $or:[{name:{ $regex: value + '.*', $options: 'i' }},{email: { $regex: value + '.*', $options: 'i' }}], role:role
    
//    }, { name: 1, email: 1, _id: 1, active: 1 })
//    .sort({"name" : 1})
//        .skip((pageNumber - 1) * pagination)
//        .limit(pagination);

//       res.status(200).json(
//            success(
//                'Filtered users list',
//                {
//                    users,
//                    totalRecords:userCount
//                },
//                res.statusCode
//            )
//        );
// };


// const updateUser = async(req, res, next) => {

//     const user = await User.findById(req.body.id);
 
//     if (!user) {
//         res.status(400).json(error("Invalid user details.", res.statusCode));
//     } else {

//       //update user
//       const newUser = await User.findOneAndUpdate(
//         { _id: req.body.id },
//           req.body,
//         { new: true }
//     );

//     await newUser.save();
    
//     res.status(200).json(
//         success(
//             'user updated',
//             {
//                 isUpdated: 1,
//             },
//             res.statusCode
//         )
//     );
//  }
 
// }

// const updateUsers = async(req, res) => {

//     const criteria = {
//         _id:{ $in: req.body.custIds.split(',')}
//        };

//      await User.update(criteria,  req.body, { multi: true }, function(err, res) {
//         if (err) {
//             res.status(400).json(error("error occurred.", res.statusCode));
//         } else { 
//             res.status(200).json(
//                 success(
//                     'users updated',
//                     {
//                         isUpdated: 1,
//                     },
//                     res.statusCode
//                 )
//             );
//         }
//      });
// }

module.exports = {
    login  
};

// signup,
//     login,
//     getAllReceipt,
//     getRecentTransactions,
//     getTopCategories,
//     exportReceipts,
//     getAllUsers,
//     getTotalUsers,
//     updateUser,
//     updateUsers,
//     FilterUsersByNameOrEmail