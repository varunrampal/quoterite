const mongoose = require('mongoose');
const winston = require('winston');

const { User } = require('../models/user');
const { Receipt } = require('../models/receipt');
const HttpError = require('../helpers/http-error');


const getMonthlyTransactions = async (req, res, next) => {
  const userId = req.params.userid;
  const { year, month, timezone } = req.params;

  const from = new Date(year, +month);
  const to = new Date(year, +month + 1);

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new HttpError('Invalid user details.', 400);
      return next(error);
    } else {
      const id = mongoose.Types.ObjectId(userId);
      const receipts = await Receipt.aggregate([
        {
          $match: {
            user: id,
            date: { $gte: from, $lt: to }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                date: "$date",
                format: "%m, %d, %Y",
                timezone: timezone
              }
            },
            total: { $sum: "$amount" }
          }
        },
        {
          $sort: { _id: -1 }
        }
      ], function (err, result) {
          if(err !== null) {
            winston.error(`error in getMonthlyTransactions, error:  ${err}`);
          }
      })

      if (!receipts) {
        const error = new HttpError('No receipts for selected month', 404);
        return next(error);
      } else {
        res.status(200).json({ receipts });
      }
    }

  } catch {
    const error = new HttpError('Internal server error', 500);
    return next(error);
  }
};

module.exports = { getMonthlyTransactions };