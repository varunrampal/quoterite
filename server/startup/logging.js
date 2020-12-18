const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');


module.exports = function () {

    //This event is raised when we have exception in the node process
    //but nowhere we have handeled that exception
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    //Unhandeled promise rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    //winston logging setup
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(
        new winston.transports.MongoDB({
            db: process.env.DB_CONNECTION_STRING,
            level: 'info',
        })
    );
};
