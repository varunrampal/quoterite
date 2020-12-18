const winston = require('winston');

module.exports = function(err, req, res, next){
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug 
  // silly

  res.status(500).json({'message': 'Internal server error.'});
 // res.status(500).send('Internal server error.');
}