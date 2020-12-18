const winston = require('winston');
const mongoose = require('mongoose');
const {DB_CONNECTION_STRING} = require('../utils/constants');
module.exports = function() {
  // Connect to database and start server
mongoose
    .connect(DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => winston.info('Connected to MongoDB...'))
    .catch((err) => {
        console.log(err);
    });
}