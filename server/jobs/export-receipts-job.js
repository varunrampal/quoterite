const kue = require('kue');
const queue = kue.createQueue();
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const winston = require('winston');

const {
    Receipt
} = require('../models/receipt');
const {
    appEnums
} = require('../helpers/app-enums');
const emailJob = require('../jobs/send-email-job');
const {
    shortenUrl
} = require('../helpers/url-shortner');
const s3_controller = require('../controllers/s3-controller');
const fetch = require('node-fetch');

const fs = require('fs');
var AWS = require('aws-sdk');
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}.local`,
});
// console.log(process.env.Bucket);

const s3 = new AWS.S3({
    region: 'us-east-1',
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
});

const S3_BUCKET = process.env.Bucket;

const createJob = async (job) => {
    //get receipts by user id and month
    const receipts = await Receipt.find({
        user: job.userId,
        $expr: {
            $eq: [{
                    $month: '$date',
                },
                job.month,
            ],
        },
    }, {
        _id: 0,
        title: 1,
        amount: 1,
        category: 1,
        date: 1,
    }).map((doc) => {
        // console.log(doc['category']);
        return doc;
    });

    // if receipts are present in db
    if (receipts.length > 0) {
        // create a job
        job.data = receipts;
        queue.create('Export receipts', job).save();

        return appEnums.RECEIPT.OK;
    } else {
        return appEnums.RECEIPT.NODATA;
    }
};

//process job added to the queue - its a worker
queue.process('Export receipts', (job, DoneCallback) => {
    const {
        userId,
        month,
        data,
        email
    } = job.data;

    //file path
    const filePath = `${process.env.RECEIPTS_FILE_PATH}_${userId}_${month}.csv`;

    // generate a csv file of receipts
    const csvWriter = createCsvWriter({
        path: filePath,
        header: [{
                id: 'title',
                title: 'Title',
            },
            {
                id: 'amount',
                title: 'Amount',
            },
            {
                id: 'category',
                title: 'Category',
            },
            {
                id: 'date',
                title: 'Date',
            },
        ],
    });

    //write data to the file
    csvWriter
        .writeRecords(data)
        .then(() => {
            // file is created on the web server
            winston.info(
                `CSV file created, User: ${userId}, date: ${new Date()}, duration: ${month}`
            );

            //unique file name, pass this unique file name to S3
            const fileName = `${userId}_${month}.csv`;

            //Call s3 to upload the file and get response url
            const fileDetails = {
                fileName: fileName,
                fileType: 'csv',
                userId: userId,
            };

            // s3 file upload starts
            winston.info(
                `CSV file uploading on S3 starts, User: ${userId}, date: ${new Date()}, duration: ${month}`
            );

            s3_controller.s3ApiCall(fileDetails, function (response) {
                if (response.success) {

                    winston.info(
                        `CSV file uploaded User: ${userId}, date: ${new Date()}, duration: ${month}`
                    );
                    
                    //Read file from the web server 
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            winston.error(
                                `Error in reading CSV file from webserver File path: ${filePath}, User: ${userId}, date: ${new Date()}, duration: ${month}`
                            );
                        }
                        //send a signed request to S3
                        fetch(response.data.signedRequest, {
                                method: 'PUT',
                                body: data,
                            })
                            .then((resp) => {

                                //delete the file from local webserver
                                fs.unlink(filePath, (err) => {
                                    if (err) {
                                        winston.error(
                                            `Error in deleting CSV file from webserver: ${userId}, date: ${new Date()}, duration: ${month}`
                                        );
                                        return;
                                    }

                                    winston.info(
                                        `CSV File deleted from webserver User: ${userId}, date: ${new Date()}, duration: ${month}`
                                    );
                
                                    //Generate short link of csv file for email(not working because sengrid is wrapping it's on link)
                                    if (String(process.env.BITLY_LINKS) == 'true') {
                                        shortenUrl(response.data.url).then(
                                            (link) => {
                                                //Export receipts file after uploading it on S3
                                                 exportReceipts(email, link, DoneCallback);
                                            }
                                        );
                                    } else {
                                        //Export receipts file after uploading it on S3
                                        exportReceipts(email, s3ResponseUrl, DoneCallback);
                                    }
                                });
                            })
                            .catch((err) => {
                                winston.error(
                                        `Erro in sending signed request to S3: ${userId}, date: ${new Date()}, duration: ${month}`
                                    );
                            });
                    });
                }
            });

            DoneCallback();
        })
        .catch((error) => DoneCallback(error));
});


const exportReceipts = (emailId, fileDownloadLink, done) => {
    const exportReceiptBy = process.env.EXPORT_RECEIPT;

    switch (exportReceiptBy) {
        case appEnums.EXPORTRECEIPTS.EMAIL:
          
            sendEmail(emailId, fileDownloadLink, done);
            break;
    }
};

//create send email job by passing job to createEmailJob method
const sendEmail = (emailId, fileDownloadLink, done) => {
    //email data
    const job = {
        title: 'Send-Receipt-Email-Request-' + emailId,
        msg: {
            to: emailId,
            from: process.env.SENGRID_API_SENDER,
            subject: 'Ticket Checker receipts',
            text: 'You can download your receipts',
            html: '<strong>You can download your receipts: </strong><a href="' +
                fileDownloadLink +
                '">Click here</a>',
        },
    };

    //create job by calling createEmailJob method
    emailJob
        .createEmailJob(job)
        .then(() => {
            done();
        })
        .catch((error) => done(error));
};

module.exports = {
    createJob,
};