const jwt = require('jsonwebtoken');
const { success, error, validation } = require('../helpers/api-response');
const winston = require('winston');

const HttpError = require('../helpers/http-error');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      //throw new Error('Authentication failed!');
      return res.status(401).json(error("Authentication failed!", res.statusCode));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    winston.error(`exception in check-auth, error:  ${err}`);
    return res.status(401).json(error("Authentication failed!", res.statusCode));
  
    //const error = new HttpError('Authentication failed!', 401);
    //return next(error);
  }
};
