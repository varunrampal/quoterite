const mongoose = require('mongoose');

const { User } = require('../models/user');
const { Receipt } = require('../models/receipt');
const HttpError = require('../helpers/http-error');

const getMonthlyReport = async (req, res, next) => {
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
          $project: {
            user: "$user",
            title: "$title",
            amount: "$amount",
            category: "$category",
            picture: "$picture",
            date: {
              $dateToString: {
                date: "$date",
                timezone: timezone
              }
            }
          }
        },
        {
          $sort: { date: -1 }
        }
      ], function (err, result) {
        console.log(err);
      })

      res.status(200).json({ receipts });
    }
  } catch {
    const error = new HttpError('Internal server error', 500);
    return next(error);
  }
};

module.exports = { getMonthlyReport };